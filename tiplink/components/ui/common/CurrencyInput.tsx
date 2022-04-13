import { useState } from 'react';
import { useLink } from "../../useLink";
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import  useExchangeRate  from "../../useExchangeRate";

type Props = {
  fiatCurrency: string,
  cryptoCurrency: string,
  fiatQuickInputOptions?: QuickInputOption[],
  cryptoQuickInputOptions?: QuickInputOption[],
  useMax?: boolean;
  onValueChange(cryptoValue: number): void,
}

type QuickInputOption = {
  label: string,
  inputValue: string 
}


export const fiatQuickInputDefault=[
  {label: '$1', inputValue: '1.00'},
  {label: '$2', inputValue: '2.00'},
  {label: '$5', inputValue: '5.00'},
];

export const cryptoQuickInputDefault = [
  {label: '0.01', inputValue: '0.01'},
  {label: '0.02', inputValue: '0.02'},
  {label: '0.05', inputValue: '0.05'},
];

const CurrencyInput: React.FC<Props> = ({
    fiatCurrency, 
    cryptoCurrency, 
    fiatQuickInputOptions = null, 
    cryptoQuickInputOptions = null, 
    useMax = false,
    onValueChange}) => {
  const [ currency, setCurrency ] = useState(fiatCurrency);
  const [ inputValue, setInputValue ] = useState('');
  const { exchangeRate: cryptoPrice } = useExchangeRate();

  const isInputInCryptoCurrency = (): boolean => currency === cryptoCurrency;
  const getInverseCurrency = (): string => isInputInCryptoCurrency() ? fiatCurrency : cryptoCurrency;
  const toggleInputCurrency = () => setCurrency(getInverseCurrency());
  const isValidAmount = (amount: number): boolean => !isNaN(amount) && amount > 0;

  const getInverseCurrencyDisplay = () => {
    const invCurrency = getInverseCurrency();
    const invCurrencyAmount = Number(inputValue);
    var invAmount = 0;
    if (isValidAmount(invCurrencyAmount)) {
      invAmount = isInputInCryptoCurrency() 
        ? invCurrencyAmount * cryptoPrice 
        : invCurrencyAmount / cryptoPrice;
    }
    const decimals = isInputInCryptoCurrency() ? 2 : 4;
    return invAmount.toFixed(decimals) + ' ' + invCurrency;
  }

  const onChange = (v: string) => {
    setInputValue(v);
    const inputAmount = Number(v);
    if (isValidAmount(inputAmount)) {
      onValueChange(isInputInCryptoCurrency() ? inputAmount : inputAmount / cryptoPrice);
    } else {
      onValueChange(0);
    }
  }

  const getMaxInputValue = () => {
    if(!useMax) {
      return '0.00';
    }

    const { balanceSOL, balanceUSD, getFeeEstimate } = useLink();
    const feeSOL = getFeeEstimate();
    if(balanceSOL < feeSOL) {
      return '0.00';
    }
    if(isInputInCryptoCurrency()){
      return (balanceSOL - feeSOL).toFixed(4);
    } 

    return (balanceUSD - feeSOL / cryptoPrice).toFixed(2);
  }

  const quickInputOptionsRows = [];
  const explicitOptions = isInputInCryptoCurrency() ? cryptoQuickInputOptions : fiatQuickInputOptions;
  const maxOptions = useMax ? [{label: 'MAX', inputValue: getMaxInputValue()},] : null;
  const quickInputOptions = (explicitOptions !== null) 
    ? (useMax && (maxOptions !== null) ? explicitOptions.concat(maxOptions) : explicitOptions) 
    : (useMax ? maxOptions : null);
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
        <Box sx={{display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem', alignItems: 'center', justifyContent: 'center'}}>
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
  // these can live in a list so I think they need keys
  return (
    <Button
      key={label}
      style={{
        display: 'flex', 
        flexDirection: 'column', 
        flexGrow: '1', 
        flexBasis: '0',
        textTransform: 'none',
        maxWidth: '50%'
      }}
      variant='outlined'
      onClick={onClick}>
      {label}
    </Button>
  );
}

export default CurrencyInput;
