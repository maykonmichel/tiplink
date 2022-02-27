import styles from '../../styles/Home.module.css'
import  { Cluster } from '@solana/web3.js';
import { useEffect, useState, MouseEvent } from "react";
import { SelectChangeEvent } from "@mui/material"
import Footer  from "../footer";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Link from '@mui/material/Link';
const QRCode = require("qrcode.react");
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import  Balance from './balance';
import { useLink } from '../useLink';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');
import { useEndpoint } from "../useEndpoint";
import { AirdropForm } from './AirdropForm';
import WithdrawForm  from "./WithdrawForm";
import AddMoneyPhantom from "./AddMoneyPhantom";
import WithdrawToPhantom from "./WithdrawToPhantom";
import CreateLinkForm from "./CreateLinkForm";

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
  
        </Grid> 


        </main>
        <Footer/>
      </div>
    </ThemeProvider>

  );

}

export default UI;