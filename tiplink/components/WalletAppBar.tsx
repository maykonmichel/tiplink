import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
require('@solana/wallet-adapter-react-ui/styles.css');
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

const WalletAppBar = () => {
  return(
      <AppBar color="transparent" position="relative" className='appbar' elevation={0}>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}></Typography>
          <WalletMultiButton/>
          <WalletDisconnectButton/>
        </Toolbar>
      </AppBar>
  );
}

export default WalletAppBar;