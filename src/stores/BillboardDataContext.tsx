/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, useEffect, useContext } from 'react';

export const PullBillboardContext = createContext<ApContext>({});

const pullBillboardReducer = (state: any, action: { type: any; billboard: any; payload: any; }) => {
    switch (action.type) {
        case 'STORE_BILLBOARD_DATA': {
            return action.billboard;
        }
        case 'ADD_BILLBOARD': {
            // Check if billboard already exists to avoid duplicates
            const existingIndex = state.findIndex((billboard: any) => billboard.id === action.payload.id);
            if (existingIndex !== -1) {
                // Update existing billboard
                const updatedBillboards = [...state];
                updatedBillboards[existingIndex] = action.payload;
                return updatedBillboards;
            }
            // Add new billboard
            const updatedBillboards = [...state, action.payload];
            return updatedBillboards;
        }
        case 'UPDATE_BILLBOARD': {
            const updatedBillboards = state.map((billboard: any) => 
                billboard.id === action.payload.id ? { ...billboard, ...action.payload } : billboard
            );
            return updatedBillboards;
        }
        case 'DELETE_BILLBOARD': {
            const updatedBillboards = state.filter((billboard: any) => billboard.id !== action.payload);
            return updatedBillboards;
        }
        case 'MERGE_BILLBOARDS': {
            // Merge new billboards with existing ones, avoiding duplicates
            const existingIds = state.map((billboard: any) => billboard.id);
            const newBillboards = action.billboard.filter((billboard: any) => !existingIds.includes(billboard.id));
            return [...state, ...newBillboards];
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
