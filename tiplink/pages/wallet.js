
import styles from '../styles/Home.module.css'
import  { 
  Keypair,
  PublicKey,
  Connection,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  SystemProgram
} from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { encode as b58encode, decode as b58decode } from 'bs58';
import { useEffect, useState } from "react";
import Footer  from "../components/footer";

const rawToHuman = (amount) => amount / LAMPORTS_PER_SOL;
const humanToRaw = (amount) => amount * LAMPORTS_PER_SOL;

function Balance({ publicKey, endpoint }) {
    const [ balance, setBalance ] = useState(NaN);
    let conn = new Connection(endpoint);
    if(publicKey !== undefined) {
      conn.getBalance(publicKey).then( (b) => {
        setBalance(b);
      }).catch( (error) => {
        console.error(error);
      });
    }
    // console.log(balance);
    // it seems 1 SOL maps to 1e9 of whatever units getBalance returns
    return (
      <p>Balance: {isNaN(balance) ? "Loading..." : rawToHuman(balance)}</p>
    );
}

function AirdropForm({ keypair, endpoint }) {
  const requestDrop = async event => {
    event.preventDefault();
    // you get errors if you request more than 1 SOL sometimes
    const amt = 1;
    console.log("requesting airdrop of 1 SOL for ", keypair.publicKey);
    let conn = new Connection(endpoint);
    var fromAirdropSignature = await conn.requestAirdrop(
      keypair.publicKey,
      humanToRaw(amt),
    );
    //wait for airdrop confirmation
    let res = await conn.confirmTransaction(fromAirdropSignature);
    console.log("airdropped", res);
  }
  return (
    <form onSubmit={requestDrop}>
      <button type="submit">Request Airdrop</button>
    </form>
  )
}

function Form({ fromWallet, conn }) {
  const sendMoney = async event => {
    //get the token account of the toWallet Solana address, if it does not exist, create it
    const sPubKey = event.target.destPubKey.value;
    // this is apparently a human-readable SOL amount? 
    const amount = parseFloat(event.target.amount.value);
    const toPubKey = new PublicKey(sPubKey);

    console.log("sendMoney ", amount, " SOL from ", fromWallet.publicKey.toBase58(), " to ", toPubKey.toBase58());
    event.preventDefault()

    const transaction = new Transaction().add(
     SystemProgram.transfer({
       fromPubkey: fromWallet.publicKey,
       toPubkey: toPubKey,
       lamports: humanToRaw(amount),
     }),
    );

    console.log("transaction", transaction);

    const signature = await sendAndConfirmTransaction(
      conn,
      transaction,
      [fromWallet],
      {commitment: 'confirmed'},
    );
    console.log('SIGNATURE', signature);
  }

  return (
    <form onSubmit={sendMoney}>
      <label htmlFor="address">Address: </label>
      <input id="destPubKey" type="text" autoComplete="address" required />
      <br></br>
      <label htmlFor="amount">Amount:   </label>
      <input id="amount" type="text" autoComplete="amount" required />
      <br></br>
      <button type="submit">Send</button>
    </form>
  )
}

export default function Wallet() {
  const [keypair, setKeypair] = useState(undefined);
  const [errorMsg, setErrorMsg] = useState("");
  const [endpoint, setEndpoint] = useState("devnet");
  const endpointUrl = clusterApiUrl(endpoint);
  const conn = new Connection(endpointUrl);

  const handleEndpointChange = (event) => { 
    setEndpoint(event.target.value);
  };

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
    // console.log("pubkey: ", keypair.publicKey.toString());
    // console.log("secretKey: ",  b58encode(keypair.secretKey));
    // console.log("b58: ", keypair?.publicKey.toBase58());
  }

  let body = undefined;
  if(errorMsg === "") {
    // console.log("keypair", keypair);
    
    body = <div>
      <p>Public key: {keypair?.publicKey.toString()}</p>
      <p>Secret key: {keypair !== undefined ? b58encode(keypair.secretKey): ""}</p>
      <label htmlFor="endpoint_dropdown">Endpoint: </label>
      <select id="endpoint_dropdown" name="endpoint" value={endpoint} onChange={handleEndpointChange}>
        <option value="devnet">devnet</option>
        <option value="testnet">testnet</option>
        <option value="mainnet-beta">mainnet-beta</option>
      </select>
      <p>Endpoint URL: {endpointUrl}</p>

      <Balance publicKey={keypair?.publicKey} endpoint={endpointUrl}/>
      <Form fromWallet={keypair} conn={conn}/>
      <br></br>
      {endpoint === "devnet" && 
        <AirdropForm keypair={keypair} endpoint={endpointUrl} />
      }
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
