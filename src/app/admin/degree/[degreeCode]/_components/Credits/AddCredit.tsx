"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const addCreditsSchema = z.object({
  credits: z.array(
    z.object({
      degreeID: z.string(),
      creditsRequired: z.number().int(),
      semester: z.number().int(),
      year: z.number().int(),
      moduleLevel: z.number().int(),
    }),
  ),
});

type addCreditsSchema = z.infer<typeof addCreditsSchema>;

export default function AddCredit({
  creditsRequired,
}: {
  creditsRequired: {
    degreeID: string;
    semester: number;
    year: number;
    creditsRequired: number | undefined;
    moduleLevel: number | undefined;
  }[];
}) {
  const apiUtils = api.useUtils();

  useEffect(() => {
    reset({ credits: creditsRequired });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditsRequired]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<addCreditsSchema>({
    resolver: zodResolver(addCreditsSchema),
    defaultValues: { credits: creditsRequired },
  });

  const { fields } = useFieldArray({
    name: "credits",
    control,
  });

  const addEditCredits = api.admin.rules.addEditCreditsToDegree.useMutation({
    onSuccess: async () => {
      await apiUtils.admin.rules.getCreditsForDegreeByDegreeID.invalidate();
    },
  });

  const onSubmit = (data: addCreditsSchema) => {
    addEditCredits.mutate(data.credits);
  };

  return (
    <form
      className="flex  flex-col items-center gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      {fields.map((field, index) => (
        <div className="flex flex-row items-center gap-1" key={field.id}>
          <label>{`Semester: ${field.semester}, Year: ${field.year}`}</label>

          <input
            className="w-96 rounded-md px-2 py-1"
            placeholder="Credits"
            {...register(`credits.${index}.creditsRequired` as const, {
              valueAsNumber: true,
            })}
          />
          <p>{errors?.credits?.[index]?.message}</p>

          <input
            className="w-96 rounded-md px-2 py-1"
            placeholder="Module Level"
            {...register(`credits.${index}.moduleLevel` as const, {
              valueAsNumber: true,
            })}
          />
        </div>
      ))}
      <input
        type="submit"
        value="Submit"
        className="my-2 w-32 rounded-md p-2 text-center hover:bg-white"
      />
    </form>
  );
}
