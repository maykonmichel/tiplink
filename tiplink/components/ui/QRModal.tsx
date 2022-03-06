import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button  from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { ContentCopy as IconCopy } from '@mui/icons-material';
const QRCode = require('qrcode.react');

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type QRProps = {
    message: string;
    open: boolean;
    handleClose: () => void;
    value: string;
}

const QRModal = (props: QRProps) => {
    return(
        <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style} style={{textAlign: "center", flexDirection: "column"}}>
                <Typography style={{marginBottom: "0.5rem"}}>{props.message}</Typography>
                <QRCode value={props.value} style={{marginBottom: "0.5rem"}}/>
                <TextField
                fullWidth
                value={props.value}
                style={{marginBottom: "0.5rem"}}
                InputProps={{
                    endAdornment: (
                        <IconButton edge="end" color="primary" 
                        onClick={() => {navigator.clipboard.writeText(props.value);}}>
                            <IconCopy/>
                        </IconButton>
                    )
                }}
                />
                <Button variant="outlined" onClick={props.handleClose}>Done</Button>
            </Box>
        </Modal>
    );
}

export default QRModal;