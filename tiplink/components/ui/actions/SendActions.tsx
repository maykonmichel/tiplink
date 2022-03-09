import ActionsPanelTitleBar from './ui/ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import { useActionState } from "./state/useActionState";
import CurrencyInput from '../common/CurrencyInput';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


const SendActions = () => {
    const { goBack, setActionState, sendAmount, setSendAmount } = useActionState();
    return(
        <Box style={{display: "flex", flexDirection: "column", textAlign: "center"}} width='100%'>
            <ActionsPanelTitleBar title='Send Crypto' backOnClick={goBack}/>
            <Typography style={{margin: "1rem"}} >How much do you want to send?</Typography>
            <div style={{margin: "auto"}} >
                <CurrencyInput fiatCurrency={'USD'} cryptoCurrency={'SOL'} onValueChange={setSendAmount}/>
            </div>
            <Button style={{margin: "auto", marginTop: "1rem"}} variant="outlined" onClick={() => {}}>Next</Button>
        </Box>
    );
}

export default SendActions;