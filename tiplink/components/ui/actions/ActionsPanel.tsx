import MainActionsPanel from "./MainActionsPanel";
import DepositActionsPanel from "./DepositActionsPanel";
import DepositWalletPanel from "./DepositWalletPanel";
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
