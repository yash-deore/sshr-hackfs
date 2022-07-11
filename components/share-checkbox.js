import React from "react";
import { useForm } from "@mantine/form";
import { createStyles, TextInput } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 18,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

export function ShareCheckBox() {
  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      patientBasic: false,
      patientPrivate: false,
    },
  });

  function shareEncrypt() {}

  return (
    <div
      style={{
        margin: "0 5%",
      }}
    >
      {/* <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "sm", cols: 1 },
        ]}
      > */}
      <form onSubmit={shareEncrypt}>
        <TextInput
          required
          label="Enter Doctor's address"
          placeholder="0x0000000000000000000000000000000000000000"
          classNames={classes}
        />
      </form>
      {/* </SimpleGrid> */}
    </div>
  );
}
