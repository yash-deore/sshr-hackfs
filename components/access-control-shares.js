import { useGlobalContext } from "../global/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button, Container, Paper, Table } from "@mantine/core";
import { Integration } from "lit-ceramic-sdk";
import { useAccount } from "wagmi";
import { DIDDataStore } from "@glazed/did-datastore";
import { ceramic, aliases } from "../constants";
import { auth } from "../functions/authenticate";
import { showNotification, updateNotification } from "@mantine/notifications";
import { AlertCircle, Check } from "tabler-icons-react";

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
    showNotification({
      id: "load-data-access",
      loading: true,
      title: "Removing access from Doctor.",
      message: `Please wait access is being taken away from the Doctor. Do not reload or leave the page.`,
      autoClose: false,
      disallowClose: true,
    });

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

    try {
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

      updateNotification({
        id: "load-data-access",
        color: "teal",
        title: "Access Removal successful",
        message: `Access has been successfully been taken away from ${data.address}`,
        icon: <Check />,
        autoClose: 3000,
      });
    } catch (err) {
      console.log(err);
      updateNotification({
        id: "load-data-edit",
        color: "red",
        title: "Error while Access Removal",
        message: "Access removal was unsuccessful. Please try again.",
        icon: <AlertCircle />,
        autoClose: 3000,
      });
    }
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
              {allShares.map((share, id) => {
                const { doctorAddress, streamId } = share;

                return (
                  <tr key={id}>
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
