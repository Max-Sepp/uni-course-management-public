import { type User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { type db } from "~/server/db/db";
import { student } from "~/server/db/schema";

/**
 * This function takes in a database and user session. It validates if the person is a student the session must be not null
 *
 */
export async function isStudent({
  ctx,
}: {
  ctx: { db: db; user: User };
}): Promise<boolean> {
  const students = await ctx.db
    .select()
    .from(student)
    .where(eq(student.userID, ctx.user.id));

  return (
    students[0]?.degreeTaken != null && students[0].hasDegreeTimetable == true
  );
}
