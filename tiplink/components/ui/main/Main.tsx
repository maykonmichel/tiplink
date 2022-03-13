import { useLink } from '../../useLink';

import styles from '../../../styles/Home.module.css'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import LinkExportPanel from './LinkExportPanel';
import LinkCard from './LinkCard';
import ActionsPanel from "../actions/ActionsPanel";
import { useState, useEffect } from "react";
import WalletAppBar from '../../WalletAppBar';
import Paper from '@mui/material/Paper';
import CardBackground from '../../../public/tiplink-card.png';


const Main = () => {
  // const explorerLink = 'https://explorer.solana.com/address/' + linkKeypair.publicKey.toString() + '?cluster=' + endpoint;
  const { balanceUSD } = useLink();
  const [ url, setUrl ] = useState<string>("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return(
    <div>
      <WalletAppBar/>
      <div className={styles.container}>
        <main className={styles.main}>
          <Grid
            container
            direction='column'
            alignItems='center'>
              <Box 
                width='100%'
                marginTop='4rem'
                textAlign='center'>
                <Typography component='div' variant='h5'>This is ${balanceUSD.toFixed(2)} in crypto.</Typography>
                <Typography component='div'>The link to this page contains this value, make sure you don't lose it!</Typography>
                <LinkExportPanel url={url}/>
              </Box>

              <Box
                width='100%'
                marginTop='2rem'
                marginBottom='1.5rem'>
                <LinkCard/>
              </Box>
              <ActionsPanel/>

              {/* {endpoint === 'devnet' && 
                <AirdropForm />
              } */}

              {/* <Typography marginTop='8rem' component='div' textAlign='center'>[BELOW IS PLAYGROUND]</Typography> */}
          </Grid>
        </main>
        {/* <Footer/> */}
      </div>
    </div>
  );
}

export default Main;
