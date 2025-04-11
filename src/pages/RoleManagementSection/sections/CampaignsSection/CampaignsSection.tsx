import React from "react";
import { Switch } from "../../../../components/ui/switch";

export const CampaignsSection = (): JSX.Element => {
  // User permission data that can be mapped over
  const userPermissions = [
    { id: 1, name: "View Dashboard", enabled: false },
    { id: 2, name: "Add Users", enabled: true },
    { id: 3, name: "Update Users", enabled: true },
    { id: 4, name: "Delete Users", enabled: true },
    { id: 5, name: "Add User Roles", enabled: true },
    { id: 6, name: "Update User Roles", enabled: true },
  ];

  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-4 flex-1">
          <h3 className="w-full font-['Poppins',Helvetica] font-semibold text-colorsneutralgray-3 text-xs tracking-[0] leading-[20.5px]">
            USERS
          </h3>

          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
              {userPermissions[0].name}
            </span>

            <Switch
              checked={userPermissions[0].enabled}
              className="data-[state=unchecked]:bg-[#7e7e8f] data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
              {userPermissions[1].name}
            </span>

            <Switch
              checked={userPermissions[1].enabled}
              className="data-[state=unchecked]:bg-[#7e7e8f] data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
              {userPermissions[2].name}
            </span>

            <Switch
              checked={userPermissions[2].enabled}
              className="data-[state=unchecked]:bg-[#7e7e8f] data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
              {userPermissions[3].name}
            </span>

            <Switch
              checked={userPermissions[3].enabled}
              className="data-[state=unchecked]:bg-[#7e7e8f] data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
              {userPermissions[4].name}
            </span>

            <Switch
              checked={userPermissions[4].enabled}
              className="data-[state=unchecked]:bg-[#7e7e8f] data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
              {userPermissions[5].name}
            </span>

            <Switch
              checked={userPermissions[5].enabled}
              className="data-[state=unchecked]:bg-[#7e7e8f] data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
