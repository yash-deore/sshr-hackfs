import React from "react";
import { createStyles } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CeramicConnect } from "../components/ceramic-connect";

const useStyles = createStyles(() => ({
  inner: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function Profile() {
  const { classes } = useStyles();

  return (
    <div>
      <div className={classes.inner}>
        <ConnectButton />
      </div>
      <CeramicConnect />
    </div>
  );
}
