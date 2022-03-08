import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {
  ArrowBackRounded as IconBack,
} from '@mui/icons-material';

type Props = {
  title: string,
  backOnClick: () => void,
}

const ActionsPanelTitleBar: React.FC<Props> = ({title, backOnClick}) => {
  return (
    <Box width='100%'>
      <Box display='flex' position='relative'>
        <Typography width='100%' position='absolute' alignSelf='center' textAlign='center' variant='subtitle1'>{title}</Typography>
        <IconButton aria-label='back' onClick={backOnClick}><IconBack/></IconButton>
      </Box>
      <Divider sx={{marginTop: '0.25rem'}}/>
    </Box>
  );
};

export default ActionsPanelTitleBar;