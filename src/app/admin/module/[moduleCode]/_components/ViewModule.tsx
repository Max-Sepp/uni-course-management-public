import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsPencil } from "react-icons/bs";
import { z } from "zod";
import { api } from "~/trpc/react";

export default function ViewModule({
  moduleData,
}: {
  moduleData:
    | {
        moduleCode: string;
        moduleName: string;
        moduleDescription: string;
      }
    | undefined;
}) {
  const [animationParent] = useAutoAnimate();

  // editing occurrence
  const [editing, setEditing] = useState(false);

  if (moduleData == undefined) {
    return <h1>Cannot find module</h1>;
  }

  return (
    <div ref={animationParent} className="group/module relative">
      <h1 className="bold text-center text-xl">
        Module: {moduleData?.moduleName}
      </h1>
      <p>{moduleData.moduleDescription}</p>
      <p className="text-sm">ModuleCode: {moduleData.moduleCode}</p>
      {editing ? (
        <Edit
          defaultValues={{
            moduleDescription: moduleData.moduleDescription,
            moduleName: moduleData.moduleName,
          }}
          editingModuleCode={moduleData.moduleCode}
        />
      ) : null}
      <button
        onClick={() => setEditing(!editing)}
        className="invisible absolute bottom-3 right-3 rounded-md bg-white p-1 group-hover/module:visible"
      >
        <BsPencil />
      </button>
    </div>
  );
}

// editing the module
const createModuleSchema = z.object({
  moduleName: z.string().min(1, "Need to enter a Module Name"),
  moduleDescription: z.string(),
});

type createModuleSchema = z.infer<typeof createModuleSchema>;

function Edit({
  editingModuleCode,
  defaultValues,
}: {
  editingModuleCode: string;
  defaultValues: createModuleSchema;
}) {
  const apiUtil = api.useUtils();

  const editModule = api.admin.module.editModule.useMutation({
    onSuccess: async () => {
      await apiUtil.module.getModuleByModuleCode.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createModuleSchema>({
    resolver: zodResolver(createModuleSchema),
    defaultValues,
  });

  const onSubmit = (data: createModuleSchema) => {
    editModule.mutate({ updatedValues: data, editingModuleCode });
  };

  return (
    <form
      className="mt-3 flex flex-col items-center gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="w-96 rounded-md px-2 py-1"
        placeholder="Module Name"
        {...register("moduleName")}
      />
      <p>{errors.moduleName?.message}</p>
      <textarea
        className="h-48 w-96 rounded-md px-2 py-1"
        placeholder="Module Description"
        {...register("moduleDescription")}
      />
      <p>{errors.moduleDescription?.message}</p>
      <input
        type="submit"
        value="Submit"
        className="my-2 w-32 rounded-md p-2 text-center hover:bg-white"
      />
    </form>
  );
}
