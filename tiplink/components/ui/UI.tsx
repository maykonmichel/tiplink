import { useLink } from '../useLink';

import styles from '../../styles/Home.module.css'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

require('@solana/wallet-adapter-react-ui/styles.css');
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import WithdrawForm  from './WithdrawForm';
import AddMoneyPhantom from './AddMoneyPhantom';
import WithdrawToPhantom from './WithdrawToPhantom';
import CreateLinkForm from './CreateLinkForm';

import LinkExportPanel from './LinkExportPanel';
import LinkCard from './LinkCard';
import ActionMenu from "./actions/ActionMenu";


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
  const { linkKeypair, balanceUSD } = useLink();
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
              <ActionMenu/>


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
        {/* <Footer/> */}
      </div>
    </ThemeProvider>
  );
}

export default UI;
