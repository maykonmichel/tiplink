import { useState } from 'react';
import { useLink } from "../../useLink";
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

type Props = {
  fiatCurrency: string,
  cryptoCurrency: string,
  fiatQuickInputOptions?: QuickInputOption[],
  cryptoQuickInputOptions?: QuickInputOption[],
  onValueChange(cryptoValue: number): void,
}

type QuickInputOption = {
  label: string,
  inputValue: string 
}

const CurrencyInput: React.FC<Props> = ({
    fiatCurrency, 
    cryptoCurrency, 
    fiatQuickInputOptions = null, 
    cryptoQuickInputOptions = null, 
    onValueChange}) => {
  const [ currency, setCurrency ] = useState(fiatCurrency);
  const [ inputValue, setInputValue ] = useState('');
  const { exchangeRate: cryptoPrice } = useLink();

  const isInputInCrytoCurrency = (): boolean => currency === cryptoCurrency;
  const getInverseCurrency = (): string => isInputInCrytoCurrency() ? fiatCurrency : cryptoCurrency;
  const toggleInputCurrency = () => setCurrency(getInverseCurrency());
  const isValidAmount = (amount: number): boolean => !isNaN(amount) && amount > 0;

  const getInverseCurrencyDisplay = () => {
    const invCurrency = getInverseCurrency();
    const invCurrencyAmount = Number(inputValue);
    var invAmount = 0;
    if (isValidAmount(invCurrencyAmount)) {
      invAmount = isInputInCrytoCurrency() 
        ? invCurrencyAmount * cryptoPrice 
        : invCurrencyAmount / cryptoPrice;
    }
    const decimals = isInputInCrytoCurrency() ? 2 : 4;
    return invAmount.toFixed(decimals) + ' ' + invCurrency;
  }

  const onChange = (v: string) => {
    setInputValue(v);
    const inputAmount = Number(v);
    if (isValidAmount(inputAmount)) {
      onValueChange(isInputInCrytoCurrency() ? inputAmount : inputAmount / cryptoPrice);
    } else {
      onValueChange(0);
    }
  }

  const quickInputOptionsRows = [];
  const quickInputOptions = isInputInCrytoCurrency() 
      ? cryptoQuickInputOptions 
      : fiatQuickInputOptions;
  if (quickInputOptions) {
    for (let option of quickInputOptions) {
      quickInputOptionsRows.push(renderButton(option.label, () => onChange(option.inputValue)));
    }
  }

  return (
    <Box width='16rem'>
      <OutlinedInput
        fullWidth
        value={inputValue}
        onChange={(e) => {onChange(e.target.value);}}
        startAdornment={
          <InputAdornment position='start'>
            <Chip label={currency} onClick={toggleInputCurrency}/>
          </InputAdornment>}/>
      {quickInputOptionsRows.length > 0 && 
        <Box sx={{display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem'}}>
          {quickInputOptionsRows}
        </Box>}
      <Typography 
        width='100%'
        marginTop='0.25rem'
        textAlign='center'
        variant='subtitle2'>
          {getInverseCurrencyDisplay()}
      </Typography>
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
