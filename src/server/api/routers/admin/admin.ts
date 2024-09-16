import { createTRPCRouter } from "~/server/api/trpc";
import { moduleRouter } from "~/server/api/routers/admin/module";
import { degreeRouter } from "~/server/api/routers/admin/degree";
import { departmentRouter } from "~/server/api/routers/admin/department";
import { rulesRouter } from "~/server/api/routers/admin/rules";

export const adminRouter = createTRPCRouter({
  module: moduleRouter,
  degree: degreeRouter,
  department: departmentRouter,
  rules: rulesRouter,
});
