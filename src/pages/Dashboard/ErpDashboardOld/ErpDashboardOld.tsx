import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { BillboardOverviewSection } from "./sections/BillboardOverviewSection";

import AnalyticsCard from "../AnalyticsCard";
import { formatCurrency } from "../../../utils/utils";


type BillboardItem = {
  occupied_billboards: any ;
  postpaid: any ;
  total_billboard_space: any;
  upfront: any ;
  vacant_billboard_space: any;
  total_digital_billboard_available: any;
  total_static_billboard_available: any;

  total_static_billboard_occupied: any;
  total_static_billboard_vacant: any;

  total_digital_billboard_occupied: any;
  total_digital_billboard_vacant: any;

  total_revenue: any,
  occupancy_percentage: any,
  // Add any other optional fields that might be needed
}

type Props = {
  itemData: BillboardItem;
  top_clients: [];
  top_billboards: [];
  top_campaigns: [];
}

export const ErpDashboardOld = ({ top_clients, top_billboards, top_campaigns, itemData }: Props): JSX.Element => {
  // Data for the card headers
  const cardHeaders = [
    { title: "Top Clients" },
    { title: "Top Performing Billboards" },
  ];

  return (
    <div className="col-span-12 items-start bg-neutralneutral-100-day flex flex-row justify-center w-full">
      <div className="bg-neutralneutral-100-day w-full relative">
      

          {/* Billboard Overview Section */}
          <div className="flex flex-col gap-6 w-full">
            <BillboardOverviewSection totalBillboardSpace={itemData.total_billboard_space} totaldBillboardOccupied={itemData.occupied_billboards} totalBillboardVacant={itemData.vacant_billboard_space} totalStaticOccupied={itemData.total_static_billboard_occupied}  totalDigitalOccupied={itemData.total_digital_billboard_occupied} totalStaticVacant={itemData.total_static_billboard_vacant}  totalDigitalVacant={itemData.total_digital_billboard_vacant} postpaid={itemData.postpaid}  totalRevenue={itemData.total_revenue} upfront={itemData.upfront}  occupancyPercentage={itemData.occupancy_percentage}  totalDigitalAvailable={itemData.total_digital_billboard_available} totalStaticAvailable={itemData.total_static_billboard_available} />

            {/* Three Column Layout */}
          

                 <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 intro-y">
                

<AnalyticsCard
  title="Top Clients"
  itemData={top_clients?.map((client: { id: any; company_name: any; logo: any; total_spent: any; campaign_order_count: any; }) => ({
    id: client.id,
    name: client.company_name,
    image: client.logo,
    value: `₦${formatCurrency(client.total_spent)}`,
    secondaryValue: `${client.campaign_order_count}`,
  }))}
  valueLabel="Total spent"
  secondaryValueLabel="Campaigns"
/>

<AnalyticsCard
  title="Top Billboards"
  itemData={top_billboards?.map((billboard: { id: any; billboard: { billboardName: any; pricePerMonth: any; presigned_picture_urls:any }; usage_count: any; } ) => ({
    id: billboard.id,
    name: billboard.billboard.billboardName,
    value: `₦${formatCurrency (billboard.billboard.pricePerMonth)} `,
    secondaryValue: `${billboard.usage_count}`,
    image: billboard.billboard.presigned_picture_urls?.[0]
  }))}
  valueLabel="Impressions"
  secondaryValueLabel="Usage"
/>

<AnalyticsCard
  title="Top Campaigns"
  itemData={top_campaigns?.map((campaign: { id: any; campaign_name: any; presigned_image_url: any; total_order_amount: any; ctr: any; }) => ({
    id: campaign.id,
    name: campaign.campaign_name,
    image: campaign?.presigned_image_url?.[0],
    value: `₦${formatCurrency(campaign.total_order_amount)}`,
    secondaryValue: ``,
  }))}
  valueLabel="Conversions"
  secondaryValueLabel=""
/>

      </div> 



          </div>
        {/* </div> */}

        
      </div>
    </div>
  );
};
