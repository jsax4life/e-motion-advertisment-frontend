/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, useEffect, useContext } from 'react';

export const PullBillboardContext = createContext<ApContext>({});

const pullBillboardReducer = (state: any, action: { type: any; billboard: any }) => {
    switch (action.type) {
        case 'STORE_BILLBOARD_DATA': {
            return action.billboard;
        }
        default:
            return state;
    }
};

const BillboardContextProvider = (props: {
    children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
}) => {
    const [billboards, billboardDispatch] = useReducer(pullBillboardReducer, [], () => {
        
        const localData = localStorage.getItem('billboards');
        return localData ? JSON.parse(localData) : [];
    });


    useEffect(() => {
        localStorage.setItem('billboards', JSON.stringify(billboards));
    }, [billboards]);

    return <PullBillboardContext.Provider value={{ billboards, billboardDispatch }}>{props.children}</PullBillboardContext.Provider>;
};
interface ApContext {
    billboards?: any;
    billboardDispatch?: any;
}

export default BillboardContextProvider;
