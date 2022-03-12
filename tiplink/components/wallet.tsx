import  { Keypair } from '@solana/web3.js';
// Default styles that can be overridden by your app
import { LinkProvider } from "./LinkContextProvider";
import Main from "./ui/main/Main";

const Wallet = (props: {secretKey: Uint8Array}) => {
  const linkKeypair = Keypair.fromSecretKey(props.secretKey);
  return (
    <LinkProvider linkKeypair={linkKeypair}>
      <Main/>
    </LinkProvider>
  );
}

export default Wallet;
