import Wallet from "../components/wallet";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import { decode as b58decode } from 'bs58';
import {xor, kdf} from "../lib/crypto";

const getPrivateKey = async (slug) => {
  const base = window.location.origin;
  const endpoint = base + "/api/get_wallet?slug=" + slug;
  const rawResponse = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  const content = await rawResponse.json();
  const serverKey = b58decode(content.cipher);
  const salt = b58decode(content.salt);
  const pwShort = b58decode(window.location.hash.substr(1));
  const pw = await kdf(serverKey.length, pwShort, salt);
  return xor(serverKey, pw);
}

const WalletWrapper = () => {
  const router = useRouter();
  const slug = router.query.wallet_id;
  const [pk, setPk] = useState(null);

  useEffect(() => {
    const sp = async () => {
      setPk(await getPrivateKey(slug));
    }
    if(window.location.hash !== "") {
      sp();
    }
  }, []);

  if(pk !== null) {
    return(
      <Wallet secretKey={pk}/>
    );
  } else {
    return <p>Error</p>
  }
};

export default WalletWrapper;