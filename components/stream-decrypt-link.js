import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Integration } from "lit-ceramic-sdk";
import { showNotification, updateNotification } from "@mantine/notifications";
import { AlertCircle, Check } from "tabler-icons-react";
import { DecryptedAccordianDisplay } from "./decrypted-accordion";
import { Accordion, Container, createStyles, Title } from "@mantine/core";
import { API_URL, CHAIN } from "../constants";

let litCeramicIntegration = new Integration(API_URL, CHAIN);

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

export default function DecryptStreamLink() {
  const { classes } = useStyles();
  const router = useRouter();
  const {
    query: { encryptedStreamId },
  } = router;

  const [decryptedResponse, setDecryptedResponse] = useState("");

  function decryptStream() {
    litCeramicIntegration
      .readAndDecrypt(encryptedStreamId)
      .then((value) => {
        console.log("Decrypted String ==>> ", value);
        if (value === "FALSE")
          updateNotification({
            id: "load-data-decrypt-link",
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
            id: "load-data-decrypt-link",
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
          id: "load-data-decrypt-link",
          color: "red",
          title: "Data Retrieval Unsuccessful",
          message: "Unable to retrieve your data. Please try again.",
          icon: <AlertCircle />,
          autoClose: 3000,
        });
      });
  }

  function decryptedData() {
    if (decryptedResponse.length > 0)
      return <DecryptedAccordianDisplay decryptedString={decryptedResponse} />;
    else {
      return (
        <Container size="sm" className={classes.wrapper}>
          <Title order={3} align="center" className={classes.title}>
            Stream Id: <b>{encryptedStreamId}</b>
          </Title>

          <Accordion
            iconPosition="right"
            classNames={{
              item: classes.item,
              itemOpened: classes.itemOpened,
              control: classes.control,
            }}
          >
            <Accordion.Item label="Access Denied ?">
              You do not have the access to view the data or the Stream Id is
              invalid.
            </Accordion.Item>
            <Accordion.Item label="Invalid Stream Id ?">
              If the Stream Id is invalid then you can never retrieve anything
              out of it. So check if the Stream Id is correct.
            </Accordion.Item>
          </Accordion>

          <Title order={3} align="center" className={classes.title}>
            Please try Reloading if facing an error.
          </Title>
        </Container>
      );
    }
  }

  useEffect(() => {
    showNotification({
      id: "load-data-decrypt-link",
      loading: true,
      title: "Decrypting Patient data",
      message: "Please wait. Do not reload or leave the page.",
      autoClose: false,
      disallowClose: true,
    });

    litCeramicIntegration.startLitClient(window);

    decryptStream();
  }, []);

  return <div>{decryptedData()}</div>;
}
