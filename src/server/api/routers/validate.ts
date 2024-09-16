import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { timetable } from "~/server/db/schema";

export const validateRouter = createTRPCRouter({
  validatePath: protectedProcedure
    .input(
      z.object({
        timetableID: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [degreeID] = await ctx.db
        .select({ degreeID: timetable.degreeID })
        .from(timetable)
        .where(eq(timetable.timetableID, input.timetableID));

      if (degreeID == undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find the timetable",
        });
      }
      const validationResults = await ctx.ruleValidator.Validate(
        input.timetableID,
        degreeID.degreeID,
      );

      const failures: { type: string }[] = validationResults.failures;

      return { isSuccess: validationResults.isSuccess, failures };
    }),
});
