import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { useLink } from '../useLink';

const LinkCard = () => {
    const { linkKeypair, balanceSOL, balanceUSD } = useLink();
    const getCardDisplayText = () => {
        const url = window.location.href;
        if(url.search("wallet") != -1) {
            return linkKeypair.publicKey.toBase58();
        } 
        return window.location.pathname.substr(1) + window.location.hash;
    }

    const cdt = getCardDisplayText();
    return(
        <Card className="linkCard" style={{width: "32rem", height: "20rem", borderRadius: "0.5rem", justifyContent: "center"}} raised={true}>
            <CardContent sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "center"}}>
                <Box className="linkCardTop" sx={{display: 'flex', m: 1, justifyContent: 'space-between', alignItems: "center", width: "100%"}} >
                    <div style={{display: "flex", borderRadius: "50%", backgroundColor: "black", textAlign: "center", width: "5rem", height: "5rem", justifyContent: "center", alignItems: "center"}}>
                        <img src="/solanaLogoMark.png" alt="Solana Logo" width="60%" height="60%" style={{top: 0, left: 0}}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Typography variant="h4"> ${balanceUSD.toFixed(2)} </Typography>
                        <Typography > {balanceSOL.toFixed(4)} SOL</Typography>
                    </div>
                </Box>
                <Typography style={{fontFamily: "Courier", fontWeight: "bold"}}>{cdt}</Typography>
            </CardContent>
        </Card>
    );
}

export default LinkCard;