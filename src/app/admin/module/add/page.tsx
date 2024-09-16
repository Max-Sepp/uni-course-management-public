"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BsArrowLeft } from "react-icons/bs";
import { z } from "zod";
import { api } from "~/trpc/react";

const createModuleSchema = z.object({
  moduleCode: z.string().trim().min(1, "Need to enter a Module Code"),
  moduleName: z.string().trim().min(1, "Need to enter a Module Name"),
  moduleDescription: z.string(),
});

type createModuleSchema = z.infer<typeof createModuleSchema>;

export default function AddModule() {
  const router = useRouter();
  const apiUtil = api.useUtils();

  const createModule = api.admin.module.createModule.useMutation({
    onSuccess: async () => {
      await apiUtil.module.getModulesByNameModuleCode.invalidate();
      router.push("/admin/module");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createModuleSchema>({
    resolver: zodResolver(createModuleSchema),
  });

  const onSubmit = (data: createModuleSchema) => {
    createModule.mutate(data);
  };

  return (
    <div className="p-5">
      <div className="mx-auto flex max-w-2xl flex-row rounded-md bg-blue p-3 text-left shadow-lg">
        <Link href="/admin/module">
          <BsArrowLeft size={25} className="rounded-full hover:bg-white" />
        </Link>
        <div className="flex-1 px-5 text-center">
          <h1 className="bold mb-2 text-center text-xl">Add Module</h1>
          <form
            className="flex  flex-col items-center gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="w-96 rounded-md px-2 py-1"
              placeholder="Module Code"
              {...register("moduleCode")}
            />
            <p>{errors.moduleCode?.message}</p>
            <input
              className="w-96 rounded-md px-2 py-1"
              placeholder="Module Name"
              {...register("moduleName")}
            />
            <p>{errors.moduleName?.message}</p>
            <textarea
              className="h-48 w-96 rounded-md px-2 py-1"
              placeholder="Module Description"
              {...register("moduleDescription")}
            />
            <p>{errors.moduleDescription?.message}</p>
            <input
              type="submit"
              value="Submit"
              className="my-2 w-32 rounded-md p-2 text-center hover:bg-white"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
