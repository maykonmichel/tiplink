import '../styles/globals.css'
import { useState, useEffect } from "react";
import SolanaContext from "../context/SolanaContext";

function MyApp({ Component, pageProps }) {
  const [provider, setProvider] = useState(undefined);
  const [connected, setConnected] = useState(undefined);

  const onPhantomConnection = () => {
    // console.log("onPhantomConnection");
    setConnected(true);
  };
  const onPhantomDisconnection = () => {
    setConnected(false);
  }

  useEffect(() => {
    window.addEventListener('load', async (event) => {
      if (window.solana) {
        setProvider(window.solana);
        window.solana.on("connect", onPhantomConnection);
        window.solana.on("disconnect", onPhantomDisconnection);
        setConnected(window.solana.isConnected);
        // TODO eager connection doesn't work, as if the user disconnects and refreshes the page, it auto-reconnects
        // window.solana.connect({ onlyIfTrusted: true});
      } else {
        console.log("Please download phantom wallet for a more seamless experience");
      }
    });
    // document.removeEventListener("contextmenu");
  }, [provider, connected]);

  return(
    <SolanaContext.Provider value={{provider: provider, connected: connected}}>
      <Component {...pageProps} />
    </SolanaContext.Provider>
  );
}

export default MyApp
