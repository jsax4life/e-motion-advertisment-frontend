import {
  BarChart2Icon,
  CalendarIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { Button } from "../../../../components/ui/button";

// Define navigation items for better maintainability
const navigationItems = [
  {
    icon: <LayoutDashboardIcon className="w-[22px] h-[22px]" />,
    label: "Dashboard",
    active: false,
  },
  {
    icon: <BarChart2Icon className="w-[22px] h-[22px]" />,
    label: "Campaigns",
    active: false,
    hasChildren: true,
    children: [
      {
        icon: <ShoppingBagIcon className="w-[22px] h-[22px]" />,
        label: "Orders",
        active: false,
      },
      {
        icon: <CalendarIcon className="w-[22px] h-[22px]" />,
        label: "Calendar",
        active: false,
      },
      {
        icon: <TruckIcon className="w-[22px] h-[22px]" />,
        label: "Delivered",
        active: false,
      },
    ],
  },
  {
    icon: <UsersIcon className="w-[22px] h-[22px]" />,
    label: "Clients",
    active: false,
  },
  {
    icon: <StarIcon className="w-[22px] h-[22px]" />,
    label: "Billboards",
    active: false,
  },
  {
    icon: <CreditCardIcon className="w-[22px] h-[22px]" />,
    label: "Finance",
    active: false,
  },
  {
    icon: <UsersIcon className="w-[22px] h-[22px]" />,
    label: "Users",
    active: false,
  },
  {
    icon: <ShieldCheckIcon className="w-[22px] h-[22px]" />,
    label: "Role Management",
    active: true,
  },
];

export const NavigationSidebarSection = (): JSX.Element => {
  return (
    <nav className="w-64 h-full border-r border-neutralneutral-border-day">
      <div className="w-full h-full bg-neutralneutral-bg-day">
        <div className="flex flex-col w-full items-start gap-7 pt-14 px-6">
          <div className="flex flex-col w-full items-start">
            {navigationItems.map((item, index) =>
              item.hasChildren ? (
                <Accordion
                  key={index}
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem value="campaigns" className="border-none">
                    <AccordionTrigger className="py-4 px-4 rounded-xl hover:bg-neutralneutral-100-day">
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span className="font-semibold text-sm text-neutralneutral-500-day font-['Poppins',Helvetica]">
                          {item.label}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4 pl-4">
                        {item.children?.map((child, childIndex) => (
                          <Button
                            key={childIndex}
                            variant="ghost"
                            className="flex justify-start items-center gap-2.5 py-2 px-4 h-auto rounded-xl"
                          >
                            {child.icon}
                            <span className="font-semibold text-sm text-neutralneutral-500-day font-['Poppins',Helvetica]">
                              {child.label}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Button
                  key={index}
                  variant={item.active ? "default" : "ghost"}
                  className={`flex justify-start items-center gap-2.5 py-4 px-4 h-14 w-full rounded-xl ${
                    item.active
                      ? "bg-[#2774ff]"
                      : "hover:bg-neutralneutral-100-day"
                  }`}
                >
                  {item.icon}
                  <span
                    className={`font-semibold text-sm font-['Poppins',Helvetica] ${
                      item.active ? "text-white" : "text-neutralneutral-500-day"
                    }`}
                  >
                    {item.label}
                  </span>
                </Button>
              ),
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
