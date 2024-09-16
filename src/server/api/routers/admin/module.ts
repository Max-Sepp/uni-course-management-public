import { and, eq } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createTRPCRouter, protectedAdminProcedure } from "~/server/api/trpc";
import {
  moduleItem,
  moduleNotSameTime,
  moduleOccurrence,
  prerequisiteModule,
} from "~/server/db/schema";
import { generateRules } from "~/server/libs/copyRules/moduleRules";

export const moduleRouter = createTRPCRouter({
  getSpecificModulesByModuleCode: protectedAdminProcedure
    .input(
      z.object({
        moduleCode: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select()
        .from(moduleOccurrence)
        .where(eq(moduleOccurrence.moduleCode, input.moduleCode));
      return output;
    }),

  createModule: protectedAdminProcedure
    .input(
      z.object({
        moduleCode: z.string().trim().min(1, "Need to enter a Module Code"),
        moduleName: z.string().trim().min(1, "Need to enter a Module Name"),
        moduleDescription: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(moduleItem).values(input);
    }),

  editModule: protectedAdminProcedure
    .input(
      z.object({
        updatedValues: z.object({
          moduleName: z.string().min(1, "Need to enter a Module Name"),
          moduleDescription: z.string(),
        }),
        editingModuleCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(moduleItem)
        .set(input.updatedValues)
        .where(eq(moduleItem.moduleCode, input.editingModuleCode));
    }),

  // TODO: make more readable
  createModuleOccurrence: protectedAdminProcedure
    .input(
      z.object({
        moduleOccurrence: z.object({
          moduleCode: z.string().trim(),
          semester: z
            .number()
            .int()
            .min(0, "This is too small a number to be a semester")
            .max(4, "This is too large a number to be a semester"),
          year: z
            .number()
            .int()
            .min(2000, "This is too small a year number")
            .max(10000, "This is too large a year number"),
          moduleLevel: z.number().int().min(4).max(10),
          credits: z.number().int().min(0),
        }),
        copyingRulesOf: z.string().uuid().optional(), // this is the moduleID that is being copied
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const [createdModuleID] = await tx
          .insert(moduleOccurrence)
          .values(input.moduleOccurrence)
          .returning({ moduleID: moduleOccurrence.moduleID });

        // check module was actually created
        if (createdModuleID == undefined) {
          tx.rollback();
          return;
        }

        // checks if copying rule of another module occcurrence
        if (input.copyingRulesOf == undefined) {
          return;
        }

        const [moduleYear] = await tx
          .select({ year: moduleOccurrence.year })
          .from(moduleOccurrence)
          .where(eq(moduleOccurrence.moduleID, input.copyingRulesOf));
        if (moduleYear == undefined) {
          // no module to copy from just exit out and don't perform copying of rules
          return;
        }

        const moduleYearDifference =
          input.moduleOccurrence.year - moduleYear.year;

        // not same time module copying

        const leftModulesNotSameTimeCopied = tx
          .select({
            moduleCode: moduleOccurrence.moduleCode,
            semester: moduleOccurrence.semester,
            year: moduleOccurrence.year,
          })
          .from(moduleNotSameTime)
          .innerJoin(
            moduleOccurrence,
            eq(moduleOccurrence.moduleID, moduleNotSameTime.module1),
          )
          .where(eq(moduleNotSameTime.module2, input.copyingRulesOf));

        const rightModulesNotSameTimeCopied = tx
          .select({
            moduleCode: moduleOccurrence.moduleCode,
            semester: moduleOccurrence.semester,
            year: moduleOccurrence.year,
          })
          .from(moduleNotSameTime)
          .innerJoin(
            moduleOccurrence,
            eq(moduleOccurrence.moduleID, moduleNotSameTime.module2),
          )
          .where(eq(moduleNotSameTime.module1, input.copyingRulesOf));

        const modulesNotSameTimeCopied = await union(
          leftModulesNotSameTimeCopied,
          rightModulesNotSameTimeCopied,
        );

        if (modulesNotSameTimeCopied.length > 0) {
          const getNotSameTimeModulesQuery = generateRules({
            modules: modulesNotSameTimeCopied,
            moduleYearDifference,
          });

          const moduleNotSameTimeIDs: { moduleID: string }[] = await tx.execute(
            getNotSameTimeModulesQuery,
          );

          const modulesNotSameTimeToAdd = moduleNotSameTimeIDs.map((val) => {
            return {
              module1: createdModuleID.moduleID,
              module2: val.moduleID,
            };
          });

          if (modulesNotSameTimeToAdd.length > 0) {
            await tx.insert(moduleNotSameTime).values(modulesNotSameTimeToAdd);
          }
        }

        // copy prerequisiteModules

        const prerequisiteModules = await tx
          .select({
            moduleCode: moduleOccurrence.moduleCode,
            semester: moduleOccurrence.semester,
            year: moduleOccurrence.year,
          })
          .from(prerequisiteModule)
          .innerJoin(
            moduleOccurrence,
            eq(
              moduleOccurrence.moduleID,
              prerequisiteModule.prerequisiteModule,
            ),
          )
          .where(eq(prerequisiteModule.moduleRequiring, input.copyingRulesOf));

        if (prerequisiteModules.length > 0) {
          const getModulesQuery = generateRules({
            modules: prerequisiteModules,
            moduleYearDifference,
          });

          const prerequisiteModuleIDs: { moduleID: string }[] =
            await tx.execute(getModulesQuery);

          const prerequisiteModulesToAdd = prerequisiteModuleIDs.map((val) => {
            return {
              moduleRequiring: createdModuleID.moduleID,
              prerequisiteModule: val.moduleID,
            };
          });

          if (prerequisiteModulesToAdd.length > 0) {
            await tx
              .insert(prerequisiteModule)
              .values(prerequisiteModulesToAdd);
          }
        }
      });
    }),

  deleteModuleByModuleCode: protectedAdminProcedure
    .input(
      z.object({
        moduleCode: z.string().trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(moduleItem)
        .where(eq(moduleItem.moduleCode, input.moduleCode));
    }),

  deleteModuleOccurrenceByModuleCodeSemesterYear: protectedAdminProcedure
    .input(
      z.object({
        moduleCode: z.string().trim(),
        semester: z.number().int(),
        year: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(moduleOccurrence)
        .where(
          and(
            eq(moduleOccurrence.moduleCode, input.moduleCode),
            eq(moduleOccurrence.semester, input.semester),
            eq(moduleOccurrence.year, input.year),
          ),
        );
    }),

  editModuleOccurrence: protectedAdminProcedure
    .input(
      z.object({
        moduleID: z.string().uuid(),
        moduleLevel: z
          .number()
          .int()
          .min(4, "This is too small a Module Level")
          .max(10, "This is too large a Module Level"),
        moduleCredits: z.number().int().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(moduleOccurrence)
        .set({ credits: input.moduleCredits, moduleLevel: input.moduleLevel })
        .where(eq(moduleOccurrence.moduleID, input.moduleID));
    }),
});
