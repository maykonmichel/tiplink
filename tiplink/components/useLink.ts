import { createContext, useContext } from "react";
import { Keypair, PublicKey, RpcResponseAndContext, SignatureResult, TransactionSignature } from '@solana/web3.js';

export interface BalanceCallback {
    (balance: number): void;
}
// so we don't have to keep passing the linkKeypair everywhere
// TODO don't return promises from this
type LinkContent = {
    linkKeypair: Keypair;
    sendSOL(destination: PublicKey, amt: number): Promise<TransactionSignature>;
    getFees(): Promise<number>;
    balanceSOL: number;
    balanceUSD: number;
    airdrop(amt: number): Promise<RpcResponseAndContext<SignatureResult>>;
    deposit(amt: number): Promise<TransactionSignature | undefined>;
    extConnected: boolean;
    extPublicKey: PublicKey | null;
    scheduleBalanceUpdate(t: number): void;
    getFeeEstimate(): number;
};
export const LinkContext = createContext<LinkContent>(undefined!);
export const useLink = () => useContext(LinkContext);