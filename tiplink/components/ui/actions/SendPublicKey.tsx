import ActionsPanelTitleBar from './ui/ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import { useActionState } from './state/useActionState';
import Typography from '@mui/material/Typography';
import CurrencyInput from '../common/CurrencyInput';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useLink } from '../../useLink';
import { PublicKey } from '@solana/web3.js';
import TextField from '@mui/material/TextField';

const SendPublicKey = () => {
  const { goBack } = useActionState();
  const [inputAmountSol, setInputAmountSol] = useState<number>(NaN);
  const { sendSOL, balanceSOL } = useLink();
  const [ address, setAddress ] = useState<string>("");

  const send = async () => {
    // TODO validate PublicKey and amount
    // TODO treat full amount differently
    const pubKey = new PublicKey(address);
    if(!PublicKey.isOnCurve(pubKey.toBuffer())) {
        alert("Invalid public key");
        return;
    }

    if(inputAmountSol > balanceSOL) {
        alert("Cannot withdraw more than balance");
        return;
    }

    try {
        await sendSOL(new PublicKey(address), inputAmountSol);
    } catch(err) {
        if(err instanceof Error) {
            alert(err.message);
            return;
        }
    }
  };


  return (
    <Box width='100%'>
      <ActionsPanelTitleBar title='Send to Public Key' backOnClick={goBack} />
      <Typography textAlign='center' style={{marginTop: '1rem', marginBottom: '1rem'}}>
        How much do you want to send?
      </Typography>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <TextField
        fullWidth
        label="Solana Address"
        value={address}
        onChange={(e) => {setAddress(e.target.value);}}
        />
        <br></br>
        <CurrencyInput
          fiatCurrency='USD'
          cryptoCurrency='SOL'
          useMax={true}
          onValueChange={setInputAmountSol}/>
        <Button
          style={{marginTop: '1rem'}}
          variant='contained'
          onClick={send}
          disabled={(address.length != 44)}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default SendPublicKey;
