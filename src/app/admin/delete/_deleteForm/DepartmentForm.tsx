"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const deleteDepartmentSchema = z.object({
  name: z.string(),
});

type deleteDepartmentSchema = z.infer<typeof deleteDepartmentSchema>;

export default function DepartmentForm() {
  const apiUtil = api.useUtils();

  const deleteDepartment =
    api.admin.department.deleteDepartmentByName.useMutation({
      onSuccess: async () => {
        await apiUtil.department.invalidate();
        await apiUtil.admin.department.invalidate();
        reset();
      },
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<deleteDepartmentSchema>({
    resolver: zodResolver(deleteDepartmentSchema),
  });

  const onSubmit = (data: deleteDepartmentSchema) => {
    deleteDepartment.mutate(data);
  };

  return (
    <form
      className="flex flex-col items-center gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="w-96 rounded-md px-2 py-1"
        placeholder="Name"
        {...register("name")}
      />
      <p>{errors.name?.message}</p>
      <input
        type="submit"
        value="Submit"
        className="w-32 rounded-md p-2 text-center hover:bg-white"
      />
    </form>
  );
}
