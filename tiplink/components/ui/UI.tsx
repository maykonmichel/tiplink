import { useLink } from '../useLink';

import styles from '../../styles/Home.module.css'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Footer  from '../footer';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider } from '@mui/material/styles';

require('@solana/wallet-adapter-react-ui/styles.css');
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
const QRCode = require('qrcode.react');

import WithdrawForm  from './WithdrawForm';
import AddMoneyPhantom from './AddMoneyPhantom';
import WithdrawToPhantom from './WithdrawToPhantom';
import CreateLinkForm from './CreateLinkForm';

import LinkExportPanel from './LinkExportPanel';
import LinkCard from './LinkCard';
import OptionRow from './OptionRow';
import DualCtaRow from './DualCtaRow';

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
      <AppBar position='sticky' className='appbar' elevation={0}>
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
            maxWidth='32rem'
            direction='column'
            alignItems='center'>
              <Box 
                width='100%'
                marginTop='4rem'
                textAlign='center'>
                <Typography component='div' variant='h5'>This is ${balanceUSD.toFixed(2)} in crypto.</Typography>
                <Typography component='div'>The link to this page contains this value, make sure you don't lose it!</Typography>
                <LinkExportPanel/>
              </Box>

              <Box
                width='100%'
                marginTop='2rem'
                marginBottom='1.5rem'>
                <LinkCard/>
              </Box>

              <Box width='100%'>
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
              </Box>

              {/* {endpoint === 'devnet' && 
                <AirdropForm />
              } */}

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
