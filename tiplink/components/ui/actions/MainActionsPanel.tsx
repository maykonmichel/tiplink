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
import { DEFAULT_TIPLINK_KEYLENGTH, SEED_LENGTH, randBuf, kdfz} from "../../../lib/crypto";
import { Keypair } from "@solana/web3.js";
import Router from "next/router";
import { useState } from 'react';
import { getLinkPath } from "../../../lib/link";

const MainActionsPanel = () => {
  const { setActionState } = useActionState();
  const { sendSOL, getFees, balanceSOL, extPublicKey, extConnected, scheduleBalanceUpdate} = useLink();
  const [ recreateLoading, setRecreateLoading ] = useState<boolean>(false);
  const [ withdrawLoading, setWithdrawLoading ] = useState<boolean>(false);

  const withdrawAll = ()=> {
    if(!extConnected) { 
        alert("Please connect Phantom to withdraw money");
        return;
    } 

    if((extPublicKey === null) || (extPublicKey === undefined)){
        alert("Please connect Phantom to withdraw money");
        return;
    }

    if(balanceSOL < 0.00001) {
      alert("Wallet is empty, cannot withdraw.")
      return;
    }
    setWithdrawLoading(true);

    let fees: number;

    const onFees = (f: number) =>  {
      fees = f;
      sendSOL(extPublicKey, balanceSOL - fees).then(() => setWithdrawLoading(false)).
      catch(e => {alert(e.message); setWithdrawLoading(false);});
    }
    getFees().then(onFees).catch(e => {alert(e.message); setWithdrawLoading(false);});
    scheduleBalanceUpdate(10);
  }

  const recreate = () => {
    setRecreateLoading(true);
    // TODO refactor
    randBuf(DEFAULT_TIPLINK_KEYLENGTH).then((b) => {
      kdfz(SEED_LENGTH, b).then((seed: Buffer) => {
        const kp = Keypair.fromSeed(seed);
        getFees().then((fees) => {
          sendSOL(kp.publicKey, balanceSOL - fees).then(() => {
            Router.push(getLinkPath(b));
            window.location.reload();
          }).catch(e => alert(e.message));
        }).catch(e => alert("Error getting fees: " + e.message));
      }).catch(e => alert("Error sending transaction: " + e.message));
    }).finally(() => {
      // setRecreateLoading(false);
    });
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
          loading={recreateLoading}
          onClick={recreate}
        />
        <Divider />
        <ActionsPanelRow
          icon={<IconWallet />}
          title="Withdraw to your wallet"
          subtitle="Withdraw the entire value of this TipLink."
          loading={withdrawLoading}
          onClick={withdrawAll}
        />
        <Divider />
      </Box>
    </Box>
  );
};

export default MainActionsPanel;
