import  { Keypair } from '@solana/web3.js';
import { useEffect } from 'react';
// Default styles that can be overridden by your app
import { LinkProvider } from "./LinkContextProvider";
import Main from "./ui/main/Main";
import { insertPublicKey } from '../lib/link';

interface WalletProps {
  secretKey: Uint8Array,
}

const Wallet = ({secretKey}: WalletProps) => {
  const linkKeypair = Keypair.fromSecretKey(secretKey);
  const key = "tiplink-" + linkKeypair.publicKey.toBase58() + '-inserted';

  const onInsert = (success: boolean) => {
    // TODO should we insert false so that we don't keep retrying if this doesn't work for w/e reason
    if(success) {
      localStorage.setItem(key, "true");
    } else {
      localStorage.setItem(key, "false")
      // console.error("failed to insert publicKey ", linkKeypair.publicKey.toBase58());
    }
  }
  useEffect(() => {
    // insertPublicKey(linkKeypair.publicKey);
    if(localStorage.getItem(key) === null) {
      insertPublicKey(linkKeypair.publicKey, onInsert);
    }
  }, []);
  return (
    <LinkProvider linkKeypair={linkKeypair}>
      <Main/>
    </LinkProvider>
  );
}

export default Wallet;
