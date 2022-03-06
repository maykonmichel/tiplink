import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

type Props = {
  cta1Label: string,
  cta2Label: string,
  cta1OnClick: () => void,
  cta2OnClick: () => void,
}


const DualCtaRow: React.FC<Props> = ({cta1Label, cta2Label, cta1OnClick, cta2OnClick}) => {
  return (
    <ListItem component='div' disablePadding>
      <Box sx={{display: 'flex', padding: '1rem 0rem 1rem 0rem', gap: '1rem', width: '100%'}}>
        {renderButton(cta1Label, cta1OnClick)}
        {renderButton(cta2Label, cta2OnClick)}
      </Box>
    </ListItem>
  );
};

function renderButton(label: string, onClick: () => void): React.ReactNode {
  return (
    <Button sx={{flexGrow: '1', padding: '0.5rem 0rem 0.5rem 0rem', textTransform: 'none'}} variant='outlined' onClick={onClick}>{label}</Button>
  );
}

export default DualCtaRow;