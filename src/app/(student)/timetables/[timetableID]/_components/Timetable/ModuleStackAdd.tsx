import { useAutoAnimate } from "@formkit/auto-animate/react";
import { BsPlusSlashMinus } from "react-icons/bs";
import { type Module } from "~/types/Module";
import { useActionContext } from "../ActionContext";
import ModuleComponent from "./Module";

export default function ModuleStackAdd({
  modules,
  year,
  semester,
}: {
  modules: Module[];
  year: number;
  semester: number;
}) {
  const { action, setAction } = useActionContext();
  const [animationParent] = useAutoAnimate();

  function handleEdit() {
    setAction([{ type: "add", year, semester, moduleID: "" }, ...action]);
  }

  return (
    <ul ref={animationParent} className="flex flex-col gap-3">
      {modules.map((module) => (
        <ModuleComponent
          key={module.moduleID}
          moduleID={module.moduleID}
          moduleCode={module.moduleCode}
          moduleName={module.moduleName}
          credits={module.credits}
        />
      ))}
      <button onClick={handleEdit} className="rounded-md bg-white p-2">
        <BsPlusSlashMinus size={20} className="mx-auto" />
      </button>
    </ul>
  );
}
