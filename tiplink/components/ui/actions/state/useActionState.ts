import { createContext, useContext } from "react";

type ActionStateContent = {
    actionState: string;
    setActionState(state: string): void;
    goBack(): void;
    sendAmount: number;
    setSendAmount(n: number): void;
};
export const ActionStateContext = createContext<ActionStateContent>(undefined!);
export const useActionState = () => useContext(ActionStateContext);
