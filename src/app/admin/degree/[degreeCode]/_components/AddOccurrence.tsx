import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useViewingContext } from "../ViewingContext";

const createDegreeSchema = z.object({
  yearStarting: z.number().int(),
});

type createDegreeSchema = z.infer<typeof createDegreeSchema>;

export default function AddOccurrence({ degreeCode }: { degreeCode: string }) {
  const apiUtil = api.useUtils();

  const { viewingDegree } = useViewingContext();

  const createDegree = api.admin.degree.createDegreeOccurrence.useMutation({
    onSuccess: async () => {
      await apiUtil.admin.degree.getSpecificDegreeByDegreeCode.invalidate();
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createDegreeSchema>({
    resolver: zodResolver(createDegreeSchema),
  });

  const onSubmit = (data: createDegreeSchema) => {
    createDegree.mutate({
      degreeOccurrence: { degreeCode, yearStarting: data.yearStarting },
      copyingRulesOf: viewingDegree,
    });
  };

  return (
    <form
      className="mx-auto flex w-[42rem] flex-row items-center gap-2 rounded-md bg-blue p-3 text-left shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex grow flex-col">
        <input
          className="grow rounded-md px-2 py-1"
          placeholder="Year Commencing"
          {...register("yearStarting", { valueAsNumber: true })}
        />
        <p>{errors.yearStarting?.message}</p>
      </div>
      <input
        type="submit"
        value="Create Occurrence"
        className="w-48 rounded-md p-1 text-center hover:bg-white"
      />
    </form>
  );
}
