import { MoreVerticalIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../../../components/ui/card";
import { Separator } from "../../../../../components/ui/separator";

export const TopPerformingBillboardsSection = (): JSX.Element => {
  // Campaign data for mapping
  const campaigns = [
    {
      id: 1,
      name: "Campaign Name",
      amount: "₦122,000,000",
      image: "/image-10.png",
    },
    {
      id: 2,
      name: "Campaign Name",
      amount: "₦122,000,000",
      image: "/image-11.png",
    },
    {
      id: 3,
      name: "Campaign Name",
      amount: "₦122,000,000",
      image: "/image-12.png",
    },
    {
      id: 4,
      name: "Campaign Name",
      amount: "₦122,000,000",
      image: "/image-13.png",
    },
    {
      id: 5,
      name: "Campaign Name",
      amount: "₦122,000,000",
      image: "/image-14.png",
    },
  ];

  return (
    <Card className="flex flex-col w-full md:w-[364px] rounded-2xl">
      <CardHeader className="px-6 py-4 pb-0 flex flex-row items-center justify-between">
        <h3 className="font-['Poppins',Helvetica] font-semibold text-neutralneutral-500-day text-xs tracking-[0] leading-4">
          Top Campaigns
        </h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
          <MoreVerticalIcon className="h-4 w-4 text-neutralneutral-400-day" />
        </Button>
      </CardHeader>
      <Separator className="mt-2.5" />
      <CardContent className="p-6 pt-5 space-y-5">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-10 h-10 overflow-hidden rounded-sm">
                <img
                  className="w-10 h-10 object-cover"
                  alt="Campaign thumbnail"
                  src={campaign.image}
                />
              </div>
              <span className="ml-3 font-text text-neutralneutral-1100-day text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)]">
                {campaign.name}
              </span>
            </div>
            <span className="font-text-bold text-neutralneutral-1100-day text-right text-[length:var(--text-bold-font-size)] tracking-[var(--text-bold-letter-spacing)] leading-[var(--text-bold-line-height)]">
              {campaign.amount}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
