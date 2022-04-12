import { useLink } from '../../useLink';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Router from "next/router";
import Typography from '@mui/material/Typography';

import LinkExportPanel from './LinkExportPanel';
import LinkCard from './LinkCard';
import ActionsPanel from "../actions/ActionsPanel";
import { useState, useEffect } from "react";
import Progress from '../common/Progress';
import { removeURLParameter } from '../../../lib/link';
import DebugDisplay from '../common/DebugDisplay';
import { useWaitForTxn } from '../../useWaitForTxn';
import { sendAndConfirmWithRetry } from '../../../lib/transaction';
import { useConnection } from '@solana/wallet-adapter-react';

const Main = () => {
  const { balanceUSD, scheduleBalanceUpdate } = useLink();
  const { connection } = useConnection();
  const [ url, setUrl ] = useState<string>("");
  const [ loading, setLoading ] = useState<boolean>(false);
  const { pendingTxn, setPendingTxn } = useWaitForTxn();

  useEffect(() => {
    setUrl(window.location.href);
    scheduleBalanceUpdate(100);
    scheduleBalanceUpdate(1000);
    setLoading(window.location.href.includes('loading=true') || (pendingTxn !== null));
  }, []);

  /*
  when you create a tiplink from a tiplink, we open the newly created link in a new tab
  even when the transaction potentially hasn't gone through yet
  we put a loading indicator on via the URL, so that the UI can let the user know it's not ready yet
  Whenever the balance updates, it's safe to assume the loading is done.
  */
  useEffect(() => {
    // console.log("useEffect remove loading balanceUSD=");
    if(
      !isNaN(balanceUSD) &&
      (balanceUSD > 0) && 
      (window !== undefined) && 
      (window.location.href.includes('loading=true')) && 
      loading
    ) {
      window.location.href = removeURLParameter(window.location.href, 'loading');
      setLoading(false);
    }
  }, [balanceUSD])

  /*
  when you create a tiplink with a balance from the front page, 
  you don't actually confirm the transaction until this point
  */
  useEffect(() => {
    if(pendingTxn !== null) {
      let txn = Buffer.alloc(pendingTxn.length);
      pendingTxn.copy(txn);
      setPendingTxn(null);
      sendAndConfirmWithRetry(
          connection,
          txn,
          {skipPreflight: true},
          'confirmed'
      ).then(() => {
        setLoading(false);
        scheduleBalanceUpdate(100);
      }).catch(e => {
        alert(e.message);
        Router.push('/');
      });
    }
  }, [])

  const getTopText = () => {
    if(loading) {
      return("Creating new TipLink...");
    }
    if(isNaN(balanceUSD)) {
      return('Loading balance...');
    }
    return('This is ' + balanceUSD.toFixed(2) + ' in crypto.');
  }

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
                <Typography component='div' variant='h5'>{getTopText()}</Typography>
                {!loading && <Typography component='div'>The link to this page contains this value, make sure you don't lose it!</Typography>}
                <LinkExportPanel url={removeURLParameter(url, 'loading')}/>
              </Box>
              <DebugDisplay/>

              {loading && <Progress/>}

              {!loading && <Box
                width='100%'
                marginTop='2rem'
                marginBottom='1.5rem'>
                <LinkCard/>
              </Box>}
              {!loading && <ActionsPanel/>}

          </Grid>
        </main>
      </div>
    </div>
  );
}

export default Main;
