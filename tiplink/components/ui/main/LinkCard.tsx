import Typography from "@mui/material/Typography";
import { useLink } from "../../useLink";

const LinkCard = () => {
  const { linkKeypair, balanceSOL, balanceUSD } = useLink();
  const getCardDisplayText = () => {
    const url = window.location.href;
    if (url.search("wallet") != -1) {
      return linkKeypair.publicKey.toBase58();
    }
    return window.location.pathname.substr(1) + window.location.hash;
  };

  const cdt = getCardDisplayText();

  return(
    <div className="linkCard">
      <img src="/tiplink-card.png"/>
      <div className="cardBalance">
        <Typography color="magenta">{balanceSOL.toFixed(4)} SOL</Typography>
        <Typography className="balanceUSD" variant="h3">${balanceUSD.toFixed(2)}</Typography>
      </div>
      <div className="cardIdentifier">
        <Typography className="cardIdText">{cdt}</Typography>
      </div>
    </div>
  );
};

export default LinkCard;
