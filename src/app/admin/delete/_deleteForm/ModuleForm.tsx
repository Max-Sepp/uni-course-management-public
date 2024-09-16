"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const deleteModuleSchema = z.object({
  moduleCode: z.string().trim(),
});

type deleteModuleSchema = z.infer<typeof deleteModuleSchema>;

export default function ModuleForm() {
  const apiUtil = api.useUtils();

  const deleteModule = api.admin.module.deleteModuleByModuleCode.useMutation({
    onSuccess: async () => {
      await apiUtil.module.invalidate();
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<deleteModuleSchema>({
    resolver: zodResolver(deleteModuleSchema),
  });

  const onSubmit = (data: deleteModuleSchema) => {
    deleteModule.mutate(data);
  };

  return (
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
        type="submit"
        value="Submit"
        className="w-32 rounded-md p-2 text-center hover:bg-white"
      />
    </form>
  );
}
