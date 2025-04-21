import { ShoppingBagIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../../components/ui/card";
import { formatCurrency } from "../../../../../utils/utils";


type items = {
 
  totalRevenue: number ,
  upfront: number ,
  postpaid: number ,
  totalBillboardSpace: number | string,
  occupiedBillboards: number | string,
  vacantBillboardSpace: number | string,
  occupancyPercentage: number,

}


export const BillboardOverviewSection = ({totalRevenue, upfront, postpaid, totalBillboardSpace, occupiedBillboards, vacantBillboardSpace, occupancyPercentage}: items): JSX.Element => {
  // Data for revenue cards
  const revenueCards = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      bgColor: "bg-green-400",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },
    {
      title: "Upfront",
      value: upfront,
      bgColor: "bg-[#2774ff]",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },
    {
      title: "Postpaid",
      value: postpaid,
      bgColor: "bg-[#7747c9]",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },

  ];

  // Data for billboard space cards
  const spaceCards = [
    {
      title: "Total Billboard Space",
      value: totalBillboardSpace,
      bgColor: "bg-[#80b7fb]",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },
    {
      title: "Occupied Billboard Space",
      value: occupiedBillboards,
      bgColor: "bg-[#f3bcfd]",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },
    {
      title: "Vacant Billboard Space",
      value: vacantBillboardSpace,
      bgColor: "bg-[#ff9500]",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },
  ];

  return (
    <div className="grid grid-cols-12 justify-start space-x-6 items-start   ">
      
      <div className=" col-span-12 intro-y lg:col-span-8 flex">
        {/* Revenue Cards Row */}
        <div className="grid grid-cols-12   lg:mt-0    gap-6">
          {revenueCards.map((card, index) => (
            <Card
              key={`revenue-${index}`}
              className="col-span-12 cursor-pointer sm:col-span-4  bg-white border-[#e8edf2]"
            >
              <CardContent className="p-4 flex flex-col gap-2.5 h-[111px] justify-center">
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={`relative w-[32.16px] h-[32.16px] ${card.bgColor} rounded-[8.04px] flex items-center justify-center`}
                  >
                    {card.icon}
                  </div>
                  <div className="font-semibold text-neutralneutral-500-day text-xs leading-4 ">
                    {card.title}
                  </div>
                </div>
                <div className="flex items-center justify-end w-full">
                  <div className="font-medium text-xl tracking-[-0.21px] leading-[28.1px] text-neutralneutral-1100-day text-right">
                    ₦{formatCurrency(card.value)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

{spaceCards.map((card, index) => (
            <Card
              key={`space-${index}`}
              className="col-span-12 cursor-pointer sm:col-span-4  bg-white border-[#e8edf2]"
            >
              <CardContent className="p-[16px] flex flex-col gap-2.5 h-[111px] justify-center">
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={`relative w-[32.16px] h-[32.16px] ${card.bgColor} rounded-[8.04px] flex items-center justify-center`}
                  >
                    {card.icon}
                  </div>
                  <div className="font-normal text-neutralneutral-500-day text-xs leading-4 ">
                    {card.title}
                  </div>
                </div>
                <div className="flex items-center justify-end w-full">
                  <div className="font-medium text-2xl tracking-[-0.21px] leading-[28.1px]  text-neutralneutral-1100-day text-right">
                    {card.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

  
      </div>

      {/* Occupancy Card */}
      <Card className="col-span-12 intro-y lg:col-span-4 box border-[#e8edf2]  ">
        <CardContent className="p-[24.32px] flex flex-col items-center gap-[16.21px]">
          <div className="flex items-center justify-between w-full">
            <div className="font-semibold text-neutralneutral-500-day text-xs leading-4 font-['Poppins',Helvetica]">
              % Occupancy
            </div>
          </div>

          <div className="w-full h-[1.01px] bg-[#e8edf2]" />
      
          <div className="relative size-36" >
 

 <svg className="rotate-[135deg] size-full rounded-full bg-green-100" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
   <circle cx="18" cy="18" r="17" fill="none" className="stroke-current text-green-500 dark:text-green-500" stroke-width="2" stroke-dasharray={`${occupancyPercentage} ${100 - occupancyPercentage}`} stroke-linecap="round"></circle>
</svg>

 <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
 <span className="text-center text-4xl font-bold text-green-600 dark:text-green-500">{occupancyPercentage}%</span>

 </div>
</div>
        
        </CardContent>
      </Card>
      
    </div>
  );
};
