import { useEffect } from "react";
import { PatientBasicInformation } from "./patient-basic-information";
import PatientPersonalInformation from "./patient-personal-information";

export function DecryptedResponse({ decryptedString }) {
  const parsedObject = JSON.parse(decryptedString);
  const { message, dataArray } = parsedObject;
  const patientBasicInfo = dataArray[0];
  const patientPersonalInfo = dataArray[1];

  function displayMessage() {
    return (
      <>
        <h3>Message</h3>
        {message === null ? "No message attached" : `${message}`}
      </>
    );
  }

  function displayBasicDetails() {
    console.log(patientBasicInfo);
    if (patientBasicInfo !== null) {
      const { name, gender, dateOfBirth, maritalStatus } = patientBasicInfo;
      const dateConversion = new Date(dateOfBirth);
      const convertedDateOfBirth = dateConversion.toString().substring(4, 15);

      return (
        <>
          <h3>Patient Basic Information</h3>
          <PatientBasicInformation
            name={name}
            gender={gender}
            date={convertedDateOfBirth}
            maritalStatus={maritalStatus}
          />
        </>
      );
    }
  }

  function displayPersonalDetails() {
    if (patientPersonalInfo !== null) {
      const { countryCode, phoneNumber, emailAddress } = patientPersonalInfo;
      const phone = countryCode + " " + phoneNumber;

      return (
        <>
          <h3>Patient Personal Details</h3>
          <PatientPersonalInformation
            phone={phone}
            emailAddress={emailAddress}
          />
        </>
      );
    }
  }

  useEffect(() => {
    console.log(
      "================================================",
      decryptedString
    );
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {displayMessage()}
      {displayBasicDetails()}
      {displayPersonalDetails()}
      <br />
    </div>
  );
}
