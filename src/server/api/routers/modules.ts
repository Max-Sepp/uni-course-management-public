import { and, asc, eq, ilike, inArray, or } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  creditsRequired,
  moduleItem,
  moduleOccurrence,
} from "~/server/db/schema";

export const moduleRouter = createTRPCRouter({
  getModuleById: protectedProcedure
    .input(
      z.object({
        moduleID: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          moduleName: moduleItem.moduleName,
          credits: moduleOccurrence.credits,
          moduleDescription: moduleItem.moduleDescription,
          moduleCode: moduleItem.moduleCode,
          semester: moduleOccurrence.semester,
          year: moduleOccurrence.year,
        })
        .from(moduleOccurrence)
        .innerJoin(
          moduleItem,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(eq(moduleOccurrence.moduleID, input.moduleID));

      return data[0];
    }),

  getModuleByModuleCode: protectedProcedure
    .input(
      z.object({
        moduleCode: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select()
        .from(moduleItem)
        .where(eq(moduleItem.moduleCode, input.moduleCode));
      return output[0];
    }),

  getModulesByNameModuleCode: protectedProcedure
    .input(
      z.object({
        searchString: z.string(),
        limit: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select()
        .from(moduleItem)
        .where(
          or(
            ilike(moduleItem.moduleName, `%${input.searchString}%`),
            ilike(moduleItem.moduleCode, `%${input.searchString}%`),
          ),
        )
        .orderBy(asc(moduleItem.moduleCode))
        .limit(input.limit);
      return output;
    }),

  getModuleByNameModuleCodeFilterSemesterYearModuleLevel: protectedProcedure
    .input(
      z.object({
        searchString: z.string(),
        limit: z.number().int(),
        semester: z
          .number()
          .int("Not valid semester")
          .gte(1, "Not valid semester")
          .lte(3, "Not valid semester"),
        year: z.number().int("not valid year"),
        degreeID: z.string().uuid(),
        yearStarting: z.number().int(),
        moduleLevelFilter: z.enum([
          "oneLevel",
          "plusMinusOneLevel",
          "noFilter",
        ]),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.moduleLevelFilter != "noFilter") {
        const [moduleLevelResponse] = await ctx.db
          .select({ moduleLevel: creditsRequired.moduleLevel })
          .from(creditsRequired)
          .where(
            and(
              eq(creditsRequired.degreeID, input.degreeID),
              eq(creditsRequired.semester, input.semester),
              eq(creditsRequired.year, input.year - input.yearStarting + 1),
            ),
          );

        const moduleLevel = moduleLevelResponse?.moduleLevel;

        if (moduleLevel != undefined) {
          let moduleLevels: number[];
          if (input.moduleLevelFilter == "oneLevel") {
            moduleLevels = [moduleLevel];
          } else if (input.moduleLevelFilter == "plusMinusOneLevel") {
            moduleLevels = [moduleLevel - 1, moduleLevel, moduleLevel + 1];
          } else {
            moduleLevels = [];
          }
          // query with moduleLevel
          const output = await ctx.db
            .select({
              moduleID: moduleOccurrence.moduleID,
              moduleName: moduleItem.moduleName,
              credits: moduleOccurrence.credits,
              moduleDescription: moduleItem.moduleDescription,
              moduleCode: moduleItem.moduleCode,
              semester: moduleOccurrence.semester,
              year: moduleOccurrence.year,
              moduleLevel: moduleOccurrence.moduleLevel,
            })
            .from(moduleOccurrence)
            .innerJoin(
              moduleItem,
              eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
            )
            .where(
              and(
                or(
                  ilike(moduleItem.moduleName, `%${input.searchString}%`),
                  ilike(moduleItem.moduleCode, `%${input.searchString}%`),
                ),
                eq(moduleOccurrence.semester, input.semester),
                eq(moduleOccurrence.year, input.year),
                inArray(moduleOccurrence.moduleLevel, moduleLevels),
              ),
            )
            .orderBy(asc(moduleItem.moduleCode))
            .limit(input.limit);

          return output;
        }
      }

      // query without moduleLevel
      const output = await ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          moduleName: moduleItem.moduleName,
          credits: moduleOccurrence.credits,
          moduleDescription: moduleItem.moduleDescription,
          moduleCode: moduleItem.moduleCode,
          semester: moduleOccurrence.semester,
          year: moduleOccurrence.year,
          moduleLevel: moduleOccurrence.moduleLevel,
        })
        .from(moduleOccurrence)
        .innerJoin(
          moduleItem,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(
          and(
            or(
              ilike(moduleItem.moduleName, `%${input.searchString}%`),
              ilike(moduleItem.moduleCode, `%${input.searchString}%`),
            ),
            eq(moduleOccurrence.semester, input.semester),
            eq(moduleOccurrence.year, input.year),
          ),
        )
        .orderBy(asc(moduleItem.moduleCode))
        .limit(input.limit);

      return output;
    }),

  getModuleByNameModuleCodeFilterSemesterYear: protectedProcedure
    .input(
      z.object({
        searchString: z.string(),
        limit: z.number().int(),
        semester: z
          .number()
          .int("Not valid semester")
          .gte(1, "Not valid semester")
          .lte(3, "Not valid semester"),
        year: z.number().int("not valid year"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          moduleName: moduleItem.moduleName,
          credits: moduleOccurrence.credits,
          moduleDescription: moduleItem.moduleDescription,
          moduleCode: moduleItem.moduleCode,
          semester: moduleOccurrence.semester,
          year: moduleOccurrence.year,
        })
        .from(moduleOccurrence)
        .innerJoin(
          moduleItem,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(
          and(
            or(
              ilike(moduleItem.moduleName, `%${input.searchString}%`),
              ilike(moduleItem.moduleCode, `%${input.searchString}%`),
            ),
            eq(moduleOccurrence.semester, input.semester),
            eq(moduleOccurrence.year, input.year),
          ),
        )
        .orderBy(asc(moduleItem.moduleCode))
        .limit(input.limit);
      return output;
    }),

  getModuleOccurrenceByNameModuleCode: protectedProcedure
    .input(
      z.object({
        searchString: z.string(),
        limit: z.number().int(),
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
        .from(moduleItem)
        .innerJoin(
          moduleOccurrence,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(
          or(
            ilike(moduleItem.moduleName, `%${input.searchString}%`),
            ilike(moduleItem.moduleCode, `%${input.searchString}%`),
          ),
        )
        .orderBy(asc(moduleItem.moduleCode))
        .limit(input.limit);
      return output;
    }),

  getModuleOccurrenceByNameModuleCodeFilterSemesterYear: protectedProcedure
    .input(
      z.object({
        searchString: z.string(),
        limit: z.number().int(),
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
        .from(moduleItem)
        .innerJoin(
          moduleOccurrence,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(
          and(
            or(
              ilike(moduleItem.moduleName, `%${input.searchString}%`),
              ilike(moduleItem.moduleCode, `%${input.searchString}%`),
            ),
            eq(moduleOccurrence.semester, input.semester),
            eq(moduleOccurrence.year, input.year),
          ),
        )
        .orderBy(asc(moduleItem.moduleCode))
        .limit(input.limit);
      return output;
    }),
});
