import Link from "next/link";
import { createClient } from "~/utils/supabase/server";

export default async function NavBar() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  return (
    <nav className="flex h-20 flex-row items-center justify-between bg-gunmetal px-5">
      <h1 className="text-white">
        University Logo Insert Here University Logo
      </h1>
      <div className="flex flex-row items-center gap-4 text-base text-white">
        <Link
          href={data.user ? "/signout" : "/login"}
          className="rounded-full bg-white/10 px-7 py-3 text-center no-underline transition hover:bg-white/20"
        >
          {data.user ? (
            <>
              {data.user.email}
              <p className="text-xs">Sign out</p>
            </>
          ) : (
            "Sign in"
          )}
        </Link>
      </div>
    </nav>
  );
}
