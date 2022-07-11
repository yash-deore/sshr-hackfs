import { DIDSession } from "@glazed/did-session";
import { EthereumAuthProvider } from "@ceramicnetwork/blockchain-utils-linking";
import { ceramic } from "../constants";
import { showNotification } from "@mantine/notifications";
import { AlertCircle } from "tabler-icons-react";

async function authenticateWithEthereum(ethereumProvider) {
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
  } catch (err) {
    showNotification({
      color: "red",
      title: "Authentication falied",
      message: "Unable to authenticate. Please try again.",
      icon: <AlertCircle />,
      autoClose: 3000,
    });
    console.log(err);
  }
}

export async function auth() {
  if (window.ethereum === null)
    throw new Error("No injected Ethereum Provider");
  await authenticateWithEthereum(window.ethereum);
}
