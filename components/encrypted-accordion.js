import { Container, Title, Accordion, createStyles } from "@mantine/core";
import { ButtonCopy } from "./copy-to-clipboard";
import { convertEncryptedStreamIdToShareUrl } from "../functions/convertEncryptedStreamIdToShareUrl";

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

export function EncryptedAccordion({ encryptedStreamId }) {
  const { classes } = useStyles();

  function linkShare() {
    if (encryptedStreamId.length > 0) {
      const shareUrl = convertEncryptedStreamIdToShareUrl(encryptedStreamId);
      return (
        <Accordion.Item label="Share Link">
          Share this link. You do not have to worry about this link going public
          as the data is access controlled. <br /> <br />
          <ButtonCopy link={shareUrl} />
        </Accordion.Item>
      );
    }
  }

  function displayEncryptedStreamId() {
    if (encryptedStreamId.length > 0) {
      return (
        <Accordion.Item label="Share Stream Id">
          Share this stream Id : <b>{encryptedStreamId}</b>
        </Accordion.Item>
      );
    }
  }

  return (
    <Container size="sm" className={classes.wrapper}>
      <Title align="center" className={classes.title}>
        Encrypted Sharable Stream Id
      </Title>

      <Accordion
        iconPosition="right"
        initialItem={0}
        classNames={{
          item: classes.item,
          itemOpened: classes.itemOpened,
          control: classes.control,
        }}
      >
        {linkShare()}
        {displayEncryptedStreamId()}
      </Accordion>
    </Container>
  );
}
