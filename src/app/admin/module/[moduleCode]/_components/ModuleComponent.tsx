export default function ModuleComponent({
  module,
}: {
  module: {
    moduleID: string;
    moduleCode: string;
    moduleName: string;
    credits: number | null;
    semester: number;
    year: number;
  };
}) {
  return (
    <li className="group/module relative flex flex-col rounded-md bg-white p-2 text-left">
      <h2 className="text-md">{module.moduleName}</h2>
      <p className="text-xs">
        Module Code: {module.moduleCode} Credits: {module.credits}
      </p>
      <p className="text-xs">
        Semester: {module.semester} Year: {module.year}
      </p>
    </li>
  );
}
