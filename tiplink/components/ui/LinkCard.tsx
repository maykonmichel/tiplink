import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { useLink } from '../useLink';

const LinkCard = () => {
    const { balanceSOL, balanceUSD } = useLink();
    const url = window.location.href;
    return(
        <Card className="linkCard">
            <CardContent>
                <Box className="linkCardTop" sx={{display: 'flex', m: 1, justifyContent: 'space-between', alignItems: "center", width: "100%"}} >
                    <div className="solLogoCard">
                        <img src="/solanaLogoMark.png" alt="Solana Logo" />
                    </div>
                    <Typography>
                        ${balanceUSD.toFixed(2)}
                    </Typography>
                </Box>
                <Typography>{url}</Typography>
            </CardContent>
        </Card>
    );
}

export default LinkCard;