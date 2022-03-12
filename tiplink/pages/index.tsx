import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Router from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import { useState, MouseEvent } from "react";
import { createLink } from "../lib/link";
import WalletAppBar from '../components/WalletAppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CurrencyInput, {fiatQuickInputDefault, cryptoQuickInputDefault} from '../components/ui/common/CurrencyInput';

const createWalletShort = async () => { 
  const {slug, anchor} = await createLink();
  Router.push("/" + slug + "#" + anchor);
}

export default function Home() {
  const [ loading, setLoading ] = useState(false);
  const [inputAmountSOL, setInputAmountSOL ] = useState<number>(NaN);

  const onClickShort = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoading(true);
    createWalletShort();
  }

  return (
    <div>
      <Head>
        <title>Tip Link</title>
        <meta name="description" content="Send tip links with crypto" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WalletAppBar/>
      <div className={styles.container}>


        <main className={styles.main}>
          <Typography variant="h3">Links are the new money</Typography>
          <Typography>Send crypto to anyone, even if they don't have a wallet - no app needed!</Typography>

          <Box sx={{
            m: 2,
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center"
          }}>
            <Typography sx={{m: 2}}>Try it now! How much do you want to send?</Typography>
            <CurrencyInput 
              fiatCurrency='USD' cryptoCurrency='SOL' onValueChange={setInputAmountSOL} 
              fiatQuickInputOptions={fiatQuickInputDefault}
              cryptoQuickInputOptions={cryptoQuickInputDefault}
            />
            <Button sx={{m: 2}} variant="contained">Create TipLink</Button>
            <Typography>
              Want to deposit value later? <a onClick={onClickShort}>Create an empty TipLink.</a>
            </Typography>
            <CircularProgress style={{display: loading ? "block": "none"}}/>
          </Box>
        </main>
        {/* <Footer/> */}

      </div>
    </div>
  )
}
