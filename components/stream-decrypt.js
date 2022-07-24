import { useEffect, useState } from "react";
import { TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Integration } from "lit-ceramic-sdk";
import { DecryptedResponse } from "./decrypted-response";
import { DecryptedAccordianDisplay } from "./decrypted-accordion";
import { showNotification, updateNotification } from "@mantine/notifications";
import { AlertCircle, Check } from "tabler-icons-react";
import {API_URL, CHAIN} from "../constants"

let litCeramicIntegration = new Integration(
    API_URL,
  CHAIN
);

export default function StreamDecrypt() {
  const [decryptedResponse, setDecryptedResponse] = useState("");

  const form = useForm({
    initialValues: {
      streamId: "",
    },
  });

  async function handleDecrypt(e) {
    e.preventDefault();

    showNotification({
      id: "load-data-decrypt",
      loading: true,
      title: "Decrypting Patient data",
      message: "Please wait. Do not reload or leave the page.",
      autoClose: false,
      disallowClose: true,
    });

    litCeramicIntegration
      .readAndDecrypt(form.values.streamId)
      .then((value) => {
        console.log("Decrypted String ==>> ", value);
        if (value === "FALSE")
          updateNotification({
            id: "load-data-decrypt",
            color: "red",
            title: "Access Denied",
            message: "You don't have access to the data.",
            icon: <AlertCircle />,
            autoClose: 5000,
            disallowClose: true,
          });
        else {
          setDecryptedResponse(value);
          updateNotification({
            id: "load-data-decrypt",
            color: "teal",
            title: "Access Granted",
            message: "Data retrieved successfully.",
            icon: <Check />,
            autoClose: 5000,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        updateNotification({
          id: "load-data-decrypt",
          color: "red",
          title: "Data Retrieval Unsuccessful",
          message: "Unable to retrieve your data. Please try again.",
          icon: <AlertCircle />,
          autoClose: 3000,
        });
      });
  }

  function decryptedData() {
    console.log(decryptedResponse);
    if (decryptedResponse.length > 0)
      return (
        <>
          <DecryptedAccordianDisplay decryptedString={decryptedResponse} />
          {/* <DecryptedResponse decryptedString={decryptedResponse} /> */}
        </>
      );
  }

  useEffect(() => {
    litCeramicIntegration.startLitClient(window);
  }, []);

  return (
    <div>
      <form
        onSubmit={handleDecrypt}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextInput
          radius="xl"
          size="md"
          placeholder="
        Enter Stream ID :
        kjzl6cwe1jw145nrlug02dm9j6myxy8whotmq3kukojogjz2lk03zoe5s0wrfr1"
          {...form.getInputProps("streamId")}
        />
        <Button type="submit" size="md" radius="xl" style={{ margin: "1% 0" }}>
          Decrypt
        </Button>
      </form>

      <div>{decryptedData()}</div>
    </div>
  );
}
