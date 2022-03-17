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
const Header = ({showWalletButton=true}: HeaderProps) => {
  return(
      <AppBar color='transparent' position='relative' className='appbar' elevation={0} sx={{padding: '1rem'}}>
        <div className={styles.mobileLogoBar}>
            <div  className={styles.mobileLogoContainer}> 
                <div style={{display: "flex", flexDirection: "row"}}>
                    <a href='/' rel="noopener noreferrer">
                        <img  src='/tiplink-logo.png' width='200px'/>
                    </a>
                    <Typography>BETA</Typography>
                </div>
            </div>
            <Box sx={{display: 'flex', gap: '1rem', justifyContent: 'space-around'}}>
                {showWalletButton && <WalletMultiButton/>}
            </Box>
        </div>
        <Toolbar className={styles.toolbar}>
            <Box component='div' sx={{ display: "flex", flexGrow: 1, flexDirection: "row" }}> 
                <a href='/' rel="noopener noreferrer">
                    <img  src='/tiplink-logo.png' width='200px'/>
                </a>
                <Typography>BETA</Typography>
            </Box>
            <Box sx={{display: 'flex', gap: '1rem'}}>
                {showWalletButton && <WalletMultiButton/>}
            </Box>
        </Toolbar>
      </AppBar>
  );
}

export default Header;