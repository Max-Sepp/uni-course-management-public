import { asc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  degree,
  department,
  degreeOccurrence,
  student,
  timetable,
} from "~/server/db/schema";

export const degreeRouter = createTRPCRouter({
  getDegree: protectedProcedure.query(async ({ ctx }) => {
    const output = await ctx.db
      .select({
        degreeID: degreeOccurrence.degreeID,
        degreeCode: degree.degreeCode,
        departmentRunningDegreeName: department.name,
        lengthOfDegree: degree.lengthOfDegree,
      })
      .from(student)
      .innerJoin(
        degreeOccurrence,
        eq(student.degreeTaken, degreeOccurrence.degreeID),
      )
      .innerJoin(degree, eq(degreeOccurrence.degreeCode, degree.degreeCode))
      .innerJoin(
        department,
        eq(department.departmentID, degree.departmentRunningID),
      )
      .where(eq(student.userID, ctx.session.user.id));

    return output[0];
  }),

  getDegreeByNameDegreeCode: protectedProcedure
    .input(
      z.object({
        searchString: z.string(),
        limit: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          name: degree.name,
          degreeCode: degree.degreeCode,
          lengthOfDegree: degree.lengthOfDegree,
          departmentName: department.name,
        })
        .from(degree)
        .innerJoin(
          department,
          eq(department.departmentID, degree.departmentRunningID),
        )
        .where(
          or(
            ilike(degree.name, `%${input.searchString}%`),
            ilike(degree.degreeCode, `%${input.searchString}%`),
          ),
        )
        .orderBy(asc(degree.degreeCode))
        .limit(input.limit);
      return output;
    }),

  getDegreeOccurrenceByNameDegreeCode: protectedProcedure
    .input(
      z.object({
        searchString: z.string(),
        limit: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          name: degree.name,
          degreeCode: degree.degreeCode,
          lengthOfDegree: degree.lengthOfDegree,
          departmentName: department.name,
          degreeID: degreeOccurrence.degreeID,
          yearStarting: degreeOccurrence.yearStarting,
        })
        .from(degree)
        .innerJoin(
          department,
          eq(department.departmentID, degree.departmentRunningID),
        )
        .innerJoin(
          degreeOccurrence,
          eq(degreeOccurrence.degreeCode, degree.degreeCode),
        )
        .where(
          or(
            ilike(degree.name, `%${input.searchString}%`),
            ilike(degree.degreeCode, `%${input.searchString}%`),
          ),
        )
        .orderBy(asc(degree.degreeCode))
        .limit(input.limit);
      return output;
    }),

  getDegreeByDegreeCode: protectedProcedure
    .input(
      z.object({
        degreeCode: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          name: degree.name,
          degreeCode: degree.degreeCode,
          lengthOfDegree: degree.lengthOfDegree,
          departmentName: department.name,
        })
        .from(degree)
        .innerJoin(
          department,
          eq(department.departmentID, degree.departmentRunningID),
        )
        .where(eq(degree.degreeCode, input.degreeCode));
      return output[0];
    }),

  getDegreeByDegreeID: protectedProcedure
    .input(z.object({ degreeID: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          name: degree.name,
          degreeCode: degree.degreeCode,
          department: department.name,
          lengthOfDegree: degree.lengthOfDegree,
          yearStarting: degreeOccurrence.yearStarting,
        })
        .from(degreeOccurrence)
        .innerJoin(degree, eq(degreeOccurrence.degreeCode, degree.degreeCode))
        .innerJoin(
          department,
          eq(department.departmentID, degree.departmentRunningID),
        )
        .where(eq(degreeOccurrence.degreeID, input.degreeID));

      return output[0];
    }),

  getDegreeOfTimetable: protectedProcedure
    .input(z.object({ timetableID: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const output = await ctx.db
        .select({
          degreeID: degreeOccurrence.degreeID,
          name: degree.name,
          degreeCode: degree.degreeCode,
          department: department.name,
          lengthOfDegree: degree.lengthOfDegree,
          yearStarting: degreeOccurrence.yearStarting,
        })
        .from(timetable)
        .innerJoin(
          degreeOccurrence,
          eq(degreeOccurrence.degreeID, timetable.degreeID),
        )
        .innerJoin(degree, eq(degreeOccurrence.degreeCode, degree.degreeCode))
        .innerJoin(
          department,
          eq(department.departmentID, degree.departmentRunningID),
        )
        .where(eq(timetable.timetableID, input.timetableID));
      return output[0];
    }),
});
