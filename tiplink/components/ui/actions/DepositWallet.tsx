import ActionsPanelTitleBar from '../ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import { useActionState } from './useActionState';
import Typography from '@mui/material/Typography';
import CurrencyInput from '../CurrencyInput';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useLink } from '../../useLink';

const DepositWallet = () => {
  const { goBack } = useActionState();
  const [inputAmountSol, setInputAmountSol] = useState<number>(NaN);
  const { extConnected, deposit } = useLink();

  const depositFromWallet = async () => {
    if (!extConnected) {
      alert('Please connect Solana wallet to deposit.');
      return;
    }
    console.log('depositFromWallet ', inputAmountSol);
    await deposit(inputAmountSol);
  };

  return (
    <Box width='100%'>
      <ActionsPanelTitleBar title='Deposit Crypto' backOnClick={goBack} />
      <Typography style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        Enter amount to deposit from your connected wallet.
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
          fiatQuickInputOptions={[
            {label: '$1', inputValue: '1.00'},
            {label: '$2', inputValue: '2.00'},
            {label: '$5', inputValue: '5.00'},
          ]}
          cryptoQuickInputOptions={[
            {label: '0.1', inputValue: '0.1'},
            {label: '0.2', inputValue: '0.2'},
            {label: '0.5', inputValue: '0.5'},
          ]}
          onValueChange={setInputAmountSol}/>
        <Button
          style={{marginTop: '1rem'}}
          variant='outlined'
          onClick={depositFromWallet}>
          Deposit
        </Button>
      </Box>
    </Box>
  );
};

export default DepositWallet;
