import React, { FC, ReactNode, useState, useEffect } from 'react';
import { createContext, useContext } from "react";

type ExchangeRateContent = {
    exchangeRate: number;
};
export const ExchangeRateContext = createContext<ExchangeRateContent>(undefined!);
const useExchangeRate = () => useContext(ExchangeRateContext);

export interface ExchangeRateProviderProps {
    children: ReactNode;
}

const getPrice = async () => {
  const endpoint = "https://serum-api.bonfida.com/orderbooks/SOLUSDC";
  const resp = await fetch(endpoint);
  const content = await resp.json();
  const book = content.data;
  const bid = book.bids[0].price;
  const ask = book.asks[0].price;
  return (bid + ask) / 2;
}


export const ExchangeRateProvider: FC<ExchangeRateProviderProps> = ({ children }) => {
    // in USD / SOL
    const [ exchangeRate, setExchangeRate ] = useState(NaN);

    useEffect(() => {
        getPrice().then((apiPrice) => setExchangeRate(apiPrice));
    }, []);

    return (
        <ExchangeRateContext.Provider
            value={{
                exchangeRate
            }}
        >
            {children}
        </ExchangeRateContext.Provider>
    );
};

export default useExchangeRate;