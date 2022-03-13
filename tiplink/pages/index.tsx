import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Router from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import { useState, MouseEvent } from "react";
import { createLink } from "../lib/link";
import WalletAppBar from '../components/WalletAppBar';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import CurrencyInput, {fiatQuickInputDefault, cryptoQuickInputDefault} from '../components/ui/common/CurrencyInput';
import "@fontsource/poppins";
import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';

const createWalletShort = async () => { 
  const {slug, anchor} = await createLink();
  Router.push("/" + slug + "#" + anchor);
}

export default function Home() {
  const [ loading, setLoading ] = useState(false);
  const [inputAmountSOL, setInputAmountSOL ] = useState<number>(NaN);
  const { connected,  publicKey, sendTransaction  } = useWallet();
  const { connection } = useConnection();

  const onClickEmptyTipLink = (e: MouseEvent<HTMLElement>) => {
    if(loading) {
      return;
    }
    e.preventDefault();
    setLoading(true);
    createWalletShort();
  }

  const onClickCreateTipLink = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if(!connected) {
      alert("Please connect a solana wallet to load value onto a TipLink. Alternatively, create an empty link first.");
      return;
    }

    setLoading(true);

    createLink().then(({slug, anchor, keypair}) => {
      if(keypair.publicKey === null) {
        alert("Error creating link.");
        return;
      }

      if(publicKey === null) {
        alert("Wallet appears connected, but couldn't get publicKey.");
        return;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: keypair.publicKey,
          lamports: inputAmountSOL * LAMPORTS_PER_SOL
        })
      );

      sendTransaction(transaction, connection).then((signature) => {
        connection.confirmTransaction(signature, 'processed').then((succeeded) => {
          Router.push("/" + slug + "#" + anchor);
        }).catch(e => alert("Error confirming transaction: " + e.message));
      }).catch(e => alert("Error sending transaction: " + e.message));
    }).catch(e => alert("Error creating link" + e.message));
  }

  return (
    <div>
      <Head>
        <title>Tip Link</title>
        <meta name="description" content="Send tip links with crypto" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WalletAppBar/>
      <div className={styles.container}>
        <main className={styles.main}>
        <Typography variant="h4">Links are the new money</Typography>
        <Typography>Send crypto to anyone, even if they don't have a wallet.</Typography>
        <Typography>No app needed!</Typography>

          <Box sx={{
            m: 2,
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center"
          }}>
            <Typography sx={{m: 2}}>Try it now! How much do you want to send?</Typography>
            <CurrencyInput 
              fiatCurrency='USD' cryptoCurrency='SOL' 
              fiatQuickInputOptions={fiatQuickInputDefault}
              cryptoQuickInputOptions={cryptoQuickInputDefault}
              onValueChange={setInputAmountSOL} 
            />
            <LoadingButton sx={{m: 2}} variant="contained" onClick={onClickCreateTipLink} loading={loading}>Create TipLink</LoadingButton>
            <Typography>
              Want to deposit value later? <a onClick={onClickEmptyTipLink}>Create an empty TipLink.</a>
            </Typography>
          </Box>
        </main>
        {/* <Footer/> */}

      </div>
    </div>
  )
}
