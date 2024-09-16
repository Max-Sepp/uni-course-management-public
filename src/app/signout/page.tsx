"use client";

import { useRouter } from "next/navigation";
import { createClient } from "~/utils/supabase/client";

export default function SignOut() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center">
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
        className="my-10 rounded-full bg-blue p-2"
      >
        Sign Out
      </button>
    </div>
  );
}
