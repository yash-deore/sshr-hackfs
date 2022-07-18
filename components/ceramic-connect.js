import React, { useState } from "react";
import { Button, createStyles } from "@mantine/core";
import { useAccount } from "wagmi";
import { DIDDataStore } from "@glazed/did-datastore";
import { useRouter } from "next/router";
import { ceramic, aliases } from "../constants";
import { auth } from "../functions/authenticate";
import { useGlobalContext } from "../global/store";

import { showNotification } from "@mantine/notifications";
import { Check, AlertCircle } from "tabler-icons-react";
import { PatientInformation } from "./patient-information";
import { NewPatient } from "./new-patient";
import { authenticateAndGetData } from "../functions/authenticateAndGetData";

const useStyles = createStyles((theme) => ({
  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    "@media (max-width: 520px)": {
      flexDirection: "column",
    },
  },

  control: {
    marginBottom: theme.spacing.lg,
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    "@media (max-width: 520px)": {
      height: 42,
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

export function CeramicConnect() {
  const { classes } = useStyles();
  const { data } = useAccount();

  const [globalStore, setGlobalStore] = useGlobalContext();

  async function connectIdentityCeramic() {
    const authData = await authenticateAndGetData();
    const { authenticate, PBI, PPI, PMI } = authData;

    setGlobalStore({
      authenticated: authenticate,
      patientBasic: PBI,
      patientPersonal: PPI,
      patientMedical: PMI,
    });
  }

  function DisplayPatient() {
    const { authenticated, patientBasic, patientPersonal, patientMedical } =
      globalStore;
    if (authenticated) {
      if (patientBasic === null || patientPersonal === null)
        return <NewPatient />;
      else {
        const { name, gender, dateOfBirth, maritalStatus } = patientBasic;
        const { countryCode, phoneNumber, emailAddress } = patientPersonal;
        const {
          allergies,
          currentMedications,
          symptoms,
          progressNotes,
          vitalSigns,
        } = patientMedical;
        const completePhoneNumber = countryCode + " " + phoneNumber;
        const dateConversion = new Date(dateOfBirth);
        const convertedDateOfBirth = dateConversion.toString().substring(4, 15);

        return (
          <PatientInformation
            name={name}
            gender={gender}
            date={convertedDateOfBirth}
            maritalStatus={maritalStatus}
            phone={completePhoneNumber}
            mail={emailAddress}
            allergies={allergies}
            currentMedications={currentMedications}
            symptoms={symptoms}
            progressNotes={progressNotes}
            vitalSigns={vitalSigns}
          />
        );
      }
    }
  }

  function CeramiConnectButton() {
    if (globalStore.authenticated === false)
      return (
        <Button
          className={classes.control}
          size="lg"
          onClick={connectIdentityCeramic}
        >
          Connect Identity
        </Button>
      );
  }

  if (data) {
    return (
      <div>
        <div className={classes.controls}>{CeramiConnectButton()}</div>

        {DisplayPatient()}
      </div>
    );
  }
}
