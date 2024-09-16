import React from "react";
import { db } from "~/server/db/db";
import NavBar from "./_components/NavBar";
import { createClient } from "~/utils/supabase/server";
import { isAdmin } from "~/server/authentication/isAdmin";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (data.user === null) {
    return (
      <div className="mx-auto mt-10">
        <h1 className="text-center text-xl">You are not signed in</h1>
      </div>
    );
  }

  const hasAdminPermissions = await isAdmin({ ctx: { db, user: data.user } });

  if (!hasAdminPermissions) {
    return (
      <div className="mx-auto mt-10">
        <h1 className="text-center text-xl">You are not an admin</h1>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
