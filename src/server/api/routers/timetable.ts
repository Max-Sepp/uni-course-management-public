import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  choices,
  degreeRequiredModule,
  moduleItem,
  moduleOccurrence,
  timetable,
} from "~/server/db/schema";

export const timetableRouter = createTRPCRouter({
  /**
   * Creating timetables which are not a degree timetable
   */
  createTimetable: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Name is required")
          .regex(/(?!^\d+$)^.+$/, "Cannot have only numbers"), // regex expression that rejects only numbers and accepts every other input,
        degreeID: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const [timetableID] = await tx
          .insert(timetable)
          .values({
            isDegreeTimetable: false,
            name: input.name,
            studentUserID: ctx.session.user.id,
            degreeID: input.degreeID,
          })
          .returning({ timetableID: timetable.timetableID });
        if (timetableID == undefined) {
          tx.rollback();
          return;
        }

        const degreeModuleIDs = await tx
          .select({ moduleID: degreeRequiredModule.moduleID })
          .from(degreeRequiredModule)
          .where(eq(degreeRequiredModule.degreeID, input.degreeID));

        const degreeRequiredChoices = degreeModuleIDs.map((val) => {
          return {
            timetableID: timetableID.timetableID,
            moduleID: val.moduleID,
          };
        });

        await tx.insert(choices).values(degreeRequiredChoices);
      });
    }),

  deletePath: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // its length will be the number of rows effected and thus if greater than 0 operation will be successful
      const deleteSuccessful = await ctx.db
        .delete(timetable)
        .where(
          and(
            eq(timetable.timetableID, input.id),
            eq(timetable.studentUserID, ctx.session.user.id),
          ),
        )
        .returning({ id: timetable.timetableID });

      if (deleteSuccessful.length <= 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  addModuleToPath: protectedProcedure
    .input(
      z.object({
        moduleID: z.string().uuid(),
        timetableID: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const timetableOwnerUserID = await ctx.db
        .select({ studentUserID: timetable.studentUserID })
        .from(timetable)
        .where(eq(timetable.timetableID, input.timetableID));

      if (
        timetableOwnerUserID.length != 1 &&
        timetableOwnerUserID[0]?.studentUserID != ctx.session.user.id
      ) {
        return new TRPCError({ code: "NOT_FOUND" });
        // they do not have a timetable with that id security concern that you can check if a timetable with that id exists if you return unauthorized
      }

      await ctx.db.insert(choices).values(input);
    }),

  getModulesOfPath: protectedProcedure
    .input(
      z.object({
        timetableID: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const modules = await ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          name: moduleItem.moduleName,
          moduleCode: moduleItem.moduleCode,
          credits: moduleOccurrence.credits,
          semester: moduleOccurrence.semester,
          year: moduleOccurrence.year,
        })
        .from(choices)
        .innerJoin(
          moduleOccurrence,
          eq(choices.moduleID, moduleOccurrence.moduleID),
        )
        .innerJoin(
          moduleItem,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(eq(choices.timetableID, input.timetableID));

      return modules;
    }),

  getModulesOfPathBySemesterAndYear: protectedProcedure
    .input(
      z.object({
        timetableID: z.string().uuid(),
        semester: z.number(),
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const modules = await ctx.db
        .select({
          moduleID: moduleOccurrence.moduleID,
          name: moduleItem.moduleName,
          moduleCode: moduleItem.moduleCode,
          credits: moduleOccurrence.credits,
        })
        .from(choices)
        .innerJoin(
          moduleOccurrence,
          eq(choices.moduleID, moduleOccurrence.moduleID),
        )
        .innerJoin(
          moduleItem,
          eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
        )
        .where(
          and(
            eq(choices.timetableID, input.timetableID),
            eq(moduleOccurrence.semester, input.semester),
            eq(moduleOccurrence.year, input.year),
          ),
        );

      return modules;
    }),

  getTimetables: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ name: timetable.name, timetableID: timetable.timetableID })
      .from(timetable)
      .where(
        and(
          eq(timetable.studentUserID, ctx.session.user.id),
          eq(timetable.isDegreeTimetable, false),
        ),
      );
  }),

  deleteModuleFromPath: protectedProcedure
    .input(
      z.object({
        timetableID: z.string().uuid(),
        moduleID: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(choices)
        .where(
          and(
            eq(choices.moduleID, input.moduleID),
            eq(choices.timetableID, input.timetableID),
          ),
        );
    }),

  getPathName: protectedProcedure
    .input(
      z.object({
        timetableID: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({ name: timetable.name })
        .from(timetable)
        .where(
          and(
            eq(timetable.studentUserID, ctx.session.user.id),
            eq(timetable.timetableID, input.timetableID),
          ),
        );
      return output[0];
    }),

  getTimetableByID: protectedProcedure
    .input(z.object({ timetableID: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select()
        .from(timetable)
        .where(eq(timetable.timetableID, input.timetableID));
      return output[0];
    }),
});
