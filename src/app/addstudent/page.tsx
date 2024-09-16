import DegreeForm from "./_components/DegreeForm";
import NavBar from "./_components/NavBar";

export default function CreateStudent() {
  return (
    <>
      <NavBar />
      <div>
        <div className="mx-auto mt-5 flex max-w-2xl flex-col rounded-md bg-blue p-3 text-center shadow-lg">
          <h1 className="text-center text-xl">What Degree are you taking?</h1>
          <DegreeForm />
        </div>
      </div>
    </>
  );
}
