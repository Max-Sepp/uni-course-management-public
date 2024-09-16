import { redirect } from "next/navigation";
import { isAdmin } from "~/server/authentication/isAdmin";
import { isStudent } from "~/server/authentication/isStudent";
import { db } from "~/server/db/db";
import StudentHome from "./_components/StudentHome";
import { createClient } from "~/utils/supabase/server";

export default async function Home() {
  // code to handle redirecting of users
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error ?? !data?.user) {
    return (
      <>
        <div className="mx-auto mt-10">
          <h1 className="text-center text-xl">Sign in at the top right</h1>
        </div>
      </>
    );
  }

  const admin = await isAdmin({ ctx: { user: data.user, db } });

  if (admin) {
    redirect("/admin");
  }

  const student = await isStudent({ ctx: { user: data.user, db } });

  if (student) {
    return <StudentHome />;
  }

  redirect("/addstudent");
}
