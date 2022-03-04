import { MouseEvent } from "react";
import Button from '@mui/material/Button';
import { useLink } from '../useLink';

const WithdrawToPhantom = () => {
  const { sendSOL, getFees, balanceSOL, extConnected, extPublicKey } = useLink();
  const sendMoney = async (event: MouseEvent<HTMLButtonElement> )=> {
    event.preventDefault()
    if(!extConnected) { 
        alert("Please connect Phantom to withdraw money");
        return;
    } 

    if((extPublicKey === null) || (extPublicKey === undefined)){
        alert("Please connect Phantom to withdraw money");
        return;
    }
    const fees = await getFees();
    await sendSOL(extPublicKey, balanceSOL - fees);
  }


  return (
    <div>
      <Button variant="outlined" onClick={sendMoney}>Withdraw to Phantom</Button>
    </div>
  )
}

export default WithdrawToPhantom;
