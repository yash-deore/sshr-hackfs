// import dynamic from "next/dynamic";

import PatientForm from "../components/patient-form";

// const PatientForm = dynamic(
//   () => {
//     return import("../components/patient-form");
//   },
//   { ssr: false }
// );

export default function EditProfile() {
  return (
    <div>
      <PatientForm />
    </div>
  );
}
