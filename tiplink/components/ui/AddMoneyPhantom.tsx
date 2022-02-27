import { useState, MouseEvent } from "react";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useLink } from '../useLink';

const AddMoneyPhantom = () => {
  const { deposit, extConnected } = useLink();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleClose = () => {
    setOpen(false);
  }

  const sendMoney = async (event: MouseEvent<HTMLButtonElement>) => {
    //get the token account of the toWallet Solana address, if it does not exist, create it
    handleClose();
    event.preventDefault()
    await deposit(parseFloat(amount));
  }
  

  const handleOpen = () => { 
    if(!extConnected) {
      alert("Please connect Phantom to deposit, or send SOL directly to public key.");
      return;
    }
    setOpen(true); 
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>Deposit from Phantom</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
        Deposit
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
        <DialogContentText>Enter an amount to add from Phantom wallet</DialogContentText>
        <form action="/" method="POST" onSubmit={(e) => { e.preventDefault(); handleClose(); } } style={{padding: "10px"}}>
          <TextField label="Amount" value={amount} onChange={e => setAmount(e.target.value)} id="amount" 
          type="numeric" autoComplete="amount" required  fullWidth variant="standard"/>
          <Button type="submit" onClick={sendMoney}>Deposit</Button>
        </form>
      </Dialog>
    </div>
  )
}

export default AddMoneyPhantom;