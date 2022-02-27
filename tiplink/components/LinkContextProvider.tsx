import React, { FC, ReactNode, useState } from 'react';
import { LinkContext, BalanceCallback } from './useLink';
import { Keypair, PublicKey, FeeCalculator} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect } from 'react';

const FEE_MULT = 10;

export interface LinkProviderProps {
    children: ReactNode;
    linkKeypair: Keypair; 
    endpointUrl: string;
}

const getPrice = async () => {
  const endpoint = "https://serum-api.bonfida.com/orderbooks/SOLUSDC";
  const resp = await fetch(endpoint);
  const content = await resp.json();
  const book = content.data;
  const bid = book.bids[0].price;
  const ask = book.asks[0].price;
  return (bid + ask) / 2;
}


export const LinkProvider: FC<LinkProviderProps> = ({ children, linkKeypair, endpointUrl }) => {
    const { connection } = useConnection();
    const { connected: extConnected, publicKey: extPublicKey, sendTransaction: extSendTransaction} = useWallet();
    // in Lamportsj
    const [ balance, setBalance ] = useState(NaN);
    // in USD / SOL
    const [ price, setPrice ] = useState(NaN);
    const [ subscriptionId, setSubscriptionId ] = useState(0);

    const getBalanceSOLAsync = async () => {
        return await connection.getBalance(linkKeypair.publicKey, "processed");
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
        connection.getBalance(linkKeypair.publicKey, "processed")
        .then((b) => {
            // console.log("getBalanceOuter " + b + " " + endpointUrl);
            setBalance(b);
        }).catch((error) => {
        console.log(error);
        })
    }, [])

    const updateBalance = () => {
        fetchBalance((b) => {setBalance(b);});
    }

    useEffect(() => {
        getPrice().then((apiPrice) => setPrice(apiPrice));
    }, []);

    useEffect(() => {
        updateBalance();
    }, []);

    const onAccountChange = () => {
        console.log("onAccountChange");
        updateBalance();
    };

    useEffect(() => {
        setSubscriptionId(
            connection.onAccountChange(linkKeypair.publicKey, onAccountChange, "processed")
        );
    }, []);


    const sendSOL = async (destination: PublicKey, amt: number) => {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: linkKeypair.publicKey,
                toPubkey: destination,
                lamports: amt * LAMPORTS_PER_SOL,
            }),
        );
        return await sendAndConfirmTransaction(
            connection,
            transaction,
            [linkKeypair],
            {commitment: 'confirmed'},
        );
    };

    const airdrop = async (amt: number) => {
        var fromAirdropSignature = await connection.requestAirdrop(
            linkKeypair.publicKey,
            amt * LAMPORTS_PER_SOL
        );
        //wait for airdrop confirmation
        return await connection.confirmTransaction(fromAirdropSignature);
    }

    const deposit = async (amt: number) => {
        // console.log("sendMoney ", amount, " SOL from ", provider.publicKey.toBase58(), " to ", wallet.publicKey.toBase58());
        if((extPublicKey === undefined) || (extPublicKey === null)) {
            // TODO hmm
            alert("Please connect phantom to add money");
            return;
        }

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: extPublicKey,
                toPubkey: linkKeypair.publicKey,
                lamports: amt * LAMPORTS_PER_SOL,
            }),
        );
        transaction.feePayer = extPublicKey;
        transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
        console.log("transaction", transaction);

        const signature = (await extSendTransaction(transaction, connection));
        console.log('SIGNATURE', signature);
        await connection.confirmTransaction(signature);
    }

    const getFees = async  () => {
        const recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
        const maybeContext = (await connection.getFeeCalculatorForBlockhash(recentBlockhash));
        if(maybeContext === null) {
            return NaN;
        }
        const feeCalculator: FeeCalculator = maybeContext.value!;
        return (feeCalculator.lamportsPerSignature * FEE_MULT) / LAMPORTS_PER_SOL;
    }

    const getBalanceSOL = () => {
        return balance / LAMPORTS_PER_SOL;
    }

    const getBalanceUSD = () => {
        return getBalanceSOL() * price;
    }
    
    const getExchangeRate = () => {
        return price;
    }



    return (
        <LinkContext.Provider
            value={{
                linkKeypair,
                sendSOL,
                getFees,
                getBalanceSOL,
                getBalanceUSD,
                getExchangeRate,
                airdrop,
                deposit,
                extConnected,
                extPublicKey,
            }}
        >
            {children}
        </LinkContext.Provider>
    );
};