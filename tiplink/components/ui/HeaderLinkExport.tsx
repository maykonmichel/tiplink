import { useState, useEffect } from 'react';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Bookmark from '@mui/icons-material/Bookmark';
import QrCode from '@mui/icons-material/QrCode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styles from './HeaderLinkExport.module.css';

const HeaderLinkExport = () => {
  const [ url, setUrl ] = useState('');

  useEffect(() => {
      setUrl(window.location.href);
  }, []);

  return(
    <div style={{maxWidth: '36rem'}}>
      <div 
        className={styles.linkFieldContainer}
        style={{marginTop: '1rem'}}>
        <span className={styles.linkFieldText}>{url}</span>
      </div>

      <Box sx={{display: 'flex', m: 1, justifyContent: 'space-around', alignItems: 'center', width: '100%'}}>
        <Button
          style={{flexDirection: 'column'}}
          variant='contained' 
          fullWidth 
          onClick={() => navigator.clipboard.writeText(url)}>
          <ContentCopy/>
          Copy
        </Button>

        <Button 
          style={{flexDirection: 'column', marginLeft: '1rem'}}
          variant='contained' 
          fullWidth>
          <Bookmark/>
          Bookmark
        </Button>
        
        <Button
          style={{flexDirection: 'column', marginLeft: '1rem'}}
          variant='contained' 
          fullWidth>
          <QrCode/>
          QR Code
        </Button>
      </Box>

      {/* <Avatar>
          <Bookmark/>
      </Avatar> */}
    </div>
  );
};

export default HeaderLinkExport;