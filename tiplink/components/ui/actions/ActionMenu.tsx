import DefaultActions from './DefaultActions';
import DepositActions from "./DepositActions";
import { ActionStateProvider } from './ActionStateProvider';
import { useActionState } from "./useActionState";

const ActionMenuDisplay = () => {
    const { actionState } = useActionState();
    return(
        <div>
            {
                {
                    'initial': <DefaultActions/>,
                    'deposit': <DepositActions/>
                }[actionState]
            }
        </div>
    );
}


const ActionMenu = () => {
    return(
        <ActionStateProvider>
            <ActionMenuDisplay/>
        </ActionStateProvider>
    );
}

export default ActionMenu;