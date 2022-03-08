import MainActions from "./MainActions";
import DepositActions from "./DepositActions";
import DepositWallet from "./DepositWallet";
import { ActionStateProvider } from "./ActionStateProvider";
import { useActionState } from "./useActionState";

const ActionPanelComponent = () => {
  const { actionState } = useActionState();
  return (
    <div style={{width: '100%'}}>
      {
        {
          initial: <MainActions />,
          deposit: <DepositActions />,
          depositWallet: <DepositWallet />,
        }[actionState]
      }
    </div>
  );
};

const ActionPanel = () => {
  return (
    <ActionStateProvider>
      <ActionPanelComponent />
    </ActionStateProvider>
  );
};

export default ActionPanel;
