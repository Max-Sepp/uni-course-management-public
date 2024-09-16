import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsPencil } from "react-icons/bs";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useViewingContext } from "../ViewingContext";

export default function Occurrence({
  moduleOccurrence,
}: {
  moduleOccurrence: {
    moduleCode: string;
    moduleID: string;
    semester: number;
    year: number;
    moduleLevel: number;
    credits: number;
  };
}) {
  const [animationParent] = useAutoAnimate();

  const { viewingModule, setViewingModule } = useViewingContext();

  function handleSelected() {
    if (moduleOccurrence.moduleID == viewingModule) {
      setViewingModule(undefined);
    } else {
      setViewingModule(moduleOccurrence.moduleID);
    }
  }

  // editing occurrence
  const [editing, setEditing] = useState(false);

  return (
    <li
      ref={animationParent}
      className={`group/module relative mx-auto flex w-[42rem] flex-col items-center gap-3 rounded-md bg-blue p-2 text-center shadow-lg ${
        viewingModule == moduleOccurrence.moduleID
          ? "border-4 border-gunmetal"
          : null
      }`}
    >
      <button
        className="w-fit rounded-lg p-1 hover:bg-white"
        onClick={handleSelected}
      >
        <p>
          Semester: {moduleOccurrence.semester} , Year: {moduleOccurrence.year}{" "}
          , Module Level: {moduleOccurrence.moduleLevel} , Credits:{" "}
          {moduleOccurrence.credits}
        </p>
      </button>
      {editing ? (
        <Edit
          moduleID={moduleOccurrence.moduleID}
          moduleCredits={moduleOccurrence.credits}
          moduleLevel={moduleOccurrence.moduleLevel}
        />
      ) : null}
      <button
        onClick={() => setEditing(!editing)}
        className="invisible absolute right-3 top-3 rounded-md bg-white p-1 group-hover/module:visible"
      >
        <BsPencil />
      </button>
    </li>
  );
}

// Edit Module Occurrence form

const editModuleOccurrenceSchema = z.object({
  moduleLevel: z
    .number()
    .int()
    .min(4, "This is too small a Module Level")
    .max(10, "This is too large a Module Level"),
  moduleCredits: z.number().int().min(0),
});

type editModuleOccurrenceSchema = z.infer<typeof editModuleOccurrenceSchema>;

function Edit({
  moduleID,
  moduleLevel,
  moduleCredits,
}: {
  moduleID: string;
  moduleLevel: number;
  moduleCredits: number;
}) {
  const updateModule = api.admin.module.editModuleOccurrence.useMutation();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<editModuleOccurrenceSchema>({
    resolver: zodResolver(editModuleOccurrenceSchema),
    defaultValues: {
      moduleLevel,
      moduleCredits,
    },
  });

  const onSubmit = (data: editModuleOccurrenceSchema) => {
    updateModule.mutate({ moduleID, ...data });
  };

  return (
    <form
      className="flex  flex-col items-center gap-2 text-left"
      onSubmit={handleSubmit(onSubmit)}
    >
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
          {...register("moduleCredits", { valueAsNumber: true })}
        />
        <p>{errors.moduleCredits?.message}</p>
      </div>
      <input
        type="submit"
        value="Edit Occurrence"
        className="w-40 rounded-md p-1 text-center hover:bg-white"
      />
    </form>
  );
}
