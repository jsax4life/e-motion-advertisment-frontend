import React from "react";
import { Switch } from "../../../../components/ui/switch";

export const RoleManagementSection = (): JSX.Element => {
  // Campaign permissions data for easier mapping
  const campaignPermissions = [
    { id: 1, name: "Create Campaign", enabled: false },
    { id: 2, name: "Approve Campaign", enabled: true },
    { id: 3, name: "Decline Campaign", enabled: true },
    { id: 4, name: "Cancel Campaign", enabled: true },
    { id: 5, name: "Download Campaign", enabled: true },
    { id: 6, name: "Delivered Campaign", enabled: true },
  ];

  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="w-full">
        <h3 className="text-xs font-semibold text-colorsneutralgray-3 font-['Poppins',Helvetica] mb-4 tracking-[0]">
          CAMPAIGNS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {campaignPermissions.map((permission, index) => (
            <div
              key={permission.id}
              className="flex items-center justify-between w-full"
            >
              <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] tracking-[0]">
                {permission.name}
              </span>
              <Switch
                checked={permission.enabled}
                className="data-[state=checked]:bg-[#2774ff] data-[state=unchecked]:bg-[#7e7e8f]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
