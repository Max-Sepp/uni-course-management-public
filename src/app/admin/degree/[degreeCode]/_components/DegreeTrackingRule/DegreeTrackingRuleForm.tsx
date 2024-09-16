import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const degreeTrackingRuleSchema = z.object({
  numberYearsTracking: z
    .number()
    .nonnegative("Cannot track by a negative number of years"),
  numberCreditsTracked: z
    .number()
    .nonnegative("Cannot have a max number of credits tracked less than zero"),
});

type degreeTrackingRuleSchema = z.infer<typeof degreeTrackingRuleSchema>;

export default function DegreeTrackingRuleForm({
  degreeID,
  defaultValues,
}: {
  degreeID: string;
  defaultValues: degreeTrackingRuleSchema | undefined;
}) {
  const apiUtil = api.useUtils();

  const addEditTrackingRule = api.admin.rules.addEditModuleTracking.useMutation(
    {
      onSuccess: async () => {
        await apiUtil.admin.rules.getModuleTrackingByDegreeID.invalidate();
      },
    },
  );

  useEffect(() => {
    reset({
      numberYearsTracking: defaultValues?.numberYearsTracking,
      numberCreditsTracked: defaultValues?.numberCreditsTracked,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<degreeTrackingRuleSchema>({
    resolver: zodResolver(degreeTrackingRuleSchema),
    defaultValues,
  });

  const onSubmit = (data: degreeTrackingRuleSchema) => {
    addEditTrackingRule.mutate({
      degreeID,
      numberYearsTracking: data.numberYearsTracking,
      numberCreditsTracked: data.numberCreditsTracked,
    });
  };

  return (
    <form
      className="mx-3 mt-3 flex flex-col items-center gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="w-96 rounded-md px-2 py-1"
        placeholder="Number Years Tracking"
        {...register("numberYearsTracking", { valueAsNumber: true })}
      />
      <p>{errors.numberYearsTracking?.message}</p>
      <input
        className="w-96 rounded-md px-2 py-1"
        placeholder="Number Credits Tracked"
        {...register("numberCreditsTracked", { valueAsNumber: true })}
      />
      <p>{errors.numberCreditsTracked?.message}</p>
      <input
        type="submit"
        value="Submit"
        className="my-2 w-32 rounded-md p-2 text-center hover:bg-white"
      />
    </form>
  );
}
