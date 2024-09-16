import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useViewingContext } from "../ViewingContext";

const createModuleSchema = z.object({
  semester: z
    .number()
    .int()
    .min(1, "This is too small a number to be a semester")
    .max(3, "This is too large a number to be a semester"),
  year: z
    .number()
    .int()
    .min(2000, "This is too small a year number")
    .max(2200, "This is too large a year number"),
  moduleLevel: z
    .number()
    .int()
    .min(4, "This is too small a Module Level")
    .max(10, "This is too large a Module Level"),
  credits: z.number().int().min(0),
});

type createModuleSchema = z.infer<typeof createModuleSchema>;

export default function AddOccurrence({ moduleCode }: { moduleCode: string }) {
  const apiUtil = api.useUtils();

  const { viewingModule } = useViewingContext();

  const createModuleOccurrence =
    api.admin.module.createModuleOccurrence.useMutation({
      onSuccess: async () => {
        await apiUtil.admin.module.getSpecificModulesByModuleCode.invalidate();
        reset();
      },
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createModuleSchema>({
    resolver: zodResolver(createModuleSchema),
  });

  const onSubmit = (data: createModuleSchema) => {
    createModuleOccurrence.mutate({
      moduleOccurrence: {
        moduleCode,
        semester: data.semester,
        year: data.year,
        moduleLevel: data.moduleLevel,
        credits: data.credits,
      },
      copyingRulesOf: viewingModule,
    });
  };

  return (
    <form
      className="mx-auto flex w-[42rem] flex-col items-center gap-2 rounded-md bg-blue p-3 text-left shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid w-full grid-cols-2 gap-2">
        <div className="flex flex-col">
          <input
            className=" rounded-md px-2 py-1"
            placeholder="Semester"
            {...register("semester", { valueAsNumber: true })}
          />
          <p>{errors.semester?.message}</p>
        </div>
        <div className="flex flex-col">
          <input
            className=" rounded-md px-2 py-1"
            placeholder="Year"
            {...register("year", { valueAsNumber: true })}
          />
          <p>{errors.year?.message}</p>
        </div>
        <div className="flex flex-col">
          <input
            className="rounded-md px-2 py-1"
            placeholder="ModuleLevel"
            {...register("moduleLevel", { valueAsNumber: true })}
          />
          <p>{errors.moduleLevel?.message}</p>
        </div>
        <div className="flex flex-col">
          <input
            className="rounded-md px-2 py-1"
            placeholder="Credits"
            {...register("credits", { valueAsNumber: true })}
          />
          <p>{errors.credits?.message}</p>
        </div>
      </div>
      <input
        type="submit"
        value="Create Occurrence"
        className="w-40 rounded-md p-1 text-center hover:bg-white"
      />
    </form>
  );
}
