/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, useEffect, useContext } from 'react';

export const PullClientContext = createContext<ApContext>({});

const pullClientReducer = (state: any, action: { type: any; client: any }) => {
    switch (action.type) {
        case 'STORE_CLIENT_DATA': {
            return action.client;
        }
        default:
            return state;
    }
};

const ClientContextProvider = (props: {
    children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
}) => {
    const [clients, clientDispatch] = useReducer(pullClientReducer, [], () => {
        
        const localData = localStorage.getItem('clients');
        return localData ? JSON.parse(localData) : [];
    });


    useEffect(() => {
        localStorage.setItem('clients', JSON.stringify(clients));
    }, [clients]);

    return <PullClientContext.Provider value={{ clients, clientDispatch }}>{props.children}</PullClientContext.Provider>;
};
interface ApContext {
    clients?: any;
    clientDispatch?: any;
}

export default ClientContextProvider;
