import Wallet from "../components/wallet";
import Router from "next/router";
import { useState, useEffect } from "react";
// @ts-ignore
import { decode as b58decode, encode as b58encode } from 'bs58';
import { Keypair } from "@solana/web3.js";
import { kdfz, randBuf } from "../lib/crypto";

const WalletWrapperLong = () => {
  const [secretKey, setSecretKey] = useState<Uint8Array>();
  const createWallet = () => {
      const pwLength = 8;
      randBuf(pwLength).then((b) => Router.push("/wallet#" + b58encode(b)));
  }

  useEffect(() => {
    const hash = window.location.hash.substr(1);
    if(hash === "") {
      createWallet();
      return;
    }
  }, []);

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

  if (secretKey !== undefined){
    return(<Wallet secretKey={secretKey}/>);
  } else {
    return(<p>Generating wallet...</p>);
  }
};

export default WalletWrapperLong;