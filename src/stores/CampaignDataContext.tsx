/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer, useEffect, useContext } from 'react';

export const PullCampaignContext = createContext<ApContext>({});

const pullCampaignReducer = (state: any, action: { type: any; campaign: any }) => {
    switch (action.type) {
        case 'STORE_CAMPAIGN_DATA': {
            return action.campaign;
        }
        default:
            return state;
    }
};

const CampaignContextProvider = (props: {
    children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
}) => {
    const [campaigns, campaignDispatch] = useReducer(pullCampaignReducer, [], () => {
        
        const localData = localStorage.getItem('campaigns');
        return localData ? JSON.parse(localData) : [];
    });


    useEffect(() => {
        localStorage.setItem('campaigns', JSON.stringify(campaigns));
    }, [campaigns]);

    return <PullCampaignContext.Provider value={{ campaigns, campaignDispatch }}>{props.children}</PullCampaignContext.Provider>;
};
interface ApContext {
    campaigns?: any;
    campaignDispatch?: any;
}

export default CampaignContextProvider;
