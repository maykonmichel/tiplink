import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button  from '@mui/material/Button';
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
            <Box sx={style} style={{textAlign: "center"}}>
                <Typography style={{marginBottom: "0.5rem"}}>Scan this QR code to open directly to this TipLink.</Typography>
                <QRCode value={props.value} style={{marginBottom: "0.5rem"}}/>
                <Typography noWrap style={{marginBottom: "0.5rem"}}>{props.value}</Typography>
                <Button variant="outlined" onClick={props.handleClose}>Done</Button>
            </Box>
        </Modal>
    );
}

export default QRModal;