import styles from '../../styles/Home.module.css'
import Footer  from '../footer';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
const QRCode = require('qrcode.react');
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useLink } from '../useLink';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');
import WithdrawForm  from './WithdrawForm';
import AddMoneyPhantom from './AddMoneyPhantom';
import WithdrawToPhantom from './WithdrawToPhantom';
import CreateLinkForm from './CreateLinkForm';
import LinkExportPanel from './LinkExportPanel';

import OptionRow from './OptionRow';
import DualCtaRow from './DualCtaRow';

// Icons
import {
  Refresh as IconRecreate,
  MergeRounded as IconCombine,
  AccountBalanceWalletRounded as IconWallet
} from '@mui/icons-material';

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
  // const explorerLink = 'https://explorer.solana.com/address/' + linkKeypair.publicKey.toString() + '?cluster=' + endpoint;
  const { linkKeypair, getBalanceUSD } = useLink();
  const balanceUSD = getBalanceUSD();
  return(
    <ThemeProvider theme={theme}>
      <AppBar position='sticky' className='appbar' style={{ background: '#ffffff' }} elevation={0}>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}></Typography>

          <WalletMultiButton/>
          <WalletDisconnectButton/>
        </Toolbar>
      </AppBar>
      <div className={styles.container}>
        <main className={styles.main}>
        <Grid
          container
          maxWidth='36rem'
          spacing={0}
          direction='column'
          alignItems='center'
          style={{ minHeight: '100vh' }}
        >
          <Typography component='div' variant='h5'>This is ${balanceUSD.toFixed(2)} in crypto.</Typography>
          <Typography component='div'>The link to this page contains this value, make sure you don't lose it!</Typography>

          <LinkExportPanel/>

          <Box
            sx={{
              width: '100%',
              height: '16rem',
              textAlign: 'center',
              backgroundColor: '#dddddd',
            }}
            marginTop='2rem' 
            marginBottom='1.5rem' >
            (Card UI here)
          </Box>

          <div style={{maxWidth: '36rem'}}>
            <DualCtaRow
              cta1Label='Send'
              cta2Label='Deposit'
              cta1OnClick={() => {

              }}
              cta2OnClick={() => {

              }}/>
            <Divider/>
            <OptionRow
              icon={<IconRecreate/>}
              title='Recreate this TipLink'
              subtitle='Move the entire value to a new TipLink so only you have the link.'/>
            <Divider/>
            <OptionRow
              icon={<IconCombine/>}
              title='Combine with another TipLink'
              subtitle='You can combine some or all of another TipLink\’s value into this TipLink.'/>
            <Divider/>
            <OptionRow
              icon={<IconWallet/>}
              title='Deposit from your wallet'
              subtitle='Deposit Solana from your connected wallet.'/>
            <Divider/>
          </div>

          {/* {endpoint === 'devnet' && 
            <AirdropForm />
          } */}

           {/* <LinkCard/> */}
          <Typography marginTop='8rem' component='div' textAlign='center'>[CONTENT BELOW THIS IS TEMPORARY]<br/>Public Key: {linkKeypair.publicKey.toBase58()}</Typography>
          <WithdrawForm/>
          <br></br>
          <AddMoneyPhantom/>
          <br></br>
          <WithdrawToPhantom/>
          <CreateLinkForm/>
          <br></br>

        </Grid>
        </main>
        <Footer/>
      </div>
    </ThemeProvider>
  );
}

export default UI;
