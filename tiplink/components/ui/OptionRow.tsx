import ButtonBase from '@mui/material/ButtonBase';
import ListItem from '@mui/material/ListItem';
import SvgIcon from '@mui/material/SvgIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Icons
import BookmarkOutlined from '@mui/icons-material/BookmarkOutlined';

const OptionRow = (icon: SvgIcon, title: String, subtitle: String) => {
  return(
    <ListItem component='div' disablePadding>
      <ListItemButton sx={{padding: '1rem 0rem 1rem 0rem'}}>
        <Box sx={{display: 'flex'}}>
          <Box sx={{padding: '1rem'}}>
            <BookmarkOutlined/>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', padding: '0rem 1rem 0rem 1rem'}}>
            <Typography>{title}</Typography>
            <Typography>{subtitle}</Typography>
          </Box>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default OptionRow;