import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Footer from "../components/footer";
import  { Keypair } from '@solana/web3.js';
import Router from "next/router";
import { encode as b58encode } from 'bs58';
import Button from '@mui/material/Button';
import { xor, kdf, randBuf} from "../lib/crypto";
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from "react";

const createWalletShort = async () => { 
  const kp = Keypair.generate();
  const pk = kp.secretKey;

  // generate short pw that lives in anchor
  const pwShort = await randBuf(8);
  const anchor = b58encode(pwShort);

  // derive full length pw
  // TODO we want Argon2id in optional algorithm field
  const salt = await randBuf(16);
  const pw = await kdf(pk.length, pwShort, salt);
  const serverKey = xor(pw, pk);

  // console.log("pk: ", pk);
  // console.log("anchor: ", anchor);
  // console.log("pw: ", pw);
  // console.log("serverKey: ", serverKey);
  // console.log("derived pk: ", xor(serverKey, pw));

  const endpoint = window.location.origin + "/api/create_wallet";
  const rawResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pubkey: kp.publicKey,
      cipher: b58encode(serverKey),
      salt: b58encode(salt)
    })
  });
  const content = await rawResponse.json();
  const slug = content.slug;
  Router.push("/" + slug + "#" + anchor);
}

const createWallet = (e) => {
  e.preventDefault();
  const pk = b58encode(Keypair.generate().secretKey);
  console.log(pk);
  Router.push("/wallet#" + pk);
}

export default function Home() {
  const [ loading, setLoading ] = useState(false);
  const onClickShort = (e) => {
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
      <Footer/>

    </div>
  )
}
