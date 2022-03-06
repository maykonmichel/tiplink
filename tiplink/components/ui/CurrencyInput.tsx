import { useState } from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

type Props = {
  fiatCurrency: string,
  cryptoCurrency: string,
  cryptoPrice: number,
  quickInputOptions?: QuickInputOption[],
}

type QuickInputOption = {
  label: string,
  cryptoCurrencyValue: number,
}

const CurrencyInput: React.FC<Props> = ({
    fiatCurrency,
    cryptoCurrency,
    cryptoPrice,
    quickInputOptions}) => {
  const [ currency, setCurrency ] = useState(fiatCurrency);

  const getInverseCurrency = (): string => {
    return currency === fiatCurrency ? cryptoCurrency : fiatCurrency;
  }

  const toggleCurrency = () => {
    setCurrency(getInverseCurrency());
    // TODO: Update the amount
  }

  const quickInputOptionsRows = [];
  if (quickInputOptions) {
    for (let option of quickInputOptions) {
      quickInputOptionsRows.push(renderButton(option.label, () => {}));
    }
  }
  const quickInputOptionsComponent = quickInputOptionsRows.length > 0
    ? <Box sx={{display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem'}}>
        {quickInputOptionsRows}
      </Box>
    : null;

  return (
    <Box width='16rem'>
      <OutlinedInput
        fullWidth
        onChange={() => {}}
        startAdornment={
          <InputAdornment position='start'>
            <Chip label={currency} onClick={toggleCurrency}/>
          </InputAdornment>}/>
      {quickInputOptionsComponent}
      <Typography 
        width='100%'
        marginTop='0.25rem'
        textAlign='center'
        variant='subtitle2' 
        >0.123 {getInverseCurrency()}
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
