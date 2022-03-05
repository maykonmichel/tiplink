import styles from './LinkExportPanel.module.css';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  ContentCopy as IconCopy,
  BookmarkBorder as IconBookmark,
  QrCodeRounded as IconQrCode,
} from '@mui/icons-material';
import QRModal from "./QRModal";

const LinkExportPanel = () => {
  const [ url, setUrl ] = useState('');
  const [ qrOpen, setQrOpen ] = useState(false);

  useEffect(() => {
      setUrl(window.location.href);
  }, []);

  const handleCloseQRModal = () => {
    setQrOpen(false);
  }


  const bookmark = () => {
    const title = document.title;
    if ((window as any).sidebar && (window as any).sidebar.addPanel) { // Mozilla Firefox Bookmark
        (window as any).sidebar.addPanel(title,url,'');
    } else if(window.external && ('AddFavorite' in window.external)) { // IE Favorite
        (window.external as any).AddFavorite(url,title); 
    } else { // webkit - safari/chrome
        alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
    }
  }

  return(
    <Box width='100%'>
      <Box 
        className={styles.linkFieldContainer}
        style={{marginTop: '1rem'}}>
        <span className={styles.linkFieldText}>{url}</span>
      </Box>

      <Box sx={{display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem'}}>
        {renderButton('Copy', <IconCopy/>, () => navigator.clipboard.writeText(url))}
        {renderButton('Bookmark', <IconBookmark/>, bookmark)}
        {renderButton('QR Code', <IconQrCode/>, () => { setQrOpen(true);})}
      </Box>
      <QRModal open={qrOpen} handleClose={handleCloseQRModal} value={url}/> 
    </Box>
  );
};

function renderButton(label: string, icon: React.ReactNode, onClick: () => void): React.ReactNode {
  return (
    <Button
      style={{
        display: 'flex', 
        flexDirection: 'column', 
        flexGrow: '1', 
        flexBasis: '0', 
        padding: '0.75rem 0rem 0.75rem 0rem', 
        textTransform: 'none'}}
      variant='outlined'
      onClick={onClick}>
      {icon}
      <Typography variant='subtitle2' marginTop='0.25rem'>{label}</Typography>
    </Button>
  );
}

export default LinkExportPanel;
