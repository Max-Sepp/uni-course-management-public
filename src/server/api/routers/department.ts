import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { department } from "~/server/db/schema";

export const departmentRouter = createTRPCRouter({
  getDepartments: protectedProcedure.query(async ({ ctx }) => {
    const output = await ctx.db.select().from(department);
    return output;
  }),
});
