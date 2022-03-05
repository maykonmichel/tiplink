import { useState } from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

type Props = {
  primaryCurrency: string,
  secondaryCurrency: string
}

const CurrencyInput: React.FC<Props> = ({primaryCurrency, secondaryCurrency}) => {
  const [ currency, setCurrency ] = useState(primaryCurrency);

  const getInverseCurrency = (): string => {
    return currency === primaryCurrency ? secondaryCurrency : primaryCurrency;
  }

  const toggleCurrency = () => {
    setCurrency(getInverseCurrency());
    // TODO: Update the amount
  }

  return (
    <Box width='16rem'>
      <OutlinedInput
        fullWidth
        onChange={() => {}}
        startAdornment={
          <InputAdornment position='start'>
            <Chip label={currency} onClick={toggleCurrency}/>
          </InputAdornment>}/>
      <Box sx={{display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem'}}>
        {renderButton('$1', () => {})}
        {renderButton('$2', () => {})}
        {renderButton('$5', () => {})}
      </Box>
      <Typography 
        width='100%'
        marginTop='0.25rem'
        textAlign='center'
        variant='subtitle2' 
        >0.123 {getInverseCurrency()}</Typography>
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
