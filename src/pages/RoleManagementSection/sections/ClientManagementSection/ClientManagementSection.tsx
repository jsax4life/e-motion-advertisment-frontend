import React from "react";
import { Switch } from "../../../../components/ui/switch";

export const ClientManagementSection = (): JSX.Element => {
  // Data for toggle switches to enable mapping
  const [checked, setChecked] = React.useState(true);
  const paymentOptions = [
    {
      id: "change-payment-status",
      label: "Change Payment Status",
      defaultChecked: false,
    },
  ];

  const campaignOptions = [
    {
      id: "stop-running-campaign",
      label: "Stop Running Campaign",
      defaultChecked: true,
    },
    {
      id: "update-running-campaign",
      label: "Update Running Campaign",
      defaultChecked: true,
    },
  ];

  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-4 flex-1">
          <h4 className="self-stretch font-poppins font-semibold text-colorsneutralgray-3 text-xs tracking-[0] leading-[20.5px]">
            PAYMENTS
          </h4>

          {paymentOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between w-full"
            >
              <label
                htmlFor={option.id}
                className="font-poppins font-normal text-black text-[15.8px] leading-normal"
              >
                {option.label}
              </label>
              <Switch
                id={option.id}
                defaultChecked={option.defaultChecked}
                className="data-[state=checked]:bg-[#2774ff] data-[state=unchecked]:bg-[#7e7e8f]"
                />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <label
              htmlFor={campaignOptions[0].id}
              className="font-poppins font-normal text-black text-[15.8px] leading-normal"
            >
              {campaignOptions[0].label}
            </label>
            <Switch
              id={campaignOptions[0].id}
              defaultChecked={campaignOptions[0].defaultChecked}
              className="data-[state=checked]:bg-[#2774ff] data-[state=unchecked]:bg-[#7e7e8f]"
            />
          </div>
        </div>
      </div>

      <div className="flex w-[377px] items-end gap-[120px]">
        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center justify-between w-full">
            <label
              htmlFor={campaignOptions[1].id}
              className="font-poppins font-normal text-black text-[15.8px] leading-normal"
            >
              {campaignOptions[1].label}
            </label>
            <Switch
              id={campaignOptions[1].id}
              defaultChecked={campaignOptions[1].defaultChecked}
              className="data-[state=checked]:bg-[#2774ff] data-[state=unchecked]:bg-[#7e7e8f]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
