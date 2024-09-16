import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedAdminProcedure } from "~/server/api/trpc";
import { department } from "~/server/db/schema";

export const departmentRouter = createTRPCRouter({
  createDepartment: protectedAdminProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Need to enter a department name")
          .regex(/(?!^\d+$)^.+$/, "Cannot have only numbers"), // regex expression that rejects only numbers and accepts every other input,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(department).values(input);
    }),

  deleteDepartmentByName: protectedAdminProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(department).where(eq(department.name, input.name));
    }),
});
