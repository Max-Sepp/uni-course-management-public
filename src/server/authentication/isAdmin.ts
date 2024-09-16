import { type User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { type db } from "~/server/db/db";
import { admin } from "~/server/db/schema";

export async function isAdmin({
  ctx,
}: {
  ctx: { db: db; user: User };
}): Promise<boolean> {
  const admins = await ctx.db
    .select({ userId: admin.userID })
    .from(admin)
    .where(eq(admin.userID, ctx.user.id));

  return admins.length > 0;
}
