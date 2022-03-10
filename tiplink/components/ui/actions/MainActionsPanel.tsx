import ActionsPanelRow from "./ui/ActionsPanelRow";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DualCtaRow from "./ui/DualCtaRow";
import {
  Refresh as IconRecreate,
  AccountBalanceWalletRounded as IconWallet,
} from "@mui/icons-material";
import { useActionState } from "./state/useActionState";

const MainActionsPanel = () => {
  const { setActionState } = useActionState();
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
        />
        <Divider />
      </Box>
    </Box>
  );
};

export default MainActionsPanel;
