import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
  return (
    <Card
      className="linkCard"
      style={{
        width: "32rem",
        height: "18rem",
        borderRadius: "0.5rem",
        justifyContent: "center",
        background: "#e8f5e9",
      }}
      raised={true}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1.5rem",
          textAlign: "center",
        }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}>
          <Box
            sx={{
              display: "flex",
              flexGrow: "1",
              flexBasis: "0",
            }}>
            <div
              style={{
                display: "flex",
                borderRadius: "50%",
                backgroundColor: "black",
                textAlign: "center",
                width: "4rem",
                height: "4rem",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <img
                src="/solanaLogoMark.png"
                alt="Solana Logo"
                width="60%"
                height="60%"
                style={{ top: 0, left: 0 }}/>
            </div>
          </Box>
          <Box
            sx={{
              flexGrow: "1",
              flexBasis: "0",
              textAlign: "right",
            }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h4">${balanceUSD.toFixed(2)}</Typography>
              <Typography>{balanceSOL.toFixed(4)} SOL</Typography>
            </div>
          </Box>
        </Box>
        <Typography
          style={{
            marginTop: "4rem",
            fontFamily: "Courier",
            fontWeight: "bold",
          }}>
          {cdt}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
