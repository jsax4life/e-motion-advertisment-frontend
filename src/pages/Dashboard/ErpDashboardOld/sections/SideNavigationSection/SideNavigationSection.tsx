import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../components/ui/accordion";
import { Button } from "../../../../../components/ui/button";

// Navigation item data for mapping
const navigationItems = [
  {
    title: "Dashboard",
    icon: "/vuesax-linear-favorite-chart.svg",
    isActive: true,
  },
  {
    title: "Campaigns",
    icon: "/chart-success.png",
    hasChildren: true,
    children: [
      { title: "Orders", icon: "/chart-success-1.png" },
      { title: "Calendar", icon: "/chart-success-2.png" },
      { title: "Delivered", icon: "/chart-success-3.png" },
    ],
  },
  {
    title: "Clients",
    icon: "/vuesax-linear-profile-2user.svg",
  },
  {
    title: "Billboards",
    icon: "/shop.png",
  },
  {
    title: "Finance",
    icon: "/shop-1.png",
  },
  {
    title: "Users",
    icon: "/vector.svg",
    isComplex: true,
  },
  {
    title: "Role Management",
    icon: "/vector-3.svg",
    isComplex: true,
  },
];

export const SideNavigationSection = (): JSX.Element => {
  return (
    <nav className="w-64 h-full border-r border-neutralneutral-border-day">
      <div className="h-full bg-neutralneutral-bg-day">
        <div className="flex flex-col p-6 gap-7">
          <div className="flex flex-col gap-2">
            {navigationItems.map((item, index) =>
              item.hasChildren ? (
                <Accordion
                  type="single"
                  collapsible
                  key={index}
                  className="w-full"
                >
                  <AccordionItem value="campaigns" className="border-none">
                    <AccordionTrigger className="py-4 px-5 rounded-xl hover:bg-neutralneutral-100-day">
                      <div className="flex items-center gap-2.5">
                        {item.icon && (
                          <div className="relative w-[22px] h-[22px]">
                            <img
                              src={item.icon}
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <span className="font-semibold text-sm text-neutralneutral-500-day font-subtitle">
                          {item.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col pl-10 gap-8">
                        {item.children?.map((child, childIndex) => (
                          <Button
                            key={childIndex}
                            variant="ghost"
                            className="flex justify-start items-center gap-2.5 p-0 h-auto hover:bg-transparent"
                          >
                            <div className="relative w-[22px] h-[22px]">
                              <img
                                src={child.icon}
                                alt={child.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="font-semibold text-sm text-neutralneutral-500-day font-subtitle">
                              {child.title}
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
                  variant={item.isActive ? "default" : "ghost"}
                  className={`flex justify-start items-center gap-2.5 py-4 px-5 w-full rounded-xl ${
                    item.isActive
                      ? "bg-[#2774ff] text-white hover:bg-[#2774ff] hover:text-white"
                      : "text-neutralneutral-500-day hover:bg-neutralneutral-100-day hover:text-neutralneutral-500-day"
                  }`}
                >
                  {item.isComplex ? (
                    <div className="relative w-[22px] h-[22px]">
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-[22px] h-[22px]"
                    />
                  )}
                  <span className="font-semibold text-sm font-subtitle">
                    {item.title}
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
