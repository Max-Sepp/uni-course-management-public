import Link from "next/link";
import { BsPlusSlashMinus } from "react-icons/bs";
import ModuleComponent, { type Module } from "./ModuleComponent";

export default function ModuleStackAdd({
  modules,
  degreeID,
  semester,
  year,
}: {
  modules: Module[];
  degreeID: string;
  semester: number;
  year: number;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {modules.map((module) => (
        <ModuleComponent key={module.moduleID} moduleItem={module} />
      ))}
      <Link
        href={`occurrence/${degreeID}/${semester}/${year}/rule`}
        className="rounded-md bg-white p-2"
      >
        <BsPlusSlashMinus size={18} className="mx-auto" />
      </Link>
    </ul>
  );
}
