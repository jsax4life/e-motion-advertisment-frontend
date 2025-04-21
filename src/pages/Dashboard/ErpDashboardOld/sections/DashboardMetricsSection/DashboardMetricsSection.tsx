import React from "react";
import { Avatar, AvatarImage } from "../../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../../components/ui/card";

export const DashboardMetricsSection = (): JSX.Element => {
  // Billboard data for mapping
  const billboards = [
    {
      id: "0010",
      location: "Lagos Island, Lagos",
      price: "₦122,000,000",
      image: "/image-5.png",
    },
    {
      id: "0011",
      location: "Victoria Island, Lagos",
      price: "₦122,000,000",
      image: "/image-6.png",
    },
    {
      id: "0012",
      location: "Obalende, Lagos",
      price: "₦122,000,000",
      image: "/image-7.png",
    },
    {
      id: "0013",
      location: "MMIA 1, Lagos",
      price: "₦122,000,000",
      image: "/image-8.png",
    },
    {
      id: "0014",
      location: "Oshodi, Lagos",
      price: "₦122,000,000",
      image: "/image-9.png",
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      {billboards.map((billboard, index) => (
        <Card key={index} className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="flex items-start">
              <Avatar className="h-10 w-10 rounded-none">
                <AvatarImage
                  src={billboard.image}
                  alt={`Billboard ${billboard.id}`}
                />
              </Avatar>

              <div className="flex flex-1 justify-between ml-3">
                <div className="flex flex-col">
                  <span className="font-text text-neutralneutral-1100-day text-[14px] leading-[16px]">
                    Billboard {billboard.id}
                  </span>
                  <span className="font-description text-neutralneutral-400-day text-[12px] leading-[16px] mt-1">
                    {billboard.location}
                  </span>
                </div>

                <span className="font-text-bold text-neutralneutral-1100-day text-[14px] leading-[16px] text-right">
                  {billboard.price}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
