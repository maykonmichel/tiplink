import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = {
  icon: React.ReactNode,
  title: string,
  subtitle: string,
}

const OptionRow: React.FC<Props> = ({icon, title, subtitle}) => {
  return(
    <ListItem component='div' disablePadding>
      <ListItemButton sx={{padding: '1rem'}}>
        <Box sx={{display: 'flex'}}>
          <Box sx={{padding: '0.25rem 1rem 0rem 0rem'}}>
            {icon}
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant='body1' component='span'>{title}</Typography>
            <Typography variant='body2' component='span'>{subtitle}</Typography>
          </Box>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default OptionRow;