import Wallet from "../components/wallet";
import { useState, useEffect } from "react";
import { decode as b58decode } from 'bs58';

const WalletWrapperLong = () => {
  const [secretKey, setSecretKey] = useState(null);
  const [parsedSecret, setParsedSecret] = useState(false);

  useEffect(() => {
    try{
      setSecretKey(b58decode(window.location.hash.substr(1)));
      setParsedSecret(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (parsedSecret){
    return(<Wallet secretKey={secretKey}/>);
  } else {
    return(<p>Loading</p>);
  }
};

export default WalletWrapperLong;