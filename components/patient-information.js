import { useRouter } from "next/router";
import {
  Card,
  Image,
  Text,
  Group,
  Button,
  createStyles,
  Table,
  Avatar,
  Container,
  Title,
  Accordion,
} from "@mantine/core";
import {
  Cake,
  GenderMale,
  HeartHandshake,
  Mail,
  Phone,
  User,
} from "tabler-icons-react";
import { PatientBasicInformation } from "./patient-basic-information";
import PatientPersonalInformation from "./patient-personal-information";
import { PatientMedicalInformation } from "./patient-medical-information";

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

export function PatientInformation({
  name,
  gender,
  date,
  maritalStatus,
  phone,
  mail,
  allergies,
  currentMedications,
  symptoms,
  progressNotes,
  vitalSigns,
}) {
  const router = useRouter();
  const { classes } = useStyles();

  return (
    <Container size="sm" className={classes.wrapper}>
      <Accordion
        iconPosition="right"
        classNames={{
          item: classes.item,
          itemOpened: classes.itemOpened,
          control: classes.control,
        }}
      >
        <Accordion.Item label="Patient basic Information">
          <PatientBasicInformation
            name={name}
            gender={gender}
            date={date}
            maritalStatus={maritalStatus}
          />
        </Accordion.Item>

        <Accordion.Item label="Patient personal Information">
          <PatientPersonalInformation phone={phone} emailAddress={mail} />
        </Accordion.Item>
      </Accordion>

      <PatientMedicalInformation
        allergies={allergies}
        currentMedications={currentMedications}
        symptoms={symptoms}
        progressNotes={progressNotes}
        vitalSigns={vitalSigns}
      />
    </Container>
  );
}
