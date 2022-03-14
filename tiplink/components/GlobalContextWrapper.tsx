import theme from "../lib/theme";
import { ThemeProvider } from '@mui/material';

import { EndpointProvider } from '../components/EndpointProvider';
import { useEndpoint } from '../components/useEndpoint';

import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from "react";
const QRCode = require("qrcode.react");
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';

import React, { FC, ReactNode } from "react";
import { ExchangeRateProvider } from "./useExchangeRate";

export interface GlobalContextWrapperProps {
    children: ReactNode;
};

const WithEndpoint  : FC<GlobalContextWrapperProps> = ({ children }) => {
    const { endpointUrl } = useEndpoint();
    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [endpointUrl]
    );
    return (
        <ConnectionProvider endpoint={endpointUrl}>
            <WalletProvider wallets={wallets}>
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
                        {children}
                    </WithEndpoint> 
                </EndpointProvider>
            </ExchangeRateProvider>
        </ThemeProvider>
    );
}




export default GlobalContextWrapper;