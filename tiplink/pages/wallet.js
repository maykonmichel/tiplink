
import styles from '../styles/Home.module.css'
import  { Keypair} from '@solana/web3.js';
import { encode as b58encode, decode as b58decode } from 'bs58';
import { useEffect, useState } from "react";
import Footer  from "../components/footer";

function Form(keypair) {
  const sendMoney = event => {
    event.preventDefault() // don't redirect the page
    // where we'll add our form logic
  }

  return (
    <form onSubmit={sendMoney}>
      <label htmlFor="address">Address</label>
      <input id="address" type="text" autoComplete="address" required />
      <label htmlFor="amount">Amount</label>
      <input id="amount" type="text" autoComplete="amount" required />
      <button type="submit">Send</button>
    </form>
  )
}

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

  // TODO remove this guy
  if(keypair !== undefined) {
    console.log("pubkey: ", keypair.publicKey.toString());
    console.log("secretKey: ",  b58encode(keypair.secretKey));
  }

  let body = undefined;
  if(errorMsg === "") {
    // let conn = new Connection("https://api.devnet.solana.com");
    let balance = 0.;
    // conn.getBalance(keypair?.publicKey).then(result => {balance = result;});
    console.log("keypair", keypair);
    
    body = <div>
      <p>Public key: {keypair?.publicKey.toString()}</p>
      <p>Secret key: {keypair !== undefined ? b58encode(keypair.secretKey): ""}</p>
      <p>Balance: {balance}</p>
      <Form keypair={keypair}/>
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
      <Footer/>
    </div>
  )
}
