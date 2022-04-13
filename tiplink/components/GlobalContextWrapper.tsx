import theme from "../lib/theme";
import { ThemeProvider } from '@mui/material';

import { EndpointProvider } from '../components/EndpointProvider';
import { useEndpoint } from '../components/useEndpoint';
import { 
    SolflareWalletAdapter,
    PhantomWalletAdapter, 
    GlowWalletAdapter,
    SlopeWalletAdapter,
    TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { useMemo } from "react";
const QRCode = require("qrcode.react");
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';

import React, { FC, ReactNode } from "react";
import { ExchangeRateProvider } from "./useExchangeRate";
import { TxnProvider } from "./useWaitForTxn";

export interface GlobalContextWrapperProps {
    children: ReactNode;
};


const WithEndpoint  : FC<GlobalContextWrapperProps> = ({ children }) => {
    const { endpointUrl } = useEndpoint();
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new TorusWalletAdapter()
        ], [endpointUrl]
    );

    return (
        <ConnectionProvider endpoint={endpointUrl}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export const GlobalContextWrapper  : FC<GlobalContextWrapperProps> = ({ children }) => {
    return(
        <ThemeProvider theme={theme}>
            <ExchangeRateProvider>
                <EndpointProvider>
                    <WithEndpoint>
                        <TxnProvider>
                            {children}
                        </TxnProvider>
                    </WithEndpoint> 
                </EndpointProvider>
            </ExchangeRateProvider>
        </ThemeProvider>
    );
}




export default GlobalContextWrapper;
