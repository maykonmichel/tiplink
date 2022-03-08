import ActionsPanelRow from "../ActionsPanelRow";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DualCtaRow from "../DualCtaRow";
import {
  Refresh as IconRecreate,
  MergeRounded as IconCombine,
  AccountBalanceWalletRounded as IconWallet,
} from "@mui/icons-material";
import { useActionState } from "./useActionState";

const MainActions = () => {
  const { setActionState } = useActionState();
  return (
    <Box width="100%">
      <DualCtaRow
        cta1Label="Send"
        cta2Label="Deposit"
        cta1OnClick={() => {}}
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
          icon={<IconCombine />}
          title="Combine with another TipLink"
          subtitle="You can combine some or all of another TipLink's value into this TipLink."
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

export default MainActions;
