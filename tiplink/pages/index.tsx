import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Footer from "../components/ui/Footer";
import  { Keypair } from '@solana/web3.js';
import Router from "next/router";
import { encode as b58encode } from 'bs58';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, MouseEvent } from "react";
import { createLink } from "../lib/link";

const createWalletShort = async () => { 
  const {slug, anchor} = await createLink();
  Router.push("/" + slug + "#" + anchor);
}

const createWallet = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  const pk = b58encode(Keypair.generate().secretKey);
  // console.log(pk);
  Router.push("/wallet#" + pk);
}

export default function Home() {
  const [ loading, setLoading ] = useState(false);
  const onClickShort = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoading(true);
    createWalletShort();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Tip Link</title>
        <meta name="description" content="Send tip links with crypto" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Tip Link
        </h1>

        <div className={styles.grid}>
          <a className={styles.card} onClick={onClickShort} style={{display: "flex", justifyContent:"space-around"}}>
            <div>
              <h2>Create a Wallet</h2>
              <p>Send tip links with crypto!</p>
            </div>
            <CircularProgress style={{display: loading ? "block": "none"}}/>
          </a>
          <Button onClick={createWallet} variant="outlined">Create Wallet Serverless</Button>
        </div>
      </main>
      {/* <Footer/> */}

    </div>
  )
}
