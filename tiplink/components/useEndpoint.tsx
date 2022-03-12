import  { Cluster } from '@solana/web3.js';
import React, { createContext, useContext } from "react";
type EndpointContent = {
    endpoint: Cluster;
    setEndpointStr(endpoint: string | null): boolean
    endpointUrl: string;
}
export const EndpointContext = createContext<EndpointContent>(undefined!);
export const useEndpoint = () => useContext(EndpointContext);
