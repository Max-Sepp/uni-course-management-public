import { adminRouter } from "~/server/api/routers/admin/admin";
import { degreeRouter } from "~/server/api/routers/degree";
import { departmentRouter } from "~/server/api/routers/department";
import { moduleRouter } from "~/server/api/routers/modules";
import { studentRouter } from "~/server/api/routers/student";
import { timetableRouter } from "~/server/api/routers/timetable";
import { validateRouter } from "~/server/api/routers/validate";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  module: moduleRouter,
  timetable: timetableRouter,
  student: studentRouter,
  degree: degreeRouter,
  department: departmentRouter,
  validate: validateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
