import { useState, MouseEvent } from "react";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import { useLink } from '../useLink';
import { createLink } from "../../lib/link";

const CreateLinkForm = () => {
  // TODO check-list to use pre-existing balance
  const { linkKeypair, sendSOL, getFees, getBalanceSOL } = useLink();
  const [ amount, setAmount ] = useState("");
  const [ newLink, setNewLink ] = useState("");

  const createNewTipLink = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const fees = await getFees();
    const balance = await getBalanceSOL();
    const amt = parseFloat(amount) + fees;
    if(amt > balance) {
      alert("Cannot withdraw " + amt + ", please add more funds to tiplink");
      return;
    }

    const { slug, anchor, keypair } = await createLink();
    const newLink = window.location.origin + "/" + slug + "#" + anchor;
    setNewLink(newLink);

    await sendSOL(keypair.publicKey, amt);
  }

  // should this store this history of whatever links we've created in the past?
  return(
    <div>
      <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} id="newLinkAmt" type="numeric" autoComplete="amount" required  fullWidth variant="standard"/>
      <Button variant="outlined" onClick={createNewTipLink}>Create Link</Button>
      <TextField label="New Link" value={newLink} fullWidth variant="standard"/>
    </div>
  );
}

export default CreateLinkForm;