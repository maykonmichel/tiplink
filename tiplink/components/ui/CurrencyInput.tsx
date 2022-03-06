import { useState } from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useLink } from "../useLink";

type Props = {
  primaryCurrency: string,
  secondaryCurrency: string,
  amountSOL: number, // amount in SOL
  setAmountSOL(a: number): void,
  quickAmounts?: boolean,
}

const CurrencyInput: React.FC<Props> = ({primaryCurrency, secondaryCurrency, amountSOL, setAmountSOL, quickAmounts=false}) => {
  const [ currency, setCurrency ] = useState(primaryCurrency);
  const [ amount, setAmount ] = useState("");
  const { exchangeRate } = useLink();

  const getInverseCurrency = (): string => {
    return currency === primaryCurrency ? secondaryCurrency : primaryCurrency;
  }

  const toggleCurrency = () => {
    setCurrency(getInverseCurrency());
    // TODO: Update the amount
  }

  const getInverseCurrencyDisplay = () => {
    const invC = getInverseCurrency();
    const amtF = parseFloat(amount);
    if(isNaN(amtF)) {
      return "";
    }
    const invAmt = invC === 'SOL' ? amtF / exchangeRate : amtF * exchangeRate;
    const decimals = invC == 'USD' ? 2 : 4;
    return invAmt.toFixed(decimals) + " " + invC;
  }

  const onChange = (v: string) => {
    setAmount(v);
    const amtF = parseFloat(v);
    if(!isNaN(amtF)) {
      setAmountSOL(currency == 'SOL' ? amtF : amtF / exchangeRate);
    }
  }

  return (
    <Box width='16rem'>
      <OutlinedInput
        fullWidth
        value={amount}
        onChange={(e) => {onChange(e.target.value);}}
        startAdornment={
          <InputAdornment position='start'>
            <Chip label={currency} onClick={toggleCurrency}/>
          </InputAdornment>}/>
      {quickAmounts && 
        <Box sx={{display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem'}}>
          {renderButton('$1', () => {})}
          {renderButton('$2', () => {})}
          {renderButton('$5', () => {})}
        </Box>
      }
      <Typography 
        width='100%'
        marginTop='0.25rem'
        textAlign='center'
        variant='subtitle2' 
        >{getInverseCurrencyDisplay()}</Typography>
    </Box>
  );
};

function renderButton(label: string, onClick: () => void): React.ReactNode {
  return (
    <Button
      style={{
        display: 'flex', 
        flexDirection: 'column', 
        flexGrow: '1', 
        flexBasis: '0',
        textTransform: 'none'}}
      variant='outlined'
      onClick={onClick}>
      {label}
    </Button>
  );
}

export default CurrencyInput;
