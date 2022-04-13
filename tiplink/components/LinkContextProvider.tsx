import React, { FC, ReactNode, useState, useEffect } from 'react';
import { LinkContext, BalanceCallback } from './useLink';
import { Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, 
} from '@solana/web3.js';
import { useConnection, useWallet} from '@solana/wallet-adapter-react';
import useExchangeRate from './useExchangeRate';
import { sendAndConfirmWithRetry } from '../lib/transaction';

const FEE_MULT = 3;

export interface LinkProviderProps {
    children: ReactNode;
    linkKeypair: Keypair; 
}
const DEFAULT_COMMITMENT_LEVEL = 'confirmed';
const BALANCE_POLL_INTERVAL_MS = 1000;

export const LinkProvider: FC<LinkProviderProps> = ({ children, linkKeypair }) => {
    const { connection } = useConnection();
    const { connected: extConnected, publicKey: extPublicKey, sendTransaction: extSendTransaction, signTransaction: extSignTransaction} = useWallet();
    // in Lamportsj
    const [ balance, setBalance ] = useState(NaN);
    // in USD / SOL
    const { exchangeRate } = useExchangeRate();

    const getBalanceSOLAsync = async () => {
        return await connection.getBalance(linkKeypair.publicKey, DEFAULT_COMMITMENT_LEVEL);
    }

    const fetchBalance = (c: BalanceCallback) => {
        getBalanceSOLAsync()
        .then((b) => { 
            // console.log("got balance of " + b);
            c(b);
        })
        .catch((error) => { console.error(error);});
    }

    useEffect(() => {
        connection.getBalance(linkKeypair.publicKey, DEFAULT_COMMITMENT_LEVEL)
        .then((b) => {
            // console.log("getBalanceOuter " + b + " " + endpointUrl);
            setBalance(b);
        }).catch((error) => {
        console.log(error);
        })
    }, [])

    const updateBalance = () => {
        // console.log("updateBalance");
        fetchBalance((b) => {setBalance(b);});
    }

    const pollBalance = () => {
        updateBalance();
        setTimeout(pollBalance, BALANCE_POLL_INTERVAL_MS)
    }

    // poll for balance every second
    useEffect(() => {
        pollBalance();
    }, []);


    const sendSOL = async (destination: PublicKey, amt: number) => {
        const transaction = new Transaction({
            feePayer: linkKeypair.publicKey,
            recentBlockhash: (await connection.getRecentBlockhash()).blockhash
        }).add(
            SystemProgram.transfer({
                fromPubkey: linkKeypair.publicKey,
                toPubkey: destination,
                lamports: amt * LAMPORTS_PER_SOL,
            }),
        );
        transaction.sign(linkKeypair);
        const rawTransaction = transaction.serialize({requireAllSignatures: false});
        const res = await sendAndConfirmWithRetry(
            connection,
            rawTransaction,
            {skipPreflight: true},
            DEFAULT_COMMITMENT_LEVEL
        );
        return res.txid;
    };

    const airdrop = async (amt: number) => {
        const fromAirdropSignature = await connection.requestAirdrop(
            linkKeypair.publicKey,
            amt * LAMPORTS_PER_SOL
        );
        //wait for airdrop confirmation
        return await connection.confirmTransaction(fromAirdropSignature);
    }

    const scheduleBalanceUpdate = (t: number) => {
        setTimeout(() => {updateBalance();}, t);
    }

    // TODO refactor
    const deposit = async (amt: number) => {
        // console.log("sendMoney ", amount, " SOL from ", provider.publicKey.toBase58(), " to ", wallet.publicKey.toBase58());
        if((extPublicKey === undefined) || (extPublicKey === null) || (extSignTransaction === undefined)) {
            // TODO hmm
            alert("Please connect phantom to add money");
            return;
        }
        const amtLamports = amt * LAMPORTS_PER_SOL;
        const fees = (await getFees()) / LAMPORTS_PER_SOL;
        const walletBalance = await connection.getBalance(extPublicKey, DEFAULT_COMMITMENT_LEVEL);
        if(walletBalance < amtLamports + fees) {
            alert("Insufficient funds for deposit.")
        }

        const transaction = new Transaction({
            feePayer: extPublicKey,
            recentBlockhash: (await connection.getRecentBlockhash()).blockhash
        }).add(
            SystemProgram.transfer({
                fromPubkey: extPublicKey,
                toPubkey: linkKeypair.publicKey,
                lamports: amtLamports,
            }),
        );
        const signed = await extSignTransaction(transaction);
        const rawTransaction = signed.serialize({requireAllSignatures: false});
        // change to confirmed commitment level so it's less likely that page reloads and balance isn't on there
        const res = await sendAndConfirmWithRetry(
            connection,
            rawTransaction,
            {skipPreflight: true},
            DEFAULT_COMMITMENT_LEVEL
        );
        scheduleBalanceUpdate(1000);
        return res.txid;
    }

    const getFees = async  () => {
        // TODO this is deprecated, use getFeeForMessage instead.
        // const maybeContext = (await connection.getFeeCalculatorForBlockhash(recentBlockhash));
        // if(maybeContext === null) {
            // return NaN;
        // }
        // const feeCalculator: FeeCalculator = maybeContext.value!;
        // const feeCalc = feeCalculator.lamportsPerSignature;
        // const feeLamports = feeCalc * FEE_MULT;
        const feeLamports = 5000 * FEE_MULT;
        const fee = feeLamports / LAMPORTS_PER_SOL;
        // console.log(
        //     "feeCalculator lamportsPerSignature:  ", 
        //     feeCalculator.lamportsPerSignature,
        //      ", FEE_MULT: ", FEE_MULT,
        //      ", fee_lamports: ", feeLamports,
        //      ", LAMPORTS_PER_SOL: ", LAMPORTS_PER_SOL,
        //      ", fee_sol: ", fee
        // );
        return fee;
    }

    // very dumb for now
    const getFeeEstimate = () => {
        const feeLamports = 5000;
        return 2 * feeLamports / LAMPORTS_PER_SOL;
    }


    const balanceSOL = balance / LAMPORTS_PER_SOL;
    const balanceUSD = balanceSOL * exchangeRate;

    return (
        <LinkContext.Provider
            value={{
                linkKeypair,
                sendSOL,
                getFees,
                balanceSOL,
                balanceUSD,
                airdrop,
                deposit,
                extConnected,
                extPublicKey,
                scheduleBalanceUpdate,
                getFeeEstimate
            }}
        >
            {children}
        </LinkContext.Provider>
    );
};