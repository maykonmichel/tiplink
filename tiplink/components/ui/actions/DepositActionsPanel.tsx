import { useState } from "react";
import ActionsPanelRow from "./ui/ActionsPanelRow";
import ActionsPanelTitleBar from "./ui/ActionsPanelTitleBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import QrModal from "../common/QrModal";
import { useActionState } from "./state/useActionState";
import { useLink } from "../../useLink";
import {
  AccountBalanceWalletRounded as IconWallet,
  QrCodeRounded as IconQRCode,
} from "@mui/icons-material";

const DepositActionsPanel = () => {
  const { goBack, setActionState } = useActionState();
  const { linkKeypair } = useLink();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box width="100%">
      <ActionsPanelTitleBar title="Deposit" backOnClick={goBack} />
      <Box>
        <ActionsPanelRow
          icon={<IconWallet />}
          title="Deposit with your wallet"
          subtitle="Deposit Solana from your connected wallet."
          onClick={() => {
            setActionState("depositWallet");
          }}/>
        <Divider />
        <ActionsPanelRow
          icon={<IconQRCode />}
          title="Deposit to this public key"
          subtitle="Click to reveal this wallet's public address that you can deposit to."
          onClick={() => {
            setOpen(true);
          }}/>
        <Divider />
      </Box>
      <QrModal
        message="Scan this QR with a Solana-compatible wallet or copy the public key below."
        open={open}
        value={linkKeypair.publicKey.toBase58()}
        handleClose={() => {
          setOpen(false);
        }}/>
    </Box>
  );
};

export default DepositActionsPanel;
