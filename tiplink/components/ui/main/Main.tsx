import { useLink } from '../../useLink';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import LinkExportPanel from './LinkExportPanel';
import LinkCard from './LinkCard';
import ActionsPanel from "../actions/ActionsPanel";
import { useState, useEffect } from "react";


const Main = () => {
  // const explorerLink = 'https://explorer.solana.com/address/' + linkKeypair.publicKey.toString() + '?cluster=' + endpoint;
  const { balanceUSD, scheduleBalanceUpdate } = useLink();
  const [ url, setUrl ] = useState<string>("");

  useEffect(() => {
    setUrl(window.location.href);
    scheduleBalanceUpdate(100);
    scheduleBalanceUpdate(1000);
  }, []);

  const topText = isNaN(balanceUSD) ? 'Loading balance...' : 'This is ' + balanceUSD.toFixed(2) + ' in crypto.';

  return(
    <div>
      <div className='container'>
        <main className='main'>
          <Grid
            container
            direction='column'
            alignItems='center'>
              <Box 
                width='100%'
                textAlign='center'>
                <Typography component='div' variant='h5'>{topText}</Typography>
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
