import { Container, Title, Accordion, createStyles } from "@mantine/core";
import { PatientBasicInformation } from "./patient-basic-information";
import { PatientMedicalInformation } from "./patient-medical-information";
import PatientPersonalInformation from "./patient-personal-information";

const useStyles = createStyles((theme, _params, getRef) => {
  const control = getRef("control");

  return {
    wrapper: {
      paddingTop: theme.spacing.xl * 2,
      paddingBottom: theme.spacing.xl * 2,
      minHeight: 650,
    },

    title: {
      fontWeight: 400,
      marginBottom: theme.spacing.xl * 1.5,
    },

    control: {
      ref: control,

      "&:hover": {
        backgroundColor: "transparent",
      },
    },

    item: {
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.lg,

      border: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[3]
      }`,
    },

    itemOpened: {
      [`& .${control}`]: {
        color:
          theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 6
          ],
      },
    },
  };
});

export function DecryptedAccordianDisplay({ decryptedString }) {
  const { classes } = useStyles();
  const parsedObject = JSON.parse(decryptedString);
  const { message, dataArray } = parsedObject;
  const patientBasicInfo = dataArray[0];
  const patientPersonalInfo = dataArray[1];
  const patientMedicalDetails = dataArray[2];

  function displayBasicDetails() {
    console.log(patientBasicInfo);
    if (patientBasicInfo !== null) {
      const { name, gender, dateOfBirth, maritalStatus } = patientBasicInfo;
      const dateConversion = new Date(dateOfBirth);
      const convertedDateOfBirth = dateConversion.toString().substring(4, 15);

      return (
        <Accordion.Item label="Patient Basic Details">
          <PatientBasicInformation
            name={name}
            gender={gender}
            date={convertedDateOfBirth}
            maritalStatus={maritalStatus}
          />
        </Accordion.Item>
      );
    }
  }

  function displayPersonalDetails() {
    if (patientPersonalInfo !== null) {
      const { countryCode, phoneNumber, emailAddress } = patientPersonalInfo;
      const phone = countryCode + " " + phoneNumber;

      return (
        <Accordion.Item label="Patient Personal Details">
          <PatientPersonalInformation
            phone={phone}
            emailAddress={emailAddress}
          />
        </Accordion.Item>
      );
    }
  }

  function displayMedicalDetails() {
    if (patientMedicalDetails !== null) {
      const {
        allergies,
        currentMedications,
        symptoms,
        progressNotes,
        vitalSigns,
      } = patientMedicalDetails;

      return (
        <PatientMedicalInformation
          allergies={allergies}
          currentMedications={currentMedications}
          symptoms={symptoms}
          progressNotes={progressNotes}
          vitalSigns={vitalSigns}
        />
      );
    }
  }

  return (
    <Container size="sm" className={classes.wrapper}>
      <Title align="center" className={classes.title}>
        Decrypted Information
      </Title>

      <Accordion
        iconPosition="right"
        classNames={{
          item: classes.item,
          itemOpened: classes.itemOpened,
          control: classes.control,
        }}
      >
        <Accordion.Item label="Message">{message}</Accordion.Item>

        {displayBasicDetails()}

        {displayPersonalDetails()}
      </Accordion>

      {displayMedicalDetails()}
    </Container>
  );
}
