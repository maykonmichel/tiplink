import ActionsPanelRow from "./ui/ActionsPanelRow";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DualCtaRow from "./ui/DualCtaRow";
import {
  Refresh as IconRecreate,
  AccountBalanceWalletRounded as IconWallet,
} from "@mui/icons-material";
import { useActionState } from "./state/useActionState";
import { useLink } from "../../useLink";

const MainActionsPanel = () => {
  const { setActionState } = useActionState();
  const { sendSOL, getFees, balanceSOL, extPublicKey, extConnected } = useLink();

  const withdrawAll = ()=> {
    if(!extConnected) { 
        alert("Please connect Phantom to withdraw money");
        return;
    } 

    if((extPublicKey === null) || (extPublicKey === undefined)){
        alert("Please connect Phantom to withdraw money");
        return;
    }
    let fees: number;

    const onFees = (f: number) =>  {
      fees = f;
      sendSOL(extPublicKey, balanceSOL - fees).catch(e => alert(e.message));
    }

    getFees().then(onFees).catch(e => alert(e.message));
  }


  return (
    <Box width="100%">
      <DualCtaRow
        cta1Label="Send"
        cta2Label="Deposit"
        cta1OnClick={() => {
          setActionState("send");
        }}
        cta2OnClick={() => {
          setActionState("deposit");
        }}
      />
      <Box>
        <Divider />
        <ActionsPanelRow
          icon={<IconRecreate />}
          title="Recreate this TipLink"
          subtitle="Move the entire value to a new TipLink so only you have the link."
        />
        <Divider />
        <ActionsPanelRow
          icon={<IconWallet />}
          title="Withdraw to your wallet"
          subtitle="Withdraw the entire value of this TipLink."
          onClick={withdrawAll}
        />
        <Divider />
      </Box>
    </Box>
  );
};

export default MainActionsPanel;
