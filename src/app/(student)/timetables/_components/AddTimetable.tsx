import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { BsArrowLeft } from "react-icons/bs";
import { z } from "zod";
import { api } from "~/trpc/react";
import AddDegreeToTimetable from "./AddDegreeToTimetable";

const createPathSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/(?!^\d+$)^.+$/, "Cannot have only numbers"), // regex expression that rejects only numbers and accepts every other input
  degreeID: z.string().uuid(),
});

type createPathSchema = z.infer<typeof createPathSchema>;

export default function AddPath({
  setAdd,
}: {
  setAdd: Dispatch<SetStateAction<boolean>>;
}) {
  const apiUtil = api.useUtils();

  const createTimetable = api.timetable.createTimetable.useMutation({
    onSuccess: async () => {
      await apiUtil.timetable.getTimetables.invalidate();
      setAdd(false);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<createPathSchema>({
    resolver: zodResolver(createPathSchema),
  });

  const onSubmit = (data: createPathSchema) => {
    createTimetable.mutate(data);
  };

  const setDegreeID = (degreeID: string) => {
    setValue("degreeID", degreeID);
  };

  return (
    <div className="p-5">
      <div className="mx-auto flex max-w-2xl flex-row rounded-md bg-blue p-3 text-left shadow-lg">
        <button
          onClick={() => {
            setAdd(false);
          }}
        >
          <BsArrowLeft size={25} className="rounded-full hover:bg-white" />
        </button>
        <div className="flex-1 px-5 text-center">
          <h1 className="bold text-center text-xl">Creating a Timetable</h1>
          <form
            className="flex flex-col items-center gap-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="rounded-md px-2 py-1"
              placeholder="Name"
              {...register("name")}
            />
            <p>{errors.name?.message}</p>
            <label className="text-lg">Timetable&apos;s Degree</label>
            <AddDegreeToTimetable setDegreeID={setDegreeID} />
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
