import RequiredModule from "./_components/RequiredModule/RequiredModule";

export default function DegreeRules({
  params,
}: {
  params: { degreeID: string; semester: number; year: number };
}) {
  return (
    <div className="mx-auto my-3 w-fit rounded-md bg-blue p-3">
      <RequiredModule
        degreeID={params.degreeID}
        occurring={{
          semester: Number(params.semester),
          year: Number(params.year),
        }}
      />
    </div>
  );
}
