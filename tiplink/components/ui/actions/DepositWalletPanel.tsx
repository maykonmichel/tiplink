import ActionsPanelTitleBar from './ui/ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import { useActionState } from './state/useActionState';
import Typography from '@mui/material/Typography';
import CurrencyInput, {fiatQuickInputDefault, cryptoQuickInputDefault }from '../common/CurrencyInput';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { useLink } from '../../useLink';


const DepositWalletPanel = () => {
  const { goBack } = useActionState();
  const [inputAmountSol, setInputAmountSol] = useState<number>(NaN);
  const { extConnected, deposit, scheduleBalanceUpdate } = useLink();
  const [ loading, setLoading ] = useState<boolean>(false);

  const depositFromWallet = async () => {
    if (!extConnected) {
      alert('Please connect Solana wallet to deposit.');
      return;
    }
    console.log('depositFromWallet ', inputAmountSol);
    setLoading(true)
    try {
      setLoading(true);
      await deposit(inputAmountSol);
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
      <ActionsPanelTitleBar title='Deposit' backOnClick={goBack} />
      <Typography textAlign='center' style={{marginTop: '1rem', marginBottom: '1rem'}}>
        How much do you want to deposit here?
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
          fiatQuickInputOptions={fiatQuickInputDefault}
          cryptoQuickInputOptions={cryptoQuickInputDefault}
          onValueChange={setInputAmountSol}/>
        <LoadingButton sx={{m: 2, marginTop: '1rem'}} variant="outlined" onClick={depositFromWallet} loading={loading}>
          Deposit
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default DepositWalletPanel;
