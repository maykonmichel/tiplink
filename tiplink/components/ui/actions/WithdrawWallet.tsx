import ActionsPanelTitleBar from './ui/ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import { useActionState } from './state/useActionState';
import Typography from '@mui/material/Typography';
import CurrencyInput from '../common/CurrencyInput';
import { useState } from 'react';
import { useLink } from '../../useLink';
import LoadingButton from '@mui/lab/LoadingButton';

const WithdrawWallet = () => {
  const { goBack } = useActionState();
  const [inputAmountSol, setInputAmountSol] = useState<number>(NaN);
  const { sendSOL, balanceSOL, extPublicKey, extConnected, scheduleBalanceUpdate} = useLink();
  const [ loading, setLoading ] = useState<boolean>(false);

  const send = async () => {
    // TODO validate PublicKey and amount
    // TODO treat full amount differently

    if(inputAmountSol > balanceSOL) {
        alert("Cannot withdraw more than balance");
        return;
    }
    
    if(!extConnected || (extPublicKey === null)) {
      alert("Please connect wallet to withdraw this way.")
      return;
    }


    try {
      setLoading(true);
      await sendSOL(extPublicKey, inputAmountSol);
      scheduleBalanceUpdate(100);
    } catch(err) {
        if(err instanceof Error) {
            alert(err.message);
            setLoading(false);
            return;
        }
    } 
    setLoading(false);
  };


  return (
    <Box width='100%'>
      <ActionsPanelTitleBar title='Withdraw to Wallet' backOnClick={goBack} />
      <Typography textAlign='center' style={{marginTop: '1rem', marginBottom: '1rem'}}>
        How much do you want to withdraw?
      </Typography>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <CurrencyInput
          fiatCurrency='USD'
          cryptoCurrency='SOL'
          onValueChange={setInputAmountSol}
          useMax={true}
        />
        <LoadingButton sx={{m: 2, marginTop: '1rem'}} variant="contained" onClick={send} loading={loading}>
          Withdraw
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default WithdrawWallet;