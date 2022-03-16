import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import styles from '../styles/Home.module.css';
import Typography from '@mui/material/Typography';
require('@solana/wallet-adapter-react-ui/styles.css');
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

const WalletAppBar = () => {
  return(
      <AppBar color='transparent' position='relative' className='appbar' elevation={0} sx={{padding: '1rem'}}>
        <Toolbar>
          <Box component='div' sx={{ display: "flex", flexGrow: 1, flexDirection: "row" }}> 
            <img className={styles.tiplinkLogo} src='/tiplink-logo.png' width='200px'/>
            <Typography className={styles.tiplinkBeta}>BETA</Typography>
          </Box>
          <Box sx={{display: 'flex', gap: '1rem'}}>
            <WalletMultiButton/>
          </Box>
        </Toolbar>
      </AppBar>
  );
}

export default WalletAppBar;