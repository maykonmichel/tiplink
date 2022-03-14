import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const Progress = () => {
    return(
      <Box style={{display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center"}}>
        <CircularProgress size={"7rem"} style={{marginTop: "5rem"}}/>
      </Box>
    );
}

export default Progress;