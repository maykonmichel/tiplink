import React, { FC, ReactNode, useState } from "react";
import  { Cluster, clusterApiUrl } from '@solana/web3.js';
import { EndpointContext } from "./useEndpoint";
import { useEffect } from "react";

export interface EndpointProviderProps {
    children: ReactNode;
};

export const EndpointProvider  : FC<EndpointProviderProps> = ({ children }) => {
    const endpointKey = "tiplink-endpoint";
    const endpointDefault = "mainnet-beta";

    const checkEndpoint = (endpoint: string | null) => {
        if ((endpoint === "devnet") || (endpoint == "testnet") || (endpoint == "mainnet-beta")) {
            const cluster: Cluster = endpoint;
            return cluster;
        }
        return null;
    }

    const localEndpoint = checkEndpoint(localStorage.getItem(endpointKey));
    const [endpoint, setEndpoint] = useState<Cluster>(localEndpoint === null ? endpointDefault : localEndpoint);
    

    const setEndpointStr = (endpoint: string | null) => {
        const cluster = checkEndpoint(endpoint);
        if(cluster === null) {
            return false;
        }
        setEndpoint(cluster);
        localStorage.setItem(endpointKey, cluster);
        return true;
    }

    useEffect(() => {
        const localEndpoint = localStorage.getItem(endpointKey);
        const success = setEndpointStr(localEndpoint);
        if(!success) {
            localStorage.setItem(endpointKey, endpointDefault);
            setEndpoint(endpointDefault);
        }
    }, [endpoint]);


    return (
        <EndpointContext.Provider
            value={{
                endpoint,
                setEndpointStr
            }}
        >
            {children}
        </EndpointContext.Provider>

    );
};