
import styles from '../styles/Home.module.css'
import  { 
  Keypair,
  PublicKey,
  Connection,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl 
} from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { encode as b58encode, decode as b58decode } from 'bs58';
import { useEffect, useState } from "react";
import Footer  from "../components/footer";

const rawToHuman = (amount) => amount / LAMPORTS_PER_SOL;
const humanToRaw = (amount) => amount * LAMPORTS_PER_SOL;

function Balance({ publicKey, endpoint }) {
    const [ balance, setBalance ] = useState(0);
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
      <p>Balance: {rawToHuman(balance)}</p>
    );
}

function AirdropForm({ keypair, endpoint }) {
  const requestDrop = async event => {
    event.preventDefault();
    const amt = event.target.amount.value;
    // console.log("requesting airdrop of ", amt, "SOL for ", keypair.publicKey);
    let conn = new Connection(endpoint);
    var fromAirdropSignature = await conn.requestAirdrop(
      keypair.publicKey,
      humanToRaw(amt),
    );
    //wait for airdrop confirmation
    let res = await conn.confirmTransaction(fromAirdropSignature);
    // console.log(res);
  }
  return (
    <form onSubmit={requestDrop}>
      <label htmlFor="amount">Amount</label>
      <input id="amount" type="text" autoComplete="amount" required />
      <button type="submit">Request Airdrop</button>
    </form>
  )
}

function Form({ fromWallet, endpoint }) {
  const sendMoney = async event => {
    event.preventDefault()
    let conn = new Connection(endpoint);

    // console.log("publicKey: ", fromWallet.publicKey);
    //create new token mint
    // console.log("Creating mint");
    let mint = await Token.createMint(
      conn,
      fromWallet,
      fromWallet.publicKey,
      null,
      9,
      TOKEN_PROGRAM_ID,
    );

    //get the token account of the fromWallet Solana address, if it does not exist, create it
    let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
      fromWallet.publicKey,
    );

    //get the token account of the toWallet Solana address, if it does not exist, create it
    const toPubKey = new PublicKey(event.target.destPubKey.value);
    var toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
      toPubKey
    );

    // this is apparently a human-readable SOL amount? 
    const amount = parseFloat(event.target.amount.value);

    //minting 1 new token to the "fromTokenAccount" account we just returned/created
    await mint.mintTo(
      fromTokenAccount.address,
      fromWallet.publicKey,
      [],
      humanToRaw(amount),
    );

    // Add token transfer instructions to transaction
    var transaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        humanToRaw(amount),
      ),
    );

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
      <label htmlFor="address">Address</label>
      <input id="destPubKey" type="text" autoComplete="address" required />
      <br></br>
      <label htmlFor="amount">Amount</label>
      <input id="amount" type="text" autoComplete="amount" required />
      <button type="submit">Send</button>
    </form>
  )
}

export default function Wallet() {
  const [keypair, setKeypair] = useState(undefined);
  const [errorMsg, setErrorMsg] = useState("");
  const endpoint = "devnet"
  const endpointUrl = clusterApiUrl(endpoint);

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
      <p>Endpoint: {endpoint}</p>
      <p>Endpoint URL: {endpointUrl}</p>
      <Balance publicKey={keypair?.publicKey} endpoint={endpointUrl}/>
      <AirdropForm keypair={keypair} endpoint={endpointUrl} />
      <br></br>
      <Form fromWallet={keypair} endpoint={endpointUrl}/>
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
