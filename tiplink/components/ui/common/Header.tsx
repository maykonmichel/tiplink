import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import styles from '../../../styles/Home.module.css';
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
        <Toolbar>
            <Box component='div' sx={{ display: "flex", flexGrow: 1, flexDirection: "row" }}> 
                <a href='/' rel="noopener noreferrer">
                    <img className={styles.tiplinkLogo} src='/tiplink-logo.png' width='200px'/>
                </a>
                <Typography className={styles.tiplinkBeta}>BETA</Typography>
            </Box>
            <Box sx={{display: 'flex', gap: '1rem'}}>
                {showWalletButton && <WalletMultiButton/>}
            </Box>
        </Toolbar>
      </AppBar>
  );
}

export default Header;