export type Module = {
  moduleID: string;
  moduleCode: string;
  moduleName: string;
  credits: number;
  semester: number;
  year: number;
};

export default function ModuleComponent({
  moduleItem,
}: {
  moduleItem: Module;
}) {
  return (
    <div className="relative flex  flex-col rounded-md bg-white p-2 text-left">
      <h2 className="text-md hover:underline">{moduleItem.moduleName}</h2>
      <p className="text-xs">
        Module Code: {moduleItem.moduleCode} credits: {moduleItem.credits}
      </p>
      <p className="text-xs">
        Semester: {moduleItem.semester} Year: {moduleItem.year}
      </p>
    </div>
  );
}
