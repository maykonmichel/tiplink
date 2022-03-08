import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { ContentCopy as IconCopy } from "@mui/icons-material";
const QRCode = require("qrcode.react");

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  cornerRadius: "0.5rem",
  p: 4,
};

type Props = {
  message: string;
  open: boolean;
  value: string;
  handleClose: () => void;
};

const QrModal = (props: Props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="QR code"
      aria-describedby="This wallet's public key QR code and text"
      maxWidth="xs"
    >
      <DialogContent sx={{padding: "1.5rem", textAlign: "center"}}>
        <Typography>{props.message}</Typography>
        <QRCode value={props.value} style={{ margin: "1.5rem" }} />
        <TextField
          fullWidth
          value={props.value}
          InputProps={{
            endAdornment: (
              <IconButton
                edge="end"
                color="primary"
                onClick={() => {
                  navigator.clipboard.writeText(props.value);
                }}
              >
                <IconCopy />
              </IconButton>
            ),
          }}
        />
        <Button fullWidth sx={{marginTop: "1rem"}} variant="outlined" onClick={props.handleClose}>Done</Button>
      </DialogContent>
    </Dialog>
  );
};

export default QrModal;
