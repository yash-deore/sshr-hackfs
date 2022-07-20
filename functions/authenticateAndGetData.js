import { DIDSession } from "@glazed/did-session";
import { EthereumAuthProvider } from "@ceramicnetwork/blockchain-utils-linking";
import { ceramic, aliases } from "../constants";
import { showNotification } from "@mantine/notifications";
import { AlertCircle, Check } from "tabler-icons-react";
import { DIDDataStore } from "@glazed/did-datastore";

let authenticate = false;
let PBI = null;
let PPI = null;
let PMI = null;
let PSI = null;
let authData = { authenticate, PBI, PPI, PMI };

export async function authenticateAndGetData() {
  if (window.ethereum === null) {
    showNotification({
      color: "red",
      title: "Authentication falied",
      message: "Unable to authenticate. Please try again.",
      icon: <AlertCircle />,
      autoClose: 3000,
    });

    return authData;
  } else {
    const datastore = new DIDDataStore({ ceramic, model: aliases });
    const ethereumProvider = window.ethereum;
    try {
      const accounts = await ethereumProvider.request({
        method: "eth_requestAccounts",
      });
      const authProvider = new EthereumAuthProvider(
        ethereumProvider,
        accounts[0]
      );
      const session = new DIDSession({ authProvider });
      const userDid = await session.authorize();
      ceramic.did = userDid;
      showNotification({
        color: "teal",
        title: "Authentication successful",
        message: "Patient authenticated",
        icon: <Check />,
        autoClose: 3000,
      });

      authenticate = true;
      try {
        PBI = await datastore.get("patientBasicInformation");
        PPI = await datastore.get("patientPersonalInformation");
        PMI = await datastore.get("patientMedicalInformation");
        PSI = await datastore.get("patientDataShare");

        showNotification({
          color: "teal",
          title: "Data Retrieved Successfully",
          message: "Patient Data retrieved",
          icon: <Check />,
          autoClose: 3000,
        });

        return { authenticate: true, PBI, PPI, PMI, PSI };
      } catch (err) {
        showNotification({
          color: "red",
          title: "Data Retrieval Unsuccessful",
          message: "Unable to retrieve your data. Please try again.",
          icon: <AlertCircle />,
          autoClose: 3000,
        });
        console.log(err);

        return authData;
      }
    } catch (err) {
      showNotification({
        color: "red",
        title: "Authentication falied",
        message: "Unable to authenticate. Please try again.",
        icon: <AlertCircle />,
        autoClose: 3000,
      });
      console.log(err);

      return authData;
    }
  }
}
