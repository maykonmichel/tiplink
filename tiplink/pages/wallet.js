
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import  { Keypair } from '@solana/web3.js';
import { encode as b58encode, decode as b58decode } from 'bs58';
import { useEffect, useState } from "react";

export default function Wallet() {
  const [keypair, setKeypair] = useState(undefined);
  const [errorMsg, setErrorMsg] = useState("");

  // TODO this makes the URL really long and unsightly
  // TODO better error message handling
  useEffect(() => {
    let kp = undefined;
    if(window.location.hash === "") {
      kp = Keypair.generate();
      window.location.hash = b58encode(kp.secretKey);
      setKeypair(kp);
    } else {
      try{
        kp = Keypair.fromSecretKey(b58decode(window.location.hash.substr(1)));
        setKeypair(kp);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.toString());
      }
    }
  }, []);

  if(keypair !== undefined) {
    console.log("pubkey: ", keypair.publicKey.toString());
    console.log("secretKey: ",  b58encode(keypair.secretKey));
  }

  let body = undefined;
  if(errorMsg === "") {
    body = <div>
      <p>Public key: {keypair?.publicKey.toString()}</p>
      <p>Secret key: {keypair !== undefined ? b58encode(keypair.secretKey): ""}</p>
    </div>;
  } else {
    body = <div>
      <p>{errorMsg}</p>
    </div>;
  }


  return (
    <div className={styles.container}>
      <main className={styles.main}>
      {body}
      </main>

      <footer className={styles.footer}>
        Copyright 2021
        <a
          href="https://solana.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.box}>
            Powered by{' '}
            <Image src="/solana.png" alt="Solana Logo" width={98} height={40} />
          </div>
        </a>
      </footer>
    </div>
  )
}
