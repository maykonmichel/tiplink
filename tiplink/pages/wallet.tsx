import Wallet from "../components/wallet";
import { useState, useEffect } from "react";
// @ts-ignore
import { decode as b58decode } from 'bs58';

const WalletWrapperLong = () => {
  const [secretKey, setSecretKey] = useState<Uint8Array>();

  useEffect(() => {
    try{
      setSecretKey(b58decode(window.location.hash.substr(1)));
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (secretKey !== undefined){
    return(<Wallet secretKey={secretKey}/>);
  } else {
    return(<p>Loading</p>);
  }
};

export default WalletWrapperLong;