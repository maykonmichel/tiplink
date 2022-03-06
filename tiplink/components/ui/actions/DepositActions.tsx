import ActionsPanelRow from '../ActionsPanelRow';
import ActionsPanelTitleBar from '../ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import {
  AccountBalanceWalletRounded as IconWallet,
  QrCodeRounded as IconQRCode
} from '@mui/icons-material';
import { useActionState } from "./useActionState";
import QRModal from "../QRModal";
import { useLink }  from "../../useLink";
import { useState } from "react";


const DepositActions = () => {
    const { goBack, setActionState } = useActionState();
    const { linkKeypair } = useLink();
    const [ open, setOpen ] = useState<boolean>(false);
    const qrMessage = "Scan public key in any solana-compatible wallet."

    return(
        <Box width='100%'>
            <ActionsPanelTitleBar
                title='Options'
                backOnClick={goBack}/>
            <List>
                <ActionsPanelRow
                icon={<IconWallet/>}
                title='Deposit from wallet'
                subtitle='Deposit Solana from your connected wallet.'
                onClick={() => {setActionState("depositWallet");}}
                />
                <Divider/>
                <ActionsPanelRow
                icon={<IconQRCode/>}
                title='Deposit via Public Key'
                subtitle="Click to reveal your wallet's public address, as QR code or copiable text."
                onClick={() => {setOpen(true);}}
                />
                <Divider/>
            </List>
            <QRModal message={qrMessage} open={open} handleClose={() => {setOpen(false);}} value={linkKeypair.publicKey.toBase58()}/>
        </Box>
    );
}

export default DepositActions;