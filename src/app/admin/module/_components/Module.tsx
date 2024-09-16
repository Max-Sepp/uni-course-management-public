import Link from "next/link";

type Module = {
  moduleCode: string;
  moduleName: string;
};

export default function ModuleComponent({ moduleCode, moduleName }: Module) {
  return (
    <div className="relative flex w-96 flex-col rounded-md bg-white p-2 text-left">
      <Link href={`module/${moduleCode}`}>
        <h2 className="text-md hover:underline">{moduleName}</h2>
      </Link>
      <p className="text-xs">Module Code: {moduleCode}</p>
    </div>
  );
}
