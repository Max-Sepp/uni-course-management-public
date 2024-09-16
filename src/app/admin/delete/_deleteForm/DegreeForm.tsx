"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const deleteDegreeSchema = z.object({
  degreeCode: z.string(),
});

type deleteDegreeSchema = z.infer<typeof deleteDegreeSchema>;

export default function DegreeForm() {
  const apiUtil = api.useUtils();

  const deleteDegree = api.admin.degree.deleteDegreeByDegreeCode.useMutation({
    onSuccess: async () => {
      await apiUtil.degree.invalidate();
      await apiUtil.admin.degree.invalidate();
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<deleteDegreeSchema>({
    resolver: zodResolver(deleteDegreeSchema),
  });

  const onSubmit = (data: deleteDegreeSchema) => {
    deleteDegree.mutate(data);
  };

  return (
    <form
      className="flex flex-col items-center gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="w-96 rounded-md px-2 py-1"
        placeholder="Degree Code"
        {...register("degreeCode")}
      />
      <p>{errors.degreeCode?.message}</p>
      <input
        type="submit"
        value="Submit"
        className="w-32 rounded-md p-2 text-center hover:bg-white"
      />
    </form>
  );
}
