import styles from '../styles/Home.module.css'
import  { Keypair, Cluster, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { useEffect, useState, MouseEvent, useMemo } from "react";
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
import { ConnectionProvider, WalletProvider, useConnection } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import  Balance from './balance';
import { useLink, LinkContext } from './useLink';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

import { createLink } from "../lib/link";
import { LinkProvider } from "./LinkContextProvider";
import { useEndpoint } from "./useEndpoint";
import { EndpointProvider } from "./EndpointProvider";

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

const AirdropForm = () => {
  const { airdrop } = useLink();
  const requestDrop = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // you get errors if you request more than 1 SOL sometimes
    const amt = 1;
    return await airdrop(amt);
  }
  return (
      <Button variant="outlined" type="submit" onClick={requestDrop}>Request Airdrop</Button>
  )
}

const UpdateBalanceButton = () => {
  const { updateBalance } = useLink();
  return (
      <Button variant="outlined" type="submit" onClick={updateBalance}>Update Balance</Button>
  )

}


function WithdrawForm() {
  const { sendSOL } = useLink();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const sendMoney = async (event: MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    event.preventDefault();
    await sendSOL(new PublicKey(address), parseFloat(amount));
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


const AddMoneyPhantom = () => {
  const { deposit, extConnected } = useLink();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleClose = () => {
    setOpen(false);
  }

  const sendMoney = async (event: MouseEvent<HTMLButtonElement>) => {
    //get the token account of the toWallet Solana address, if it does not exist, create it
    handleClose();
    event.preventDefault()
    await deposit(parseFloat(amount));
  }
  

  const handleOpen = () => { 
    if(!extConnected) {
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

const WithdrawToPhantom = () => {
  const { linkKeypair, sendSOL, getFees, getBalanceSOL, extConnected, extPublicKey } = useLink();
  const sendMoney = async (event: MouseEvent<HTMLButtonElement> )=> {
    event.preventDefault()
    if(!extConnected) { 
        alert("Please connect Phantom to withdraw money");
        return;
    } 

    if((extPublicKey === null) || (extPublicKey === undefined)){
        alert("Please connect Phantom to withdraw money");
        return;
    }
    const fees = await getFees();
    const balance = await getBalanceSOL();
    await sendSOL(extPublicKey, balance - fees);
  }


  return (
    <div>
      <Button variant="outlined" onClick={sendMoney}>Withdraw to Phantom</Button>
    </div>
  )
}

const CreateLinkForm = () => {
  // TODO check-list to use pre-existing balance
  const { linkKeypair, sendSOL, getFees, getBalanceSOL } = useLink();
  const [ amount, setAmount ] = useState("");
  const [ newLink, setNewLink ] = useState("");

  const createNewTipLink = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const fees = await getFees();
    const balance = await getBalanceSOL();
    const amt = parseFloat(amount) + fees;
    if(amt > balance) {
      alert("Cannot withdraw " + amt + ", please add more funds to tiplink");
    }

    const { slug, anchor, keypair } = await createLink();
    const newLink = window.location.origin + "/" + slug + "#" + anchor;
    setNewLink(newLink);

    await sendSOL(keypair.publicKey, amt);
  }

  // should this store this history of whatever links we've created in the past?
  return(
    <div>
      <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} id="newLinkAmt" type="numeric" autoComplete="amount" required  fullWidth variant="standard"/>
      <Button variant="outlined" onClick={createNewTipLink}>Create Link</Button>
      <TextField label="New Link" value={newLink} fullWidth variant="standard"/>
    </div>
  );
}

const UI = () => {
  const defaultDisplayMode = "basic";
  const displayKey = "tiplink-display";
  const [ displayMode, setDisplayMode ] = useState<string>("basic");
  const { linkKeypair } = useLink();
  const { endpoint, setEndpointStr} = useEndpoint();
  const explorerLink = "https://explorer.solana.com/address/" + linkKeypair.publicKey.toString() + "?cluster=" + endpoint;

  // TODO better error message handling
  useEffect(() => {
    const localAdvanced = localStorage.getItem(displayKey);
    if(localAdvanced === "advanced" || localAdvanced === "basic") {
      setDisplayMode(localAdvanced);
    } else {
      localStorage.setItem(displayKey, defaultDisplayMode);
      setDisplayMode(defaultDisplayMode);
    }
  }, []);

  const handleModeChange = (event: SelectChangeEvent<string>) => {
    const v = event.target.value;
    if(v === "advanced" || v === "basic") {
      setDisplayMode(v);
      localStorage.setItem(displayKey, v);
    }
  }

  const handleEndpointChange = (event: SelectChangeEvent<Cluster>) => { 
    setEndpointStr(event.target.value);
  };

  return(
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" className="appbar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tiplink
          </Typography>

          <Select  variant="outlined" style={{marginRight: "10px", color: "white" }} color="secondary" labelId="mode-label" 
          id="mode_dropdown" name="mode" value={displayMode} onChange={handleModeChange}>
            <MenuItem value={"basic"}>basic</MenuItem>
            <MenuItem value={"advanced"}>advanced</MenuItem>
          </Select>

          {displayMode === "advanced" && 
          <Select  variant="outlined" style={{marginRight: "10px", color: "white" }} color="secondary" labelId="endpoint-label" 
          id="endpoint_dropdown" name="endpoint" value={endpoint} onChange={handleEndpointChange}>
            <MenuItem value="devnet">devnet</MenuItem>
            <MenuItem value="testnet">testnet</MenuItem>
            <MenuItem value="mainnet-beta">mainnet-beta</MenuItem>
          </Select>
          }
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
          {/* {(displayMode === "advanced") && (url !== "") && 
            <figure>
              <QRCode value={url} id="walletQr"/>
              <figcaption style={{textAlign: "center"}}>Tiplink QR</figcaption>
            </figure>
          } */}
          {displayMode === "advanced" && 
            <Typography>Public key: {linkKeypair.publicKey.toString()}</Typography>
          }
          <Balance />
          {displayMode === "advanced" && 
          <Link href={explorerLink} target="_blank">Explorer</Link>
          }
          <br></br>
          <br></br>
          {/* <Typography>Secret key: {keypair !== undefined ? b58encode(keypair.secretKey): ""}</Typography> */}
          {/* <Typography>Endpoint URL: {endpointUrl}</Typography> */}

          <WithdrawForm/>
          <br></br>
          <AddMoneyPhantom/>
          <br></br>
          <WithdrawToPhantom/>
          <CreateLinkForm/>
          <br></br>
          {endpoint === "devnet" && 
            <AirdropForm />
          }
          <UpdateBalanceButton/>
  
        </Grid> 


        </main>
        <Footer/>
      </div>
    </ThemeProvider>

  );

}

const UIWrapper = (props: {secretKey: Uint8Array}) => {
  const { endpoint } = useEndpoint();
  const endpointUrl = clusterApiUrl(endpoint);
  console.log(endpointUrl);
  const linkKeypair = Keypair.fromSecretKey(props.secretKey);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()], [endpointUrl]
  );
  return (
    <ConnectionProvider endpoint={endpointUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <LinkProvider linkKeypair={linkKeypair} endpointUrl={endpointUrl}>
            <UI/>
          </LinkProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}


const Wallet = (props: {secretKey: Uint8Array}) => {
  const [url, setUrl] = useState("");
  
  useEffect(() => {
    setUrl(window.location.href);
  });

  return (
    <EndpointProvider>
      <UIWrapper secretKey={props.secretKey}/>
    </EndpointProvider>
  );
}


export default Wallet;