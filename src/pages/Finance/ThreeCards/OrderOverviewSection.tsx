import { ShoppingBagIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { formatCurrency } from "../../../utils/utils";
import Tippy from "../../../base-components/Tippy";
import Button from "../../../base-components/Button";
import TippyContent from "../../../base-components/TippyContent";


type orders = {
 

 
  totalPaidOrderAmount:  number,
  totalUnpaidOrderAmount:  number,
  totalOverdueOrderAmount:  number,
  totalOverdueOrderCount:   number,
 

}


export const OrderOverviewSection = ({totalPaidOrderAmount, totalUnpaidOrderAmount, totalOverdueOrderAmount,  totalOverdueOrderCount }: orders): JSX.Element => {
  // Data for revenue cards
  const revenueCards = [
    {
      title: "Total Paid Order",
      value: totalPaidOrderAmount,
      bgColor: "bg-green-400",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },
    {
      title: "Total Unpaid Order",
      value: totalUnpaidOrderAmount,
      bgColor: "bg-[#2774ff]",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },
    {
      title: "Total Amount Overdue",
      value: totalOverdueOrderAmount,
      bgColor: "bg-[#7747c9]",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },

    {
      title: "Total Overdue Order",
      value: totalOverdueOrderCount,
      bgColor: "bg-[#7747c9]",
      icon: <ShoppingBagIcon className="h-4 w-4 text-white" />,
    },

  ];

  // Data for billboard space cards


  // const tooltipData = [
  //   {
  //     id: 0,
  //     title: 'Billboard Space Breakdown',
  //     digital: totalDigitalAvailable,
  //     static: totalStaticAvailable,
  //   },
  //   {
  //     id: 1,
  //     title: 'Occupied Billboards Breakdown',
  //     digital: totalDigitalOccupied,
  //     static: totalStaticOccupied,
  //   },
  //   {
  //     id: 2,
  //     title: 'Vacant Billboards Breakdown',
  //     digital: totalDigitalVacant,
  //     static: totalStaticVacant,
  //   },
  //   {
  //     id: 3,
  //     title: 'Vacant Billboards Breakdown',
  //     digital: totalDigitalVacant,
  //     static: totalStaticVacant,
  //   },
  // ];
  

                  

  return (
    <>
  

                    {/* {tooltipData.map(({ id, title,  digital, static: staticValue }) => (
  <div key={id} className="tooltip-content">
    <TippyContent to={`chart-tooltip-${id}`} className="py-1">
      <div className="font-medium dark:text-slate-200 border-b border-slate-300 mb-2">
       {title}
      </div>
      <div className="flex flex-col gap-y-2 items-start justify-start mt-2 sm:mt-0">
        <div className="flex w-20 mr-2 dark:text-slate-400">
          Digital:
          <span className="ml-auto font-medium text-success">
            {digital}
          </span>
        </div>
        <div className="flex w-20 mr-2 dark:text-slate-400">
          Static:
          <span className="ml-auto font-medium text-success">
            {staticValue}
          </span>
        </div>
        <div className="w-24 sm:w-32 lg:w-56" />
      </div>
    </TippyContent>
  </div>
))} */}


    {/* <div className="grid grid-cols-12 lg:justify-start justify-center items-center space-x-4 lg:items-start   ">
      
      <div className=" col-span-12 intro-y lg:col-span-8   flex"> */}

   

      {/* <div className="text-center">
                      <Tippy
                        as={Button}
                        variant="primary"
                        content="This is awesome tooltip example!"
                      >
                        Show Tooltip
                      </Tippy>
                    </div> */}
        {/* Revenue Cards Row */}
        <div className="grid grid-cols-12  justify-center  lg:mt-0  items-center  lg:gap-x-6  gap-4">

          {revenueCards.map((card, index) => (
           
            <Card
              key={`revenue-${index}`}
              className=" col-span-12 sm:col-span-6 cursor-pointer md:col-span-3  bg-white border-[#e8edf2]"
              data-tooltip={`chart-tooltip-${index}`}

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
               
                <div className="flex items-center justify-end w-full"

                >
                  <div className="font-medium lg:text-xl   sm:text-md text-[16px]  tracking-[-0.21px] leading-[28.1px] text-neutralneutral-1100-day text-right">
                   {index > 1 ? card.value : `₦${formatCurrency(card.value)}`  } 
                  </div>
                </div>
                
              </CardContent>
            </Card>
          ))}


        </div>

{/*   
      </div>

   
      
    </div> */}



    </>
  );
};
