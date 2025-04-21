import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../../components/ui/card";

export const ClientsAndBillboardsSection = (): JSX.Element => {
  // Client data array for mapping
  const clientsData = [
    {
      id: 1,
      name: "Maltina",
      amount: "₦122,000,000",
      campaigns: "125 campaigns",
      image: "/image.png",
    },
    {
      id: 2,
      name: "MTN",
      amount: "₦122,000,000",
      campaigns: "102 campaigns",
      image: "/image-1.png",
    },
    {
      id: 3,
      name: "Samsung Nigeria",
      amount: "₦122,000,000",
      campaigns: "98 campaigns",
      image: "/image-2.png",
    },
    {
      id: 4,
      name: "Nigerian Breweries",
      amount: "₦122,000,000",
      campaigns: "45 campaigns",
      image: "/image-3.png",
    },
    {
      id: 5,
      name: "Airtel Nigeria",
      amount: "₦122,000,000",
      campaigns: "30 campaigns",
      image: "/image-4.png",
    },
  ];

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-col gap-5">
          {clientsData.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={client.image} alt={`${client.name} logo`} />
                  <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-text text-neutralneutral-1100-day text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)]">
                  {client.name}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-text-bold text-neutralneutral-1100-day text-[length:var(--text-bold-font-size)] text-right tracking-[var(--text-bold-letter-spacing)] leading-[var(--text-bold-line-height)]">
                  {client.amount}
                </span>
                <span className="font-description text-neutralneutral-400-day text-[length:var(--description-font-size)] text-right tracking-[var(--description-letter-spacing)] leading-[var(--description-line-height)]">
                  {client.campaigns}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
