import  { Keypair, clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useEffect, useState, useMemo } from "react";
const QRCode = require("qrcode.react");
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
// Default styles that can be overridden by your app

import { LinkProvider } from "./LinkContextProvider";
import { useEndpoint } from "./useEndpoint";
import { EndpointProvider } from "./EndpointProvider";
import Main from "./ui/Main";

const UIWrapper = (props: {secretKey: Uint8Array}) => {
  const { endpoint } = useEndpoint();
  const endpointUrl = clusterApiUrl(endpoint);
  const linkKeypair = Keypair.fromSecretKey(props.secretKey);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [endpointUrl]
  );
  return (
    <ConnectionProvider endpoint={endpointUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <LinkProvider linkKeypair={linkKeypair} endpointUrl={endpointUrl}>
            <Main/>
          </LinkProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

const Wallet = (props: {secretKey: Uint8Array}) => {
  const [url, setUrl] = useState("");
  
  useEffect(() => {
    setUrl(window.location.href);
  });

  return (
    <EndpointProvider>
      <UIWrapper secretKey={props.secretKey}/>
    </EndpointProvider>
  );
}

export default Wallet;
