import React from "react";
import { Switch } from "../../../../components/ui/switch";

// Define permission data for better maintainability
const clientPermissions = [
  { id: 1, name: "Create Client", enabled: false },
  { id: 2, name: "Edit Client", enabled: true },
  { id: 3, name: "Delete Client", enabled: true },
  { id: 4, name: "Download Client Details", enabled: true },
];

export const PermissionsSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="flex flex-col items-start gap-4 w-full">
        <h3 className="font-semibold text-xs text-colorsneutralgray-3 font-['Poppins',Helvetica] tracking-[0] leading-[20.5px]">
          CLIENTS
        </h3>

        <div className="grid grid-cols-2 gap-x-[120px] gap-y-8 w-full">
          {clientPermissions.slice(0, 2).map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between w-full"
            >
              <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
                {permission.name}
              </span>
              <Switch
                checked={permission.enabled}
                className="data-[state=checked]:bg-[#2774ff] data-[state=unchecked]:bg-[#7e7e8f]"
              />
            </div>
          ))}

          {clientPermissions.slice(2, 4).map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between w-full"
            >
              <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
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
