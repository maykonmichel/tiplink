import React, { FC, ReactNode, useState, useEffect } from 'react';
import { ActionStateContext } from "./useActionState";

export interface ActionStateProviderProps {
    children: ReactNode;
}

export const ActionStateProvider: FC<ActionStateProviderProps> = ({ children }) => {
    const [ actionState, setActionState ] = useState<string>("initial");
    const goBack = () => {
        const prevState = {
            initial: "initial",
            deposit: "initial"
        }[actionState];
        if(prevState !== undefined) {
            setActionState(prevState);
        }
    }

    return (
        <ActionStateContext.Provider
            value={{
                actionState,
                setActionState,
                goBack
            }}
        >
            {children}
        </ActionStateContext.Provider>
    );
};