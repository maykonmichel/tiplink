import MainActionsPanel from "./MainActionsPanel";
import DepositActionsPanel from "./DepositActionsPanel";
import DepositWalletPanel from "./DepositWalletPanel";
import SendActionsPanel from "./SendActionsPanel";
import SendPublicKey from "./SendPublicKey";
import CreateTipLink from "./CreateTipLink";
import WithdrawWallet from "./WithdrawWallet";
import { ActionStateProvider } from "./state/ActionStateProvider";
import { useActionState } from "./state/useActionState";

const ActionsPanelComponent = () => {
  const { actionState } = useActionState();
  return (
    <div style={{width: '100%'}}>
      {
        {
          initial: <MainActionsPanel />,
          deposit: <DepositActionsPanel />,
          depositWallet: <DepositWalletPanel />,
          send: <SendActionsPanel/>,
          sendPubKey: <SendPublicKey/>,
          createTipLink: <CreateTipLink/>,
          withdrawWallet: <WithdrawWallet/>
        }[actionState]
      }
    </div>
  );
};

const ActionsPanel = () => {
  return (
    <ActionStateProvider>
      <ActionsPanelComponent />
    </ActionStateProvider>
  );
};

export default ActionsPanel;
