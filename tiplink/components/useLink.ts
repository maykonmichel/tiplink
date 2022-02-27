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
    getBalanceSOL(): number;
    getBalanceUSD(): number;
    getExchangeRate(): number;
    airdrop(amt: number): Promise<RpcResponseAndContext<SignatureResult>>;
    deposit(amt: number): Promise<void>;
    extConnected: boolean;
    extPublicKey: PublicKey | null;
};
export const LinkContext = createContext<LinkContent>(undefined!);
export const useLink = () => useContext(LinkContext);