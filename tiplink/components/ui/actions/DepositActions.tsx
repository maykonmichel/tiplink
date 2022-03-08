import { useState } from "react";
import ActionsPanelRow from '../ActionsPanelRow';
import ActionsPanelTitleBar from '../ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import QRModal from "../QRModal";
import { useActionState } from "./useActionState";
import { useLink }  from "../../useLink";
import {
    AccountBalanceWalletRounded as IconWallet,
    QrCodeRounded as IconQRCode
  } from '@mui/icons-material';


const DepositActions = () => {
    const { goBack, setActionState } = useActionState();
    const { linkKeypair } = useLink();
    const [ open, setOpen ] = useState<boolean>(false);
    const qrMessage = "Scan public key in any Solana-compatible wallet."

    return(
        <Box width='100%'>
            <ActionsPanelTitleBar
                title='Options'
                backOnClick={goBack}/>
            <Box>
                <ActionsPanelRow
                icon={<IconWallet/>}
                title='Deposit from wallet'
                subtitle='Deposit Solana from your connected wallet.'
                onClick={() => {setActionState("depositWallet");}}
                />
                <Divider/>
                <ActionsPanelRow
                icon={<IconQRCode/>}
                title='Deposit to public key'
                subtitle="Click to reveal your wallet's public address as QR code or text."
                onClick={() => {setOpen(true);}}
                />
                <Divider/>
            </Box>
            <QRModal 
                message={qrMessage} 
                open={open} 
                handleClose={() => {setOpen(false);}} 
                value={linkKeypair.publicKey.toBase58()}/>
        </Box>
    );
}

export default DepositActions;