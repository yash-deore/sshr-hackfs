import { Card, Text, Group, createStyles, Table } from "@mantine/core";
import { Cake, GenderMale, HeartHandshake, User } from "tabler-icons-react";

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

export function PatientBasicInformation({ name, gender, date, maritalStatus }) {
  const { classes } = useStyles();

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section} mt="md">
        <Table>
          <tbody>
            <tr>
              <td>
                <Group>
                  <User /> <Text>Name</Text>
                </Group>
              </td>
              <td>
                <Text>{name}</Text>
              </td>
            </tr>

            <tr>
              <td>
                <Group>
                  <GenderMale /> <Text>Gender</Text>
                </Group>
              </td>
              <td>
                <Text>{gender}</Text>
              </td>
            </tr>

            <tr>
              <td>
                <Group>
                  <Cake /> <Text>Date of Birth</Text>
                </Group>
              </td>
              <td>
                <Text>{date}</Text>
              </td>
            </tr>

            <tr>
              <td>
                <Group>
                  <HeartHandshake /> <Text>Marital Status</Text>
                </Group>
              </td>
              <td>
                <Text>{maritalStatus}</Text>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Section>
    </Card>
  );
}
