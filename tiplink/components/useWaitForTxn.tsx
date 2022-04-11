// When we create a new link, we want to redirect the user to their TipLink
// before we actually send it to RPC endpoint, just in case SOL is slow
// This context allows you to store a pending Txn
import { createContext, useContext, FC, useState, ReactNode } from "react";
type TxnContent = {
    pendingTxn: Buffer | null;
    setPendingTxn(pendingTxn: Buffer | null): void;
};
export const TxnContext = createContext<TxnContent>(undefined!);
export const useWaitForTxn = () => useContext(TxnContext);
export interface TxnProviderProps {
    children: ReactNode;
}

export const TxnProvider: FC<TxnProviderProps> = ({ children} : TxnProviderProps) => {
    const [ pendingTxn, setPendingTxn ] = useState<Buffer | null>(null);
    return (
        <TxnContext.Provider
            value={{
                pendingTxn,
                setPendingTxn
            }}
        >
            {children}
        </TxnContext.Provider>
    );
};
