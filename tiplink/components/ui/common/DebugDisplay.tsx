import { useLink } from "../../useLink";
import { useState, useEffect } from "react";
import { WindowOutlined } from "@mui/icons-material";

const DebugDisplay = () => {
    const { linkKeypair, balanceUSD } = useLink();
    const [ testing, setTesting ] = useState<boolean>(false);
    const explorerLink = 'https://explorer.solana.com/address/' + linkKeypair.publicKey.toString() + '?cluster=' + 'mainnet';
    useEffect(() => {
        setTesting(window.location.href.includes('localhost'));
    }, [])

    return(
        <div>
            {testing && 
            <div style={{border: '1px solid black', marginTop: '1rem', padding: '1rem'}}>
                <h4>Debug Info</h4>
                <p> publicKey: {linkKeypair.publicKey.toBase58()}</p>
                <p> balanceUSD: {balanceUSD} </p>
                <a href={explorerLink}>Explorer</a>
            </div>
            }
        </div>
    );
};

export default DebugDisplay;