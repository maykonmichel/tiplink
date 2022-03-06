import ActionsPanelTitleBar from '../ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import { useActionState } from "./useActionState";
import Typography  from '@mui/material/Typography';
import CurrencyInput from '../CurrencyInput';
import Button from '@mui/material/Button';
import { useState } from "react";
import { useLink } from "../../useLink";


const DepositWallet = () => {
    const { goBack } = useActionState();
    const [ amountSOL, setAmountSOL ] = useState<number>(NaN);
    const { extConnected, deposit } = useLink();

    const depositFromWallet = () => {
        if(!extConnected) {
            alert("Please connect Solana wallet to deposit.");
            return;
        }
        deposit(amountSOL);
    }

    return(
        <Box width='100%'>
            <ActionsPanelTitleBar title='Deposit Crypto' backOnClick={goBack}/>
            <Typography style={{marginBottom: "1rem"}}>Enter amount to deposit from your connected wallet.</Typography>
            <Box style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <CurrencyInput primaryCurrency='USD' secondaryCurrency='SOL' amountSOL={amountSOL} setAmountSOL={setAmountSOL}/>
                <Button style={{marginTop: "1rem"}} variant="outlined" onClick={depositFromWallet}>Deposit</Button>
            </Box>
        </Box>
    );
}

export default DepositWallet;