import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, "Need to enter a department name")
    .regex(/(?!^\d+$)^.+$/, "Cannot have only numbers"), // regex expression that rejects only numbers and accepts every other input
});

type createDepartmentSchema = z.infer<typeof createDepartmentSchema>;

export default function AddDepartment() {
  const apiUtil = api.useUtils();

  const createDepartment = api.admin.department.createDepartment.useMutation({
    onSuccess: async () => {
      await apiUtil.department.getDepartments.invalidate();
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createDepartmentSchema>({
    resolver: zodResolver(createDepartmentSchema),
  });

  const onSubmit = (data: createDepartmentSchema) => {
    createDepartment.mutate(data);
  };

  return (
    <form
      className="mx-auto  flex w-[42rem] flex-row items-center gap-2 rounded-md bg-blue p-3 text-left shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex grow flex-col">
        <input
          className="grow rounded-md px-2 py-1"
          placeholder="Department Name"
          {...register("name")}
        />
        <p>{errors.name?.message}</p>
      </div>
      <input
        type="submit"
        value="Create Department"
        className="w-48 rounded-md p-1 text-center hover:bg-white"
      />
    </form>
  );
}
