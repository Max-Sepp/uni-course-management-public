"use client";

import { type Module } from "~/types/Module";
import ModuleComponent from "./Module";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function ModuleStack({ modules }: { modules: Module[] }) {
  const [animationParent] = useAutoAnimate();
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
    </ul>
  );
}
