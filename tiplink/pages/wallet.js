
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

import AppBar from '@mui/material/AppBar';
import FormControl from '@mui/material/FormControl';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const rawToHuman = (amount) => amount / LAMPORTS_PER_SOL;
const humanToRaw = (amount) => amount * LAMPORTS_PER_SOL;

function Balance({ publicKey, conn }) {
    const [ balance, setBalance ] = useState(NaN);
    if(publicKey !== undefined) {
      conn.getBalance(publicKey, "processed").then( (b) => {
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
      <Button variant="outlined" type="submit" onClick={requestDrop}>Request Airdrop</Button>
  )
}

function Form({ fromWallet, conn }) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleClose = () => {
    setOpen(false);
  }

  const sendMoney = async event => {
    //get the token account of the toWallet Solana address, if it does not exist, create it
    handleClose();
    const sPubKey = address;
    // this is apparently a human-readable SOL amount? 
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
  

  const handleOpen = () => {
    setOpen(true);
  }

  const handleAddressChange = (e) => { 
    setAddress(e.target.value);
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>Send</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
        Send
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
        <DialogContentText>Please enter a valid Solana address to withrdaw funds. Please be careful, there isn't any validation.</DialogContentText>
        <form action="/" method="POST" onSubmit={(e) => { e.preventDefault(); handleClose(); } } style={{padding: "10px"}}>
          <TextField label="SOL Address" value={address} onChange={handleAddressChange} id="destPubKey" type="text" autoComplete="address" required  fullWidth variant="standard"/>
          <TextField label="Amount" value={amount} onChange={handleAmountChange} id="amount" type="numeric" autoComplete="amount" required  fullWidth variant="standard"/>
          <Button type="submit" onClick={sendMoney}>Send</Button>
        </form>
      </Dialog>
    </div>
  )
}

function PhantomWidget({ provider, connected }) {
  // console.log("provider: ", provider);
  const connectPhantom = (e) => {
    if((provider !== undefined) && provider.isPhantom){
      console.log(provider);
      provider.connect();
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  };

  const disconnectPhantom = (e) => {
    provider.disconnect();
  };

  if(!connected) {
    return(
        <Button color="secondary" variant="outlined" onClick={connectPhantom}>Connect Phantom</Button>
    );
  } else {
    return (
      <div>
        <Button color="secondary" variant = "outlined" onClick={disconnectPhantom}>Disconnect Phantom</Button>
      </div>
    );
  }
}



export default function Wallet() {
  const [keypair, setKeypair] = useState(undefined);
  const [errorMsg, setErrorMsg] = useState("");
  const defaultEndpoint = "mainnet-beta";
  const endpointKey = "tiplink-endpoint";
  const [endpoint, setEndpoint] = useState(defaultEndpoint);
  const endpointUrl = clusterApiUrl(endpoint);
  const conn = new Connection(endpointUrl);

  const [provider, setProvider] = useState(undefined);
  const [connected, setConnected] = useState(undefined);
  const onPhantomConnection = () => {
    // console.log("onPhantomConnection");
    setConnected(true);
  };
  const onPhantomDisconnection = () => {
    setConnected(false);
  }

  useEffect(() => {
    if("solana" in window) {
      setProvider(window.solana);
      window.solana.on("connect", onPhantomConnection);
      window.solana.on("disconnect", onPhantomDisconnection);
      setConnected(window.solana.isConnected);
      // TODO eager connection doesn't work, as if the user disconnects and refreshes the page, it auto-reconnects
      // window.solana.connect({ onlyIfTrusted: true});
    }
    // document.removeEventListener("contextmenu");
  }, [provider, connected]);

  const handleEndpointChange = (event) => { 
    setEndpoint(event.target.value);
    localStorage.setItem(endpointKey, event.target.value);
  };

  // TODO this makes the URL really long and unsightly
  // TODO better error message handling
  useEffect(() => {
    setEndpoint(localStorage.getItem(endpointKey, defaultEndpoint));
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
  }, [endpoint]);

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
      <Typography>Public key: {keypair?.publicKey.toString()}</Typography>
      <Balance publicKey={keypair?.publicKey} conn={conn}/>
      {/* <Typography>Secret key: {keypair !== undefined ? b58encode(keypair.secretKey): ""}</Typography> */}
      {/* <Typography>Endpoint URL: {endpointUrl}</Typography> */}

      <br></br>
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
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" className="appbar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tiplink
          </Typography>

          <Select  variant="outlined" style={{marginRight: "10px", color: "white" }} color="secondary" labelId="endpoint-label" id="endpoint_dropdown" name="endpoint" value={endpoint} onChange={handleEndpointChange}>
            <MenuItem value="devnet">devnet</MenuItem>
            <MenuItem value="testnet">testnet</MenuItem>
            <MenuItem value="mainnet-beta">mainnet-beta</MenuItem>
          </Select>
          <PhantomWidget provider={provider} connected={connected}/>
        </Toolbar>
      </AppBar>
      <div className={styles.container}>
        <main className={styles.main}>
        {body}
        </main>
        <Footer/>
      </div>
    </ThemeProvider>
  )
}
