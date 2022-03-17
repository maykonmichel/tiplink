import styles from '../styles/FrontPage.module.css';
import Router from "next/router";
import { Typography } from '@mui/material';
import { useState, MouseEvent } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import CurrencyInput, {fiatQuickInputDefault, cryptoQuickInputDefault} from './ui/common/CurrencyInput';
import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { randBuf, DEFAULT_TIPLINK_KEYLENGTH, SEED_LENGTH, kdfz } from '../lib/crypto';
import { encode as b58encode, decode as b58decode } from 'bs58';

const createWalletShort = async () => { 
  randBuf(DEFAULT_TIPLINK_KEYLENGTH).then((b) => Router.push("#" + b58encode(b)));
}

export default function FrontPage() {
  const [ loading, setLoading ] = useState(false);
  const [inputAmountSOL, setInputAmountSOL ] = useState<number>(NaN);
  const { connected,  publicKey, sendTransaction  } = useWallet();
  const { connection } = useConnection();

  const onClickEmptyTipLink = (e: MouseEvent<HTMLElement>) => {
    if(loading) {
      return;
    }
    e.preventDefault();
    setLoading(true);
    createWalletShort();
  }

  const onClickCreateTipLink = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if(!connected) {
      alert("Please connect a solana wallet to load value onto a TipLink. Alternatively, create an empty link first.");
      return;
    }

    if(publicKey === null) {
      alert("Wallet appears connected, but couldn't get publicKey.");
      return;
    }

    setLoading(true);

    randBuf(DEFAULT_TIPLINK_KEYLENGTH).then((b) => {
      kdfz(SEED_LENGTH, b).then((seed: Buffer) => {
        const kp = Keypair.fromSeed(seed);
        const transaction = new Transaction().add(SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: kp.publicKey,
          lamports: inputAmountSOL * LAMPORTS_PER_SOL
        }));
        sendTransaction(transaction, connection).then((signature) => {
          connection.confirmTransaction(signature, 'processed').then((responseAndContext) => {
            const result = responseAndContext.value;
            const err = result.err;
            if(err === null) {
              Router.push("/#" + b58encode(b));
            } else {
              alert("Got error on transaction: " + err);
              console.error(err);
            }
          }).catch(e => alert("Error confirming transaction: " + e.message));
        });
      }).catch(e => alert("Error sending transaction: " + e.message));
    });
  }

  return (
    <div>
      <div className='container'>
        <main className='main'>
          <Box className={styles.tagLine}>
            <Typography variant="h4">Links are now money</Typography>
            <Typography>Send crypto to anyone, even if they don't have a wallet.</Typography>
            <Typography>No app needed!</Typography>
          </Box>

          <Box className={styles.frontBox} sx={{ m: 2, }}>
            <Typography sx={{m: 2}}>Try it now! How much do you want to send?</Typography>
            <CurrencyInput 
              fiatCurrency='USD' cryptoCurrency='SOL' 
              fiatQuickInputOptions={fiatQuickInputDefault}
              cryptoQuickInputOptions={cryptoQuickInputDefault}
              onValueChange={setInputAmountSOL} 
            />
            <LoadingButton sx={{m: 2}} variant="contained" onClick={onClickCreateTipLink} loading={loading}>Create TipLink</LoadingButton>
            <Typography>
              Want to deposit value later? <a onClick={onClickEmptyTipLink}>Create an empty TipLink.</a>
            </Typography>
          </Box>

          <Box className={styles.frontDesc}>
            <Typography variant='h5' className={styles.howTitle}><u>How it works</u></Typography>
            <dl>
              <dt>Create a Tiplink.</dt>
              <dd>It’s like buying a gift card, create a TipLink by depositing how much you want to send.</dd>
              <dt>Share a Tiplink.</dt>
              <dd>Copy the TipLink URL and send it to anyone, or show them the QR code.</dd>
              <dt>That's it.</dt>
              <dd>You just sent someone crypto and they can send or use it even if they don’t have a wallet.*</dd>
            </dl>
            <Typography className={styles.ps}>*Psst, the TipLink is the wallet!</Typography>
          </Box>
        </main>
        {/* <Footer/> */}

      </div>
    </div>
  )
}
