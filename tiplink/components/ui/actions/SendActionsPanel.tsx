import ActionsPanelRow from "./ui/ActionsPanelRow";
import ActionsPanelTitleBar from "./ui/ActionsPanelTitleBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { WalletIcon } from "@solana/wallet-adapter-react-ui";
import { useActionState } from "./state/useActionState";
import {
  AccountBalanceWalletRounded as IconWallet,
  Key as IconKey,
  Link as IconLink
} from "@mui/icons-material";
import { useWallet } from "@solana/wallet-adapter-react";

const SendActionsPanel = () => {
  const { goBack, setActionState } = useActionState();
  const { wallet, connected } = useWallet();

  return (
    <Box width="100%">
      <ActionsPanelTitleBar title="Send" backOnClick={goBack} />
      <Box style={{textAlign: "center"}}>
        <ActionsPanelRow
          icon={<IconLink />}
          title="Send as TipLink"
          subtitle="Create a TipLink with this value that you can share with anyone"
          onClick={() => {
            setActionState("createTipLink");
          }}/>
        <Divider />
        <ActionsPanelRow
          icon={<IconKey/>}
          title="Send to Public Key"
          subtitle="Send to a Solana wallet address"
          onClick={() => {setActionState("sendPubKey");}}/>
        <Divider />
        <ActionsPanelRow
          icon={connected ? <WalletIcon wallet={wallet}/> : <IconWallet/>}
          title="Withdraw to Wallet"
          subtitle={connected ? "Withdraw to connected wallet" : "Connect Wallet to Withdraw"}
          onClick={() => {
            if(!connected) {
              alert("Please connect wallet to withdraw.");
              return;
            }
            setActionState("withdrawWallet")
          }}/>
        <Divider />
        <br></br>
        <Typography>You'll choose amount to send next.</Typography>
      </Box>
    </Box>
  );
};

export default SendActionsPanel;
