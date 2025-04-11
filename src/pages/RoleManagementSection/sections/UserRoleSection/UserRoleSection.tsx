import React from "react";
import { Switch } from "../../../../components/ui/switch";

export const UserRoleSection = (): JSX.Element => {
  // Billboard permissions data for mapping
  const billboardPermissions = [
    { id: 1, name: "Create Billboard", enabled: false },
    { id: 2, name: "Edit Billboard", enabled: true },
    { id: 3, name: "Update Billboard", enabled: true },
    { id: 4, name: "Delete Billboard", enabled: true },
    { id: 5, name: "Download Billboard Details", enabled: true },
  ];

  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-4 flex-1">
          <h3 className="self-stretch font-semibold text-colorsneutralgray-3 text-xs tracking-[0] leading-[20.5px] font-['Poppins',Helvetica]">
            BILLBOARDS
          </h3>

          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px]">
              {billboardPermissions[0].name}
            </span>

            <Switch
              checked={billboardPermissions[0].enabled}
              className="data-[state=unchecked]:bg-[#7e7e8f]"
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px]">
              {billboardPermissions[1].name}
            </span>

            <Switch
              checked={billboardPermissions[1].enabled}
              className="data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px]">
              {billboardPermissions[2].name}
            </span>

            <Switch
              checked={billboardPermissions[2].enabled}
              className="data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px]">
              {billboardPermissions[3].name}
            </span>

            <Switch
              checked={billboardPermissions[3].enabled}
              className="data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>
      </div>

      <div className="flex w-[377px] items-end gap-[120px]">
        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px]">
              {billboardPermissions[4].name}
            </span>

            <Switch
              checked={billboardPermissions[4].enabled}
              className="data-[state=checked]:bg-[#2774ff]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
