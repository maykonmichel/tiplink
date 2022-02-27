import Wallet from "../components/wallet";
import { useEffect, useState } from "react";
import { decode as b58decode } from 'bs58';
import {kdf} from "../lib/crypto";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Keypair } from "@solana/web3.js";

const getPrivateKey = async (slug: string) => {
  const base = window.location.origin;
  const endpoint = base + "/api/get_wallet?slug=" + slug;
  const rawResponse = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  const content = await rawResponse.json();
  const salt = b58decode(content.salt);
  const pwShort = b58decode(window.location.hash.substr(1));
  const seed = await kdf(32, pwShort, salt);
  const kp = Keypair.fromSeed(seed);
  return kp.secretKey;
}

const WalletWrapper = () => {
  const [pk, setPk] = useState<Uint8Array>();

  useEffect(() => {
    const slug = window.location.href.split("/")[3].split("#")[0];
    const sp = async () => {
      const res = (await getPrivateKey(slug));
      if(res !== null){
        setPk(res);
      }
    }
    if((window.location.hash !== "") && (pk === undefined)) {
      sp();
    }
  }, []);

  if(pk !== undefined) {
    return(
      <Wallet secretKey={pk}/>
    );
  } else {
    return( 
      <Box style={{display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center"}}>
        <CircularProgress size={"7rem"} style={{marginTop: "5rem"}}/>
      </Box>
    );
  }
};

export default WalletWrapper;