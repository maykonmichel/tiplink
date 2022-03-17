import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import styles from '../../../styles/Header.module.css';
import Typography from '@mui/material/Typography';
require('@solana/wallet-adapter-react-ui/styles.css');
import {
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

type HeaderProps = {
    showWalletButton?: boolean;
}

const Logo = () => {
  return(
    <div  className={styles.logoContainer}> 
      <div style={{display: "flex", flexDirection: "row"}}>
        <a href='/' rel="noopener noreferrer">
          <img  src='/tiplink-logo.png' width='200px'/>
        </a>
      <Typography>BETA</Typography>
      </div>
    </div>
  );
}

const WalletButton = ({showWalletButton}: HeaderProps) => {
  return(
    <Box className={styles.walletContainer}>
        {showWalletButton && <WalletMultiButton/>}
    </Box>
  );
}

const Header = ({showWalletButton=true}: HeaderProps) => {
  return(
      <AppBar color='transparent' position='relative' className='appbar' elevation={0} sx={{padding: '1rem'}}>
        <Toolbar className={styles.toolbar}>
            <Logo/>
            <WalletButton showWalletButton={showWalletButton}/>
        </Toolbar>
      </AppBar>
  );
}

export default Header;