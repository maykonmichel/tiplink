import styles from '../../styles/Home.module.css'
import Footer  from "../footer";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
const QRCode = require("qrcode.react");
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useLink } from '../useLink';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');
import WithdrawForm  from "./WithdrawForm";
import AddMoneyPhantom from "./AddMoneyPhantom";
import WithdrawToPhantom from "./WithdrawToPhantom";
import CreateLinkForm from "./CreateLinkForm";
import CopyLink from "./CopyLink";
import LinkCard from "./LinkCard";

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
  // const explorerLink = "https://explorer.solana.com/address/" + linkKeypair.publicKey.toString() + "?cluster=" + endpoint;
  const { linkKeypair, getBalanceUSD } = useLink();
  const balanceUSD = getBalanceUSD();
  return(
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" className="appbar" style={{ background: '#ffffff' }} elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>

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
          <Typography component="div" variant="h5">This is ${balanceUSD.toFixed(2)} in crypto.</Typography>
          <Typography component="div">The link to this page contains this value, make sure you don't lose it!</Typography>

          <CopyLink/>
          {/* <LinkCard/> */}
          <Typography component="div">Public Key: {linkKeypair.publicKey.toBase58()}</Typography>
          <WithdrawForm/>
          <br></br>
          <AddMoneyPhantom/>
          <br></br>
          <WithdrawToPhantom/>
          <CreateLinkForm/>
          <br></br>
          {/* {endpoint === "devnet" && 
            <AirdropForm />
          } */}
  
        </Grid> 


        </main>
        <Footer/>
      </div>
    </ThemeProvider>

  );

}

export default UI;