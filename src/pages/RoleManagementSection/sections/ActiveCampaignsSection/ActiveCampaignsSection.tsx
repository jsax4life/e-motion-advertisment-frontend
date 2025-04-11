import React from "react";
import { Button } from "../../../../components/ui/button";

export const ActiveCampaignsSection = (): JSX.Element => {
  // Define roles data for mapping
  const roles = [
    { id: 1, name: "Super Admin", isActive: true },
    { id: 2, name: "CEO", isActive: false },
    { id: 3, name: "CTO", isActive: false },
    { id: 4, name: "Admin", isActive: false },
  ];

  return (
    <nav className="flex flex-col items-start gap-8 p-6 self-stretch bg-neutralneutral-bg-day rounded-[10px_0px_0px_10px] border border-solid border-neutralneutral-border-day h-full overflow-y-auto">
      <div className="flex flex-col items-start gap-2 w-full">
        {roles.map((role) => (
          <Button
            key={role.id}
            variant={role.isActive ? "default" : "ghost"}
            className={`w-[170px] justify-start pl-6 pr-2.5 py-2.5 rounded-lg ${
              role.isActive
                ? "bg-[#2774ff] hover:bg-[#2774ff]/90"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <span
              className={`font-semibold font-['Poppins',Helvetica] text-sm leading-4 ${
                role.isActive ? "text-white" : "text-neutralneutral-500-day"
              }`}
            >
              {role.name}
            </span>
          </Button>
        ))}
      </div>
    </nav>
  );
};
