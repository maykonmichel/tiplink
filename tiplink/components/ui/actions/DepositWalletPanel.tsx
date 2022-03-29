import ActionsPanelTitleBar from './ui/ActionsPanelTitleBar';
import Box from '@mui/material/Box';
import { useActionState } from './state/useActionState';
import Typography from '@mui/material/Typography';
import CurrencyInput, { cryptoQuickInputDefault, fiatQuickInputDefault} from '../common/CurrencyInput';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useLink } from '../../useLink';

const DepositWalletPanel = () => {
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

export default DepositWalletPanel;
