"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BsArrowLeft } from "react-icons/bs";
import { z } from "zod";
import { api } from "~/trpc/react";

const createDegreeSchema = z.object({
  degreeCode: z.string().min(1, "Need to enter a Degree Code"),
  name: z.string().min(1, "Need to enter a Degree Name"),
  departmentRunningID: z.string(),
  lengthOfDegree: z
    .number({ invalid_type_error: "Need to enter a number" })
    .int()
    .min(1, "Too short a degree")
    .max(10, "Too long a degree"),
});

type createDegreeSchema = z.infer<typeof createDegreeSchema>;

export default function AddDegree() {
  const router = useRouter();
  const apiUtil = api.useUtils();

  const createModule = api.admin.degree.createDegree.useMutation({
    onSuccess: async () => {
      await apiUtil.degree.getDegreeByNameDegreeCode.invalidate();
      router.push(`/admin/degree/${getValues("degreeCode")}`);
    },
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<createDegreeSchema>({
    resolver: zodResolver(createDegreeSchema),
  });

  const onSubmit = (data: createDegreeSchema) => {
    createModule.mutate(data);
  };

  // getting Departments
  const departments = api.department.getDepartments.useQuery();

  return (
    <div className="p-5">
      <div className="mx-auto flex max-w-2xl flex-row rounded-md bg-blue p-3 text-left shadow-lg">
        <Link href="/admin/degree">
          <BsArrowLeft size={25} className="rounded-full hover:bg-white" />
        </Link>
        <div className="flex-1 px-5 text-center">
          <h1 className="bold mb-2 text-center text-xl">Add Degree</h1>
          <form
            className="flex  flex-col items-center gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="w-96 rounded-md px-2 py-1"
              placeholder="Degree Name"
              {...register("name")}
            />
            <p>{errors.name?.message}</p>
            <input
              className="w-96 rounded-md px-2 py-1"
              placeholder="Degree Code"
              {...register("degreeCode")}
            />
            <p>{errors.degreeCode?.message}</p>
            <select
              className="w-96 rounded-md px-2 py-1"
              {...register("departmentRunningID")}
            >
              <option selected>Department</option>
              {departments.isLoading ? (
                <h1>Loading...</h1>
              ) : departments.isSuccess ? (
                departments.data.map((val, index) => (
                  <option key={index} value={val.departmentID}>
                    {val.name}
                  </option>
                ))
              ) : undefined}
            </select>
            <p>{errors.departmentRunningID?.message}</p>
            <input
              className="w-96 rounded-md px-2 py-1"
              placeholder="Length of Degree"
              {...register("lengthOfDegree", { valueAsNumber: true })}
            />
            <p>{errors.lengthOfDegree?.message}</p>
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
