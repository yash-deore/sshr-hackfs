import { useEffect, useState } from "react";
import { TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { Integration } from "lit-ceramic-sdk";
import { DIDDataStore } from "@glazed/did-datastore";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Check, AlertCircle } from "tabler-icons-react";

import { ceramic, aliases } from "../constants";
import { useGlobalContext } from "../global/store";
import { accessControlArray } from "../functions/accessControl";
import { selectedShareData } from "../functions/selectedShareData";
import { EncryptedAccordion } from "./encrypted-accordion";
import { ethers } from "ethers";

let litCeramicIntegration = new Integration(
  "https://ceramic-clay.3boxlabs.com",
  "ethereum"
);

export default function StreamEncrypt() {
  const router = useRouter();
  const { data } = useAccount();
  const dataStore = new DIDDataStore({ ceramic, model: aliases });

  const [globalStore, setGlobalStore] = useGlobalContext();
  const [encryptedStreamId, setEncryptedStreamId] = useState("");

  const form = useForm({
    initialValues: {
      address: "",
      message: "",
      basicDetails: false,
      personalDetails: false,
      medicalDetails: true,
    },
  });

  async function handleShare(e) {
    e.preventDefault();

    showNotification({
      id: "load-data-encrypt",
      loading: true,
      title: "Encrypting Patient data",
      message: "Please wait. Do not reload or leave the page.",
      autoClose: false,
      disallowClose: true,
    });

    if (ethers.utils.isAddress(form.values.address)) {
      const accessControlConditions = accessControlArray(
        `${data.address}`,
        form.values.address
      );

      const { patientBasic, patientPersonal, patientMedical, patientShares } =
        globalStore;
      const { message, basicDetails, personalDetails, medicalDetails } =
        form.values;

      const encryptArray = selectedShareData(
        basicDetails,
        patientBasic,
        personalDetails,
        patientPersonal,
        medicalDetails,
        patientMedical
      );
      const encryptObject = {
        message,
        dataArray: encryptArray,
      };
      const encryptString = JSON.stringify(encryptObject);
      console.log(encryptObject);

      const response = await litCeramicIntegration.encryptAndWrite(
        encryptString,
        accessControlConditions
      );
      console.log(response);
      setEncryptedStreamId(response);

      if (response.startsWith("something"))
        updateNotification({
          id: "load-data-encrypt",
          color: "red",
          title: "Data Encryption Unsuccessful",
          message: "Unable to Encrypt your data. Please try again.",
          icon: <AlertCircle />,
          autoClose: 3000,
        });
      else {
        const newShare = {
          streamId: response,
          doctorAddress: form.values.address,
        };

        if (patientShares === null) {
          const firstShare = {
            shares: [newShare],
          };
          await dataStore.set("patientDataShare", firstShare);
        } else {
          const allShares = patientShares.shares;
          allShares.push(newShare);
          const newShares = {
            shares: allShares,
          };

          await dataStore.set("patientDataShare", newShares);
        }

        updateNotification({
          id: "load-data-encrypt",
          color: "teal",
          title: "Patient Data encrypted successfully",
          message: "You can share your Stream Id with your doctor now",
          icon: <Check />,
          autoClose: 6000,
        });
      }
    } else {
      updateNotification({
        id: "load-data-encrypt",
        color: "red",
        title: "Enter a Valid Ethereum Address",
        message: "Invalid Doctor's Address. Please try again.",
        icon: <AlertCircle />,
        autoClose: 3000,
      });
    }
  }

  function EncryptedStreamIdDisplay() {
    if (
      encryptedStreamId.length > 0 &&
      !encryptedStreamId.startsWith("something")
    )
      return <EncryptedAccordion encryptedResponse={encryptedStreamId} />;
  }

  useEffect(() => {
    const { authenticated, patientBasic, patientPersonal, patientMedical } =
      globalStore;
    if (
      authenticated === false ||
      data.address === undefined ||
      patientBasic === null ||
      patientPersonal === null ||
      patientMedical === null
    )
      router.push("/profile", null, { shallow: true });

    litCeramicIntegration.startLitClient(window);
  }, []);

  return (
    <div>
      <form onSubmit={handleShare}>
        <Checkbox
          mt="lg"
          label="Patient Basic Details"
          {...form.getInputProps("basicDetails", { type: "checkbox" })}
        />

        <Checkbox
          mt="lg"
          label="Patient Personal Details"
          {...form.getInputProps("personalDetails", { type: "checkbox" })}
        />

        <Checkbox
          mt="lg"
          label="Patient Medical Details"
          {...form.getInputProps("medicalDetails", { type: "checkbox" })}
        />
        <br />

        <TextInput
          radius="xl"
          size="md"
          required
          placeholder="Doctor's address : 0x0000000000000000000000000000000000000000"
          {...form.getInputProps("address")}
        />
        <br />

        <TextInput
          radius="xl"
          size="md"
          required
          placeholder="Message for the doctor"
          {...form.getInputProps("message")}
        />
        <br />

        <Button fullWidth size="md" radius="xl" type="submit">
          Share
        </Button>
      </form>

      {EncryptedStreamIdDisplay()}
    </div>
  );
}
