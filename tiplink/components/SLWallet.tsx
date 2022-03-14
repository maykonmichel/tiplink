import Head from 'next/head';
import Wallet from "./wallet";
import { useState, useEffect } from "react";
// @ts-ignore
import { decode as b58decode } from 'bs58';
import { Keypair } from "@solana/web3.js";
import { kdfz } from "../lib/crypto";
import Progress from "./ui/common/Progress";

const SLWallet = () => {
  const [secretKey, setSecretKey] = useState<Uint8Array>();
  useEffect(() => {
    try{
      const pw = b58decode(window.location.hash.substr(1));
      const seedLength = 32;
      kdfz(seedLength, pw).then((seed: Buffer) => {
        const kp = Keypair.fromSeed(seed);
        setSecretKey(kp.secretKey);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);


  return(
    <div>
      <Head>
        <title>Tip Link</title>
        <meta name="description" content="Send tip links with crypto" />
        <meta property="og:title" content="You received some crypto!" />
        <meta property="og:url" content="https://www.tiplink.io" />
        <meta property="og:image" content="https://tiplink.io/tiplink-card-preview.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {(secretKey !== undefined) ? <Wallet secretKey={secretKey}/> : <Progress/>}
    </div>
  );
};

export default SLWallet;