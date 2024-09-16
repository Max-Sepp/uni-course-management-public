import { and, eq, ne, or } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createTRPCRouter, protectedAdminProcedure } from "~/server/api/trpc";
import {
  creditsRequired,
  degreeRequiredModule,
  moduleItem,
  moduleNotSameTime,
  moduleOccurrence,
  moduleTracking,
  prerequisiteModule,
} from "~/server/db/schema";

export const rulesRouter = createTRPCRouter({
  addDegreeRequiredModule: protectedAdminProcedure
    .input(
      z.object({
        degreeID: z.string().uuid(),
        moduleID: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(degreeRequiredModule).values(input);
    }),

  getDegreeRequiredModuleByDegreeID: protectedAdminProcedure
    .input(
      z.object({
        degreeID: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          moduleCode: moduleItem.moduleCode,
          moduleName: moduleItem.moduleName,
          credits: moduleOccurrence.credits,
          semester: moduleOccurrence.semester,
          year: moduleOccurrence.year,
        })
        .from(degreeRequiredModule)
        .innerJoin(
          moduleOccurrence,
          eq(degreeRequiredModule.moduleID, moduleOccurrence.moduleID),
        )
        .innerJoin(
          moduleItem,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(eq(degreeRequiredModule.degreeID, input.degreeID));
      return output;
    }),

  getDegreeRequiredModuleByDegreeIDFilterSemesterYear: protectedAdminProcedure
    .input(
      z.object({
        degreeID: z.string().uuid(),
        semester: z.number().int(),
        year: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          moduleCode: moduleItem.moduleCode,
          moduleName: moduleItem.moduleName,
          credits: moduleOccurrence.credits,
          semester: moduleOccurrence.semester,
          year: moduleOccurrence.year,
        })
        .from(degreeRequiredModule)
        .innerJoin(
          moduleOccurrence,
          eq(degreeRequiredModule.moduleID, moduleOccurrence.moduleID),
        )
        .innerJoin(
          moduleItem,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(
          and(
            eq(degreeRequiredModule.degreeID, input.degreeID),
            eq(moduleOccurrence.semester, input.semester),
            eq(moduleOccurrence.year, input.year),
          ),
        );
      return output;
    }),

  deleteDegreeRequiredModule: protectedAdminProcedure
    .input(
      z.object({
        degreeID: z.string().uuid(),
        moduleID: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(degreeRequiredModule)
        .where(
          and(
            eq(degreeRequiredModule.degreeID, input.degreeID),
            eq(degreeRequiredModule.moduleID, input.moduleID),
          ),
        );
    }),

  addPrerequisiteModule: protectedAdminProcedure
    .input(
      z.object({
        moduleRequiring: z.string().uuid(),
        prerequisiteModule: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(prerequisiteModule).values(input);
    }),

  getPrerequisiteModulesByModuleID: protectedAdminProcedure
    .input(
      z.object({
        moduleID: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          moduleCode: moduleItem.moduleCode,
          moduleName: moduleItem.moduleName,
          credits: moduleOccurrence.credits,
          semester: moduleOccurrence.semester,
          year: moduleOccurrence.year,
        })
        .from(prerequisiteModule)
        .innerJoin(
          moduleOccurrence,
          eq(prerequisiteModule.prerequisiteModule, moduleOccurrence.moduleID),
        )
        .innerJoin(
          moduleItem,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(eq(prerequisiteModule.moduleRequiring, input.moduleID));

      return output;
    }),

  deletePrerequisiteModule: protectedAdminProcedure
    .input(
      z.object({
        moduleIDRequiring: z.string().uuid(),
        prerequisiteModule: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(prerequisiteModule)
        .where(
          and(
            eq(prerequisiteModule.moduleRequiring, input.moduleIDRequiring),
            eq(prerequisiteModule.prerequisiteModule, input.prerequisiteModule),
          ),
        );
    }),

  addNotSameTimeModule: protectedAdminProcedure
    .input(
      z.object({
        module1: z.string().uuid(),
        module2: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(moduleNotSameTime).values(input);
    }),

  getNotSameTimeModuleByModuleID: protectedAdminProcedure
    .input(z.object({ moduleID: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // this gets 1 half of the modules depending on which side the relationship is on
      const leftModules = ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          moduleCode: moduleItem.moduleCode,
          moduleName: moduleItem.moduleName,
          credits: moduleOccurrence.credits,
          semester: moduleOccurrence.semester,
          year: moduleOccurrence.year,
        })
        .from(moduleItem)
        .innerJoin(
          moduleOccurrence,
          eq(moduleItem.moduleCode, moduleOccurrence.moduleCode),
        )
        .innerJoin(
          moduleNotSameTime,
          eq(moduleNotSameTime.module1, moduleOccurrence.moduleID),
        )
        .where(
          and(
            eq(moduleNotSameTime.module2, input.moduleID),
            ne(moduleOccurrence.moduleID, input.moduleID),
          ),
        );

      // gets other half
      const rightModule = ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          moduleCode: moduleItem.moduleCode,
          moduleName: moduleItem.moduleName,
          credits: moduleOccurrence.credits,
          semester: moduleOccurrence.semester,
          year: moduleOccurrence.year,
        })
        .from(moduleItem)
        .innerJoin(
          moduleOccurrence,
          eq(moduleItem.moduleCode, moduleOccurrence.moduleCode),
        )
        .innerJoin(
          moduleNotSameTime,
          eq(moduleNotSameTime.module2, moduleOccurrence.moduleID),
        )
        .where(
          and(
            eq(moduleNotSameTime.module1, input.moduleID),
            ne(moduleOccurrence.moduleID, input.moduleID),
          ),
        );

      // joins them together
      // this uses the postgres union operator so only 1 query is made to the database
      return await union(leftModules, rightModule);
    }),

  deleteNotSameTimeByModuleCode: protectedAdminProcedure
    .input(z.object({ module1: z.string(), module2: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(moduleNotSameTime)
        .where(
          or(
            and(
              eq(moduleNotSameTime.module1, input.module1),
              eq(moduleNotSameTime.module2, input.module2),
            ),
            and(
              eq(moduleNotSameTime.module1, input.module2),
              eq(moduleNotSameTime.module2, input.module1),
            ),
          ),
        );
    }),

  addEditCreditsToDegree: protectedAdminProcedure
    .input(
      z.array(
        z.object({
          degreeID: z.string().uuid(),
          creditsRequired: z.number().int(),
          semester: z.number().int(),
          year: z.number().int(),
          moduleLevel: z.number().int(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      for (const row of input) {
        // there is no way of doing this in one sql call
        await ctx.db
          .insert(creditsRequired)
          .values(input)
          .onConflictDoUpdate({
            target: [
              creditsRequired.degreeID,
              creditsRequired.semester,
              creditsRequired.year,
            ],
            set: {
              moduleLevel: row.moduleLevel,
              creditsRequired: row.creditsRequired,
            },
            where: and(
              eq(creditsRequired.degreeID, row.degreeID),
              eq(creditsRequired.semester, row.semester),
              eq(creditsRequired.year, row.year),
            ),
          });
      }
    }),

  getCreditsForDegreeByDegreeID: protectedAdminProcedure
    .input(z.object({ degreeID: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select()
        .from(creditsRequired)
        .where(eq(creditsRequired.degreeID, input.degreeID));
      return output;
    }),

  getModuleTrackingByDegreeID: protectedAdminProcedure
    .input(z.object({ degreeID: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select()
        .from(moduleTracking)
        .where(eq(moduleTracking.degreeID, input.degreeID));
      return output[0] ?? "notfound";
    }),

  addEditModuleTracking: protectedAdminProcedure
    .input(
      z.object({
        degreeID: z.string().uuid(),
        numberYearsTracking: z.number().nonnegative(),
        numberCreditsTracked: z.number().nonnegative(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(moduleTracking)
        .values(input)
        .onConflictDoUpdate({
          target: moduleTracking.degreeID,
          set: {
            numberYearsTracking: input.numberYearsTracking,
            numberCreditsTracked: input.numberCreditsTracked,
          },
        });
    }),
});
