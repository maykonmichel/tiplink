import { useState, useEffect } from "react";
import ContentCopy from '@mui/icons-material/ContentCopy';
import Bookmark from '@mui/icons-material/Bookmark';
import QrCode from '@mui/icons-material/QrCode';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";

const CopyLink = () => {
    const [ url, setUrl ] = useState("");

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return(
        <div style={{ textAlign: "center", width: "50rem"}}>
            <TextField 
                className="inputRounded" 
                value={url} 
                disabled={true} 
                margin="normal"
                variant="filled"
                style={{width: "100%"}}
                inputProps={{style: {fontFamily: "Courier New", fontWeight: "bold"}}}
            >{url}</TextField>
            <Box sx={{display: 'flex', m: 1, justifyContent: 'space-around', alignItems: "center", width: "100%"}} >
                <Button 
                    style={{flexDirection: "column"}}
                    variant="contained" 
                    fullWidth 
                    onClick={() =>  navigator.clipboard.writeText(url)}>
                    <ContentCopy/>
                    Copy
                </Button>
                <Button 
                    style={{flexDirection: "column", marginLeft: "1rem"}}
                     variant="contained" fullWidth
                >
                    <Bookmark/>
                    Bookmark
                </Button>
                <Button variant="contained" fullWidth style={{flexDirection: "column", marginLeft: "1rem"}}>  
                    <QrCode/>
                    QR Code
                </Button>
            </Box>
            {/* <Avatar>
                <Bookmark/>
            </Avatar> */}
        </div>
    );
};

export default CopyLink;