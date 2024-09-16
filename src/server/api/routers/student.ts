import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { student, timetable } from "~/server/db/schema";

export const studentRouter = createTRPCRouter({
  getStudentCurrentYear: protectedProcedure.query(async ({ ctx }) => {
    const output = await ctx.db
      .select({ currentYear: student.currentYear })
      .from(student)
      .where(eq(student.userID, ctx.session.user.id));
    return output[0];
  }),

  addDegreeTakenAndDegreeTimetable: protectedProcedure
    .input(
      z.object({
        degreeID: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.insert(student).values({
          degreeTaken: input.degreeID,
          hasDegreeTimetable: true,
          userID: ctx.session.user.id,
          currentYear: 1,
        });
        await tx.insert(timetable).values({
          name: "Degree path",
          studentUserID: ctx.session.user.id,
          isDegreeTimetable: true,
          degreeID: input.degreeID,
        });
      });
    }),
});
