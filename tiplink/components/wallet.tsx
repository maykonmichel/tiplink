import styles from '../styles/Home.module.css'
import  { 
  Keypair,
  Cluster,
  PublicKey,
  Connection,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  SystemProgram,
  FeeCalculator,
} from '@solana/web3.js';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { useEffect, useState, MouseEvent, ChangeEvent, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material"
import Footer  from "./footer";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
const QRCode = require("qrcode.react");
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');


const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#000000',
      main: '#ffffff',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

const rawToHuman = (amount: number) => amount / LAMPORTS_PER_SOL;
const humanToRaw = (amount: number) => amount * LAMPORTS_PER_SOL;

const Balance = (prop: {publicKey: PublicKey }) => {
  const { connection } = useConnection();
  const publicKey = prop.publicKey;
  const [ balance, setBalance ] = useState(NaN);
  const [ price, setPrice ] = useState(NaN);

  useEffect(() => {
    getPrice().then((apiPrice) => setPrice(apiPrice));
  }, []);

  if(publicKey !== undefined) {
    connection.getBalance(publicKey, "processed").then( (b) => {
      setBalance(b);
    }).catch( (error) => {
      console.error(error);
    });
  }

  const solBalance = isNaN(balance) ? "Loading..." : rawToHuman(balance).toFixed(4) + " SOL";
  const usd = rawToHuman(balance) * price;
  const usdBalance  = isNaN(usd) ? "" : "$" + usd.toFixed(2);
  // console.log(balance);
  // it seems 1 SOL maps to 1e9 of whatever units getBalance returns
  // after fees, you have 0.000045 SOL in wallet when you withdraw, so want this to round to 0
  return (
    <div>
      <p>Balance (SOL): {solBalance}</p>
      <p>Balance (USD): {usdBalance}</p>
      <p>Exchange Rate: {price.toFixed(2)}</p>

    </div>
  );
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


const AirdropForm = (prop: {keypair: Keypair, endpoint: string}) => {
  const requestDrop = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // you get errors if you request more than 1 SOL sometimes
    const amt = 1;
    console.log("requesting airdrop of 1 SOL for ", prop.keypair.publicKey);
    let conn = new Connection(prop.endpoint);
    var fromAirdropSignature = await conn.requestAirdrop(
      prop.keypair.publicKey,
      humanToRaw(amt),
    );
    //wait for airdrop confirmation
    let res = await conn.confirmTransaction(fromAirdropSignature);
    console.log("airdropped", res);
  }
  return (
      <Button variant="outlined" type="submit" onClick={requestDrop}>Request Airdrop</Button>
  )
}

function Form(prop: {fromWallet: Keypair }) {
  const fromWallet = prop.fromWallet;
  const { connection } = useConnection();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const sendMoney = async (event: MouseEvent<HTMLButtonElement>) => {
    //get the token account of the toWallet Solana address, if it does not exist, create it
    setOpen(false);
    const sPubKey = address;
    // this is apparently a human-readable SOL amount? 
    const toPubKey = new PublicKey(sPubKey);
    event.preventDefault();

    // console.log("sendMoney ", amount, " SOL from ", fromWallet.publicKey.toBase58(), " to ", toPubKey.toBase58());

    const transaction = new Transaction().add(
     SystemProgram.transfer({
       fromPubkey: fromWallet.publicKey,
       toPubkey: toPubKey,
       lamports: humanToRaw(parseFloat(amount)),
     }),
    );

    // console.log("transaction", transaction);

    await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromWallet],
      {commitment: 'confirmed'},
    );
    // console.log('SIGNATURE', signature);
  }

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>Send</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
        Send
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
        <DialogContentText>Please enter a valid Solana address to withrdaw funds. Please be careful, there isn't any validation.</DialogContentText>
        <form action="/" method="POST" onSubmit={(e) => { e.preventDefault(); setOpen(false); } } style={{padding: "10px"}}>
          <TextField label="SOL Address" value={address} onChange={(e) => setAddress(e.target.value)} id="destPubKey" type="text" autoComplete="address" required  fullWidth variant="standard"/>
          <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} id="amount" type="numeric" autoComplete="amount" required  fullWidth variant="standard"/>
          <Button type="submit" onClick={sendMoney}>Send</Button>
        </form>
      </Dialog>
    </div>
  )
}


const AddMoneyPhantom = (prop: {linkWallet: Keypair }) => {
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();
  const linkWallet = prop.linkWallet;

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleClose = () => {
    setOpen(false);
  }

  const sendMoney = async (event: MouseEvent<HTMLButtonElement>) => {
    //get the token account of the toWallet Solana address, if it does not exist, create it
    handleClose();
    // this is apparently a human-readable SOL amount? 

    // console.log("sendMoney ", amount, " SOL from ", provider.publicKey.toBase58(), " to ", wallet.publicKey.toBase58());
    if((publicKey === undefined) || (publicKey === null)) {
      alert("Please connect phantom to add money");
      return;
    }

    event.preventDefault()

    const transaction = new Transaction().add(
     SystemProgram.transfer({
       fromPubkey: publicKey,
       toPubkey: linkWallet.publicKey,
       lamports: humanToRaw(parseFloat(amount)),
     }),
    );
    transaction.feePayer = publicKey;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    console.log("transaction", transaction);

    const signature = (await sendTransaction(transaction, connection));
    console.log('SIGNATURE', signature);
    await connection.confirmTransaction(signature);
  }
  

  const handleOpen = () => { 
    if(!connected) {
      alert("Please connect Phantom to deposit, or send SOL directly to public key.");
      return;
    }
    setOpen(true); 
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>Deposit from Phantom</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
        Deposit
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
        <DialogContentText>Enter an amount to add from Phantom wallet</DialogContentText>
        <form action="/" method="POST" onSubmit={(e) => { e.preventDefault(); handleClose(); } } style={{padding: "10px"}}>
          <TextField label="Amount" value={amount} onChange={e => setAmount(e.target.value)} id="amount" 
          type="numeric" autoComplete="amount" required  fullWidth variant="standard"/>
          <Button type="submit" onClick={sendMoney}>Deposit</Button>
        </form>
      </Dialog>
    </div>
  )
}

const WithdrawToPhantom = (prop: {linkWallet: Keypair }) => {
  const linkWallet = prop.linkWallet;
  const { connection } = useConnection();
  const { wallet, connected } = useWallet();

  const sendMoney = async (event: MouseEvent<HTMLButtonElement> )=> {
    event.preventDefault()

    if(!connected) { 
      alert("Please connect Phantom to withdraw money");
      return;
    } 

    const publicKey = wallet?.adapter?.publicKey;
    if((publicKey === null) || (publicKey === undefined)){
      alert("Please connect Phantom to withdraw money");
      return;
    }


    const balance = await connection.getBalance(linkWallet.publicKey, "processed");
    const recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    const maybeContext = (await connection.getFeeCalculatorForBlockhash(recentBlockhash));
    if(maybeContext === null) {
      alert("Could not get fee calculator");
      return;
    }
    const feeCalculator: FeeCalculator = maybeContext.value!;
    // console.log(feeCalculator);
    const feeMult = 10;
    const fees = feeCalculator.lamportsPerSignature * feeMult;
    // console.log(fees);
    const amount = balance - fees;

    // console.log(amount);
    // console.log("sendMoney ", amount, " SOL from ", wallet.publicKey.toBase58(), " to ", provider.publicKey().toBase58());

    const transaction = new Transaction().add(
     SystemProgram.transfer({
       fromPubkey: linkWallet.publicKey,
       toPubkey: publicKey,
       lamports: amount,
     }),
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [linkWallet],
      {commitment: 'confirmed'},
    );
    console.log('SIGNATURE', signature)
    alert("Withdrew " + rawToHuman(amount) + " SOL from " + linkWallet.publicKey.toBase58() + "to " + publicKey.toBase58() );
  }


  return (
    <div>
      <Button variant="outlined" onClick={sendMoney}>Withdraw to Phantom</Button>
    </div>
  )
}



const Wallet = (props: {secretKey: Uint8Array}) => {
  const secretKey = props.secretKey;
  // console.log("Wallet secretKey", secretKey);
  const keypair = Keypair.fromSecretKey(secretKey);
  const endpointKey = "tiplink-endpoint";
  const devCluster: Cluster = "devnet";
  const testCluster: Cluster = "testnet";
  const mainCluster: Cluster = "mainnet-beta";
  const [endpoint, setEndpoint] = useState<Cluster>(mainCluster);
  const endpointUrl = clusterApiUrl(endpoint);
  const [url, setUrl] = useState("");
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()], [endpointUrl]
  );
  
  useEffect(() => {
    setUrl(window.location.href);
  });

  const setEndpointStr = (endpoint: string | null) => {
    if(endpoint === null) {
      return false;
    }

    if(endpoint === devCluster) {
      setEndpoint(devCluster);
      return  true;
    } else if(endpoint === testCluster) {
      setEndpoint(testCluster);
      return true;
    } else if(endpoint === mainCluster){
      setEndpoint(mainCluster);
      return true;
    } 
    return false;
  }

  const handleEndpointChange = (event: SelectChangeEvent<Cluster>) => { 
    setEndpointStr(event.target.value);
    localStorage.setItem(endpointKey, event.target.value);
  };

  // TODO this makes the URL really long and unsightly
  // TODO better error message handling
  useEffect(() => {
    const localEndpoint = localStorage.getItem(endpointKey);
    const success = setEndpointStr(localEndpoint);
    if(!success) {
      localStorage.setItem(endpointKey, mainCluster);
      setEndpoint(mainCluster);
    }
  }, [endpoint]);

  
  const explorerLink = "https://explorer.solana.com/address/" + keypair?.publicKey.toString() + "?cluster=" + endpoint;

  return (
    <ConnectionProvider endpoint={endpointUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ThemeProvider theme={theme}>
            <AppBar position="sticky" className="appbar">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Tiplink
                </Typography>

                <Select  variant="outlined" style={{marginRight: "10px", color: "white" }} color="secondary" labelId="endpoint-label" 
                id="endpoint_dropdown" name="endpoint" value={endpoint} onChange={handleEndpointChange}>
                  <MenuItem value={devCluster}>{devCluster}</MenuItem>
                  <MenuItem value={testCluster}>{testCluster}</MenuItem>
                  <MenuItem value={mainCluster}>{mainCluster}</MenuItem>
                </Select>
                <WalletMultiButton/>
                <WalletDisconnectButton/>
              </Toolbar>
            </AppBar>
            <div className={styles.container}>
              <main className={styles.main}>
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
              >
                {url !== "" && 
                  <figure>
                    <QRCode value={url} id="walletQr"/>
                    <figcaption style={{textAlign: "center"}}>Tiplink QR</figcaption>
                  </figure>
                }
                <Typography>Public key: {keypair.publicKey.toString()}</Typography>
                <Balance publicKey={keypair.publicKey} />
                <Link href={explorerLink} target="_blank">Explorer</Link>
                <br></br>
                <br></br>
                {/* <Typography>Secret key: {keypair !== undefined ? b58encode(keypair.secretKey): ""}</Typography> */}
                {/* <Typography>Endpoint URL: {endpointUrl}</Typography> */}

                <Form fromWallet={keypair} />
                <br></br>
                <AddMoneyPhantom linkWallet={keypair} />
                <br></br>
                <WithdrawToPhantom linkWallet={keypair} />
                <br></br>
                {endpoint === devCluster && 
                  <AirdropForm keypair={keypair} endpoint={endpointUrl} />
                }
        
              </Grid> 


              </main>
              <Footer/>
            </div>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default Wallet;