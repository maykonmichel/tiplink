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


const DepositActions = () => {
    const { goBack } = useActionState();

    return(
        <Box width='100%'>
            <ActionsPanelTitleBar
                title='Options'
                backOnClick={goBack}/>
            <List>
                <ActionsPanelRow
                icon={<IconWallet/>}
                title='Deposit from wallet'
                subtitle='Deposit Solana from your connected wallet.'/>
                <Divider/>
                <ActionsPanelRow
                icon={<IconQRCode/>}
                title='Public Key'
                subtitle='Click to reveal wallet public key.'/>
                <Divider/>
            </List>
        </Box>
    );
}

export default DepositActions;