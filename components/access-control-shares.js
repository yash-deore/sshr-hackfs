import { useGlobalContext } from "../global/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button, Container, Paper, Table } from "@mantine/core";
import { Integration } from "lit-ceramic-sdk";
import { useAccount } from "wagmi";
import { DIDDataStore } from "@glazed/did-datastore";
import { ceramic, aliases } from "../constants";
import { auth } from "../functions/authenticate";

let litCeramicIntegration = new Integration(
  "https://ceramic-clay.3boxlabs.com",
  "ethereum"
);

export default function AccessControlShares() {
  const router = useRouter();
  const [globalStore, setGlobalStore] = useGlobalContext();
  const { authenticated, patientShares } = globalStore;
  const { data } = useAccount();
  const dataStore = new DIDDataStore({ ceramic, model: aliases });

  useEffect(() => {
    if (authenticated === false)
      router.push("/profile", null, { shallow: true });

    litCeramicIntegration.startLitClient(window);
  }, []);

  async function removeAccess(streamId) {
    const newAccessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: data.address,
        },
      },
    ];

    await litCeramicIntegration.updateAccess(
      streamId,
      newAccessControlConditions
    );

    const { shares } = patientShares;
    const newShares = shares.filter((share) => share.streamId !== streamId);
    const newPatientShares = {
      shares: newShares,
    };

    await auth();
    await dataStore.set("patientDataShare", newPatientShares);

    setGlobalStore({
      ...globalStore,
      patientShares: newPatientShares,
    });

    console.log("shares", newShares);
  }

  function DisplayShares() {
    const { patientShares } = globalStore;

    if (patientShares === null || patientShares.shares.length === 0) {
      return (
        <Container>
          <Paper shadow="xs" p="md" withBorder>
            <h3>No Shares to Display.</h3>
            You can share data with Medical Professionals and the changes will
            be reflected here.
          </Paper>
        </Container>
      );
    } else {
      const allShares = patientShares.shares;
      console.log(allShares);

      return (
        <Container>
          <Table>
            <thead>
              <tr>
                <th>Doctor Address</th>
                <th>Stream Id</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allShares.map((share) => {
                const { doctorAddress, streamId } = share;

                return (
                  <tr>
                    <td>{doctorAddress}</td>
                    <td>{streamId}</td>
                    <td>
                      <Button
                        color="red"
                        onClick={() => removeAccess(streamId)}
                      >
                        Remove Access
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      );
    }
  }

  return <>{DisplayShares()}</>;
}
