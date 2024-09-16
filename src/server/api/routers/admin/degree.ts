import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedAdminProcedure } from "~/server/api/trpc";
import {
  creditsRequired,
  degree,
  degreeOccurrence,
  degreeRequiredModule,
  moduleOccurrence,
  moduleTracking,
} from "~/server/db/schema";
import { generateDegreeRequiredRules } from "~/server/libs/copyRules/degreeRequiredRules";

export const degreeRouter = createTRPCRouter({
  createDegree: protectedAdminProcedure
    .input(
      z.object({
        degreeCode: z.string().min(1, "Need to enter a Degree Code"),
        name: z.string().min(1, "Need to enter a Degree Name"),
        departmentRunningID: z.string().uuid(),
        lengthOfDegree: z
          .number({ invalid_type_error: "Need to enter a number" })
          .int()
          .min(1, "Too short a degree")
          .max(10, "Too long a degree"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(degree).values(input);
    }),

  // TODO: make this more readable
  createDegreeOccurrence: protectedAdminProcedure
    .input(
      z.object({
        degreeOccurrence: z.object({
          degreeCode: z.string(),
          yearStarting: z.number().int(),
        }),
        copyingRulesOf: z.string().uuid().optional(), // this is the degreeID that is being copied
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const [createdDegreeID] = await tx
          .insert(degreeOccurrence)
          .values(input.degreeOccurrence)
          .returning({ degreeID: degreeOccurrence.degreeID });

        // check degree was actually created
        if (createdDegreeID == undefined) {
          tx.rollback();
          return;
        }

        // checks if copying rule of another degree occcurrence
        if (input.copyingRulesOf == undefined) {
          return;
        }

        // copying degree required modules
        const [degreeYearStart] = await tx
          .select({ yearStarting: degreeOccurrence.yearStarting })
          .from(degreeOccurrence)
          .where(eq(degreeOccurrence.degreeID, input.copyingRulesOf));
        if (degreeYearStart == undefined) {
          // no degree to copy from just exit out and don't perform copying of rules
          return;
        }

        const degreeYearDifference =
          input.degreeOccurrence.yearStarting - degreeYearStart.yearStarting;

        const modulesOfDegreeCopied = await tx
          .select({
            moduleCode: moduleOccurrence.moduleCode,
            semester: moduleOccurrence.semester,
            year: moduleOccurrence.year,
          })
          .from(degreeRequiredModule)
          .innerJoin(
            moduleOccurrence,
            eq(moduleOccurrence.moduleID, degreeRequiredModule.moduleID),
          )
          .where(eq(degreeRequiredModule.degreeID, input.copyingRulesOf));

        if (modulesOfDegreeCopied.length > 0) {
          const getModulesQuery = generateDegreeRequiredRules({
            modules: modulesOfDegreeCopied,
            degreeYearDifference,
          });

          const moduleIDs: { moduleID: string }[] =
            await tx.execute(getModulesQuery);

          const degreeRequiredModulesToAdd = moduleIDs.map((val) => {
            return {
              degreeID: createdDegreeID.degreeID,
              moduleID: val.moduleID,
            };
          });
          if (degreeRequiredModulesToAdd.length > 0) {
            await tx
              .insert(degreeRequiredModule)
              .values(degreeRequiredModulesToAdd);
          }
        }

        // copying credits
        const creditsOfDegreeCopying = await tx
          .select({
            creditsRequired: creditsRequired.creditsRequired,
            semester: creditsRequired.semester,
            year: creditsRequired.year,
            moduleLevel: creditsRequired.moduleLevel,
          })
          .from(creditsRequired)
          .where(eq(creditsRequired.degreeID, input.copyingRulesOf));

        const creditsToInsert = creditsOfDegreeCopying.map((val) => {
          return {
            degreeID: createdDegreeID.degreeID,
            creditsRequired: val.creditsRequired,
            semester: val.semester,
            year: val.year,
            moduleLevel: val.moduleLevel,
          };
        });
        if (creditsToInsert.length > 0) {
          await tx.insert(creditsRequired).values(creditsToInsert);
        }

        // degree tracking rule
        const [trackingRulesOfDegreeCopying] = await tx
          .select({
            numberYearsTracking: moduleTracking.numberYearsTracking,
            numberCreditsTracked: moduleTracking.numberCreditsTracked,
          })
          .from(moduleTracking)
          .where(eq(moduleTracking.degreeID, input.copyingRulesOf));

        if (trackingRulesOfDegreeCopying != undefined) {
          await tx.insert(moduleTracking).values({
            degreeID: createdDegreeID.degreeID,
            ...trackingRulesOfDegreeCopying,
          });
        }
      });
    }),

  getSpecificDegreeByDegreeCode: protectedAdminProcedure
    .input(
      z.object({
        degreeCode: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select()
        .from(degreeOccurrence)
        .where(eq(degreeOccurrence.degreeCode, input.degreeCode));
      return output;
    }),

  getDegreeByDegreeID: protectedAdminProcedure
    .input(
      z.object({
        degreeID: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          degreeLength: degree.lengthOfDegree,
          yearStarting: degreeOccurrence.yearStarting,
          degreeName: degree.name,
        })
        .from(degree)
        .innerJoin(
          degreeOccurrence,
          eq(degreeOccurrence.degreeCode, degree.degreeCode),
        )
        .where(eq(degreeOccurrence.degreeID, input.degreeID));

      if (output[0] == undefined) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return output[0];
    }),

  deleteDegreeByDegreeCode: protectedAdminProcedure
    .input(
      z.object({
        degreeCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(degree)
        .where(eq(degree.degreeCode, input.degreeCode));
    }),

  deleteDegreeOccurrenceByDegreeCodeYearStarting: protectedAdminProcedure
    .input(
      z.object({
        degreeCode: z.string(),
        yearStarting: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(degreeOccurrence)
        .where(
          and(
            eq(degreeOccurrence.degreeCode, input.degreeCode),
            eq(degreeOccurrence.yearStarting, input.yearStarting),
          ),
        );
    }),
});
