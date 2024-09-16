"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "~/utils/supabase/client";

const loginFormSchema = z.object({
  email: z.string().email("Does not follow the form of an email"),
  password: z.string().min(6, "Password needs to be longer than 6 chracters"),
});

type loginFormSchema = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const { register, handleSubmit } = useForm<loginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async ({ email, password }: loginFormSchema) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error !== null) {
      throw error;
    }

    router.push("/");
  };

  return (
    <div className="mx-auto mt-4 flex w-[28rem] flex-col items-center gap-2 rounded-md bg-blue p-2">
      <h1 className="bold text-center text-xl">Log in to your account</h1>
      <form
        className="flex flex-col items-center gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          placeholder="example@example.com"
          className="w-96 rounded-md px-2 py-1"
          {...register("email")}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          className="w-96 rounded-md px-2 py-1"
          {...register("password")}
        />
        <input
          type="submit"
          className="w-32 rounded-md p-2 text-center hover:bg-white"
          value="Log In"
        />
      </form>
      <p className="text-center text-sm">
        Not got an account?{" "}
        <Link className="font-semibold leading-6" href="/sign-up">
          Create an account
        </Link>
      </p>
    </div>
  );
}
