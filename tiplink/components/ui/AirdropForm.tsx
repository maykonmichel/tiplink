import { useLink } from "../useLink";
import { MouseEvent } from "react";
import Button from '@mui/material/Button';

export const AirdropForm = () => {
  const { airdrop } = useLink();
  const requestDrop = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // you get errors if you request more than 1 SOL sometimes
    const amt = 1;
    return await airdrop(amt);
  }
  return (
      <Button variant="outlined" type="submit" onClick={requestDrop}>Request Airdrop</Button>
  )
}
