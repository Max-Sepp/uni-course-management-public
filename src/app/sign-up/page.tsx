"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "~/utils/supabase/client";

const signUpFormSchema = z.object({
  email: z.string().email("Does not follow the form of an email"),
  password: z.string().min(6, "Password needs to be longer than 6 chracters"),
});

type signUpFormSchema = z.infer<typeof signUpFormSchema>;

export default function SignUpPage() {
  const supabase = createClient();
  const router = useRouter();

  const { register, handleSubmit } = useForm<signUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit = async ({ email, password }: signUpFormSchema) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error !== null) {
      throw error;
    }

    router.push("/");
  };

  return (
    <form
      className="mx-auto mt-4 flex w-[28rem] flex-col items-center gap-2 rounded-md  bg-blue p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="bold text-center text-xl">Create an account</h1>
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
        value="Sign Up"
      />
    </form>
  );
}
