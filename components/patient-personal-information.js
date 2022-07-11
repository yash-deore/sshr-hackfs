import {
  Card,
  Image,
  Text,
  Group,
  Button,
  createStyles,
  Table,
  Avatar,
} from "@mantine/core";
import {
  Cake,
  GenderMale,
  HeartHandshake,
  Mail,
  Phone,
  User,
} from "tabler-icons-react";

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

export default function PatientPersonalInformation({ phone, emailAddress }) {
  const { classes } = useStyles();

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section} mt="md">
        <Table>
          <tbody>
            <tr>
              <td>
                <Group>
                  <Phone /> <Text>Phone</Text>
                </Group>
              </td>
              <td>
                <Text>{phone}</Text>
              </td>
            </tr>

            <tr>
              <td>
                <Group>
                  <Mail /> <Text>Mail</Text>
                </Group>
              </td>
              <td>
                <Text>{emailAddress}</Text>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Section>
    </Card>
  );
}
