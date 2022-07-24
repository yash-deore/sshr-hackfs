import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  //uri: 'https://api.thegraph.com/subgraphs/name/brahmapsen/healthnft',
  uri: "https://api.thegraph.com/subgraphs/name/brahmapsen/healthdatamarket",
});

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  midnightTheme,
  lightTheme,
  connectorsForWallets,
  wallet,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { AppHeader } from "../components/app-header";
import { GlobalContextProvider } from "../global/store";

const { chains, provider } = configureChains(
  [
      //chain.mainnet,
      //chain.polygon,
        chain.polygonMumbai
  ],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [wallet.metaMask({ chains }), wallet.walletConnect({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  function toggleColorScheme(value) {
    return setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  }

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={colorScheme === "dark" ? midnightTheme() : lightTheme()}
        showRecentTransactions={true}
      >
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{ colorScheme }}
            withGlobalStyles
            withNormalizeCSS
          >
            <ApolloProvider client={client}>
              <NotificationsProvider>
                <GlobalContextProvider>
                  <AppHeader
                    links={[
                      { link: "/", label: "Home" },
                      { link: "/profile", label: "Profile" },
                      { link: "/edit", label: "Edit" },
                      { link: "/share", label: "Share" },
                      { link: "/retrieve", label: "Retrieve" },
                      { link: "/access", label: "Access" },
                      { link: "/marketplace", label: "Marketplace" },
                    ]}
                  />
                  <Component {...pageProps} />
                </GlobalContextProvider>
              </NotificationsProvider>
            </ApolloProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
