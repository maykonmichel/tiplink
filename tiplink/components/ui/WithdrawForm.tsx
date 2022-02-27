import { useLink } from "../useLink";
import { useState, MouseEvent } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import  { PublicKey } from '@solana/web3.js';
import CloseIcon from '@mui/icons-material/Close';
import TextField from "@mui/material/TextField";

function WithdrawForm() {
  const { sendSOL } = useLink();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const sendMoney = async (event: MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    event.preventDefault();
    await sendSOL(new PublicKey(address), parseFloat(amount));
  }

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>Send</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
        Send
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
        <DialogContentText>Please enter a valid Solana address to withrdaw funds. Please be careful, there isn't any validation.</DialogContentText>
        <form action="/" method="POST" onSubmit={(e) => { e.preventDefault(); setOpen(false); } } style={{padding: "10px"}}>
          <TextField label="SOL Address" value={address} onChange={(e) => setAddress(e.target.value)} id="destPubKey" type="text" autoComplete="address" required  fullWidth variant="standard"/>
          <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} id="amount" type="numeric" autoComplete="amount" required  fullWidth variant="standard"/>
          <Button type="submit" onClick={sendMoney}>Send</Button>
        </form>
      </Dialog>
    </div>
  )
}

export default WithdrawForm;