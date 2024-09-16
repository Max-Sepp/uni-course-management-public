"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const deleteModuleOccurrenceSchema = z.object({
  moduleCode: z.string().trim(),
  semester: z.number().int(),
  year: z.number().int(),
});

type deleteModuleOccurrenceSchema = z.infer<
  typeof deleteModuleOccurrenceSchema
>;

export default function ModuleOccurrenceForm() {
  const apiUtil = api.useUtils();

  const deleteModuleOccurrence =
    api.admin.module.deleteModuleOccurrenceByModuleCodeSemesterYear.useMutation(
      {
        onSuccess: async () => {
          await apiUtil.module.invalidate();
          reset();
        },
      },
    );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<deleteModuleOccurrenceSchema>({
    resolver: zodResolver(deleteModuleOccurrenceSchema),
  });

  const onSubmit = (data: deleteModuleOccurrenceSchema) => {
    deleteModuleOccurrence.mutate(data);
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
        className="w-96 rounded-md px-2 py-1"
        placeholder="Semester"
        {...register("semester", { valueAsNumber: true })}
      />
      <p>{errors.semester?.message}</p>
      <input
        className="w-96 rounded-md px-2 py-1"
        placeholder="Year"
        {...register("year", { valueAsNumber: true })}
      />
      <p>{errors.year?.message}</p>
      <input
        type="submit"
        value="Submit"
        className="w-32 rounded-md p-2 text-center hover:bg-white"
      />
    </form>
  );
}
