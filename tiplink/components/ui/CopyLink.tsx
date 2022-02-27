import { useState, useEffect } from "react";
import ContentCopy from '@mui/icons-material/ContentCopy';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Avatar from "@mui/material/Avatar";

const CopyLink = () => {
    const [ url, setUrl ] = useState("");

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return(
        <Box sx={{display: 'flex', m: 1, justifyContent: 'space-between', alignItems: "center", width: "100%"}} >
            <TextField 
                className="inputRounded" 
                value={url} 
                disabled={true} 
                margin="normal"
                variant="filled"
                style={{ width: "90%" }}
                inputProps={{style: {fontFamily: "Courier New", fontWeight: "bold"}}}
            >{url}</TextField>
            <Avatar onClick={() =>  navigator.clipboard.writeText(url)}>
                <ContentCopy/>
            </Avatar>
            {/* <Avatar>
                <Bookmark/>
            </Avatar> */}
        </Box>
    );
};

export default CopyLink;