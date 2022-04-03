import theme from "../lib/theme";
import { ThemeProvider } from '@mui/material';

import { EndpointProvider } from '../components/EndpointProvider';
import { useEndpoint } from '../components/useEndpoint';

import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import {GlowWalletAdapter } from '@solana/wallet-adapter-glow'
import { useMemo } from "react";
const QRCode = require("qrcode.react");
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';

import React, { FC, ReactNode } from "react";
import { ExchangeRateProvider } from "./useExchangeRate";
import { useEffect } from "react";
import { Transaction, SendOptions, TransactionSignature } from '@solana/web3.js';
import {
    EventEmitter,
} from '@solana/wallet-adapter-base';

export interface GlobalContextWrapperProps {
    children: ReactNode;
};

interface GlowWalletEvents {
    connect(...args: unknown[]): unknown;
    disconnect(...args: unknown[]): unknown;
}

interface GlowWallet extends EventEmitter<GlowWalletEvents> {
    isGlow?: boolean;
    publicKey?: { toBytes(): Uint8Array };
    isConnected: boolean;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signAndSendTransaction(
        transaction: Transaction,
        options?: SendOptions
    ): Promise<{ signature: TransactionSignature }>;
    signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}

interface GlowWindow extends Window {
    glowSolana?: GlowWallet;
}
declare const window: GlowWindow;

const WithEndpoint  : FC<GlobalContextWrapperProps> = ({ children }) => {
    const { endpointUrl } = useEndpoint();
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new GlowWalletAdapter()
        ], [endpointUrl]
    );

    useEffect(() => {
        console.log("glowSolana", window.glowSolana);
        console.log("glowSolana.isGlow", window.glowSolana?.isGlow);
    }, []);
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
                        {children}
                    </WithEndpoint> 
                </EndpointProvider>
            </ExchangeRateProvider>
        </ThemeProvider>
    );
}




export default GlobalContextWrapper;
