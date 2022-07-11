import { Button, Card, createStyles, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

export function NewPatient() {
  const router = useRouter();
  const { classes } = useStyles();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card withBorder radius="md" p="md" className={classes.card}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title order={3}>You have no information to be displayed.</Title>
          <Text size="lg">
            Click on the button below and enter your details.
          </Text>
        </div>

        <Card.Section className={classes.section} mt="md">
          <Button
            fullWidth
            radius="md"
            style={{ flex: 1 }}
            onClick={() => {
              router.push("/edit", null, { shallow: true });
            }}
          >
            Add Information
          </Button>
        </Card.Section>
      </Card>
    </div>
  );
}
