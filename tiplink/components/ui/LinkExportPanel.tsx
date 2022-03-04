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

const LinkExportPanel = () => {
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

      <Box sx={{display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem'}}>
        {renderButton('Copy', <IconCopy/>, () => navigator.clipboard.writeText(url))}
        {renderButton('Bookmark', <IconBookmark/>, () => {/* TODO */})}
        {renderButton('QR Code', <IconQrCode/>, () => {/* TODO */})}
      </Box>
    </div>
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
