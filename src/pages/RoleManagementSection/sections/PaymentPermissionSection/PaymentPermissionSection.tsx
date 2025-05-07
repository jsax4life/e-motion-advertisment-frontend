
type Privilege =
'create_clients'
|'edit_clients'
|'delete_client'
|'download_client_details'

|'create_campaigns'
|'approve_campaign'
|'download_campaign'
|'delivered_campaign'
|'update_campaign_status'
|'approve_campaign_order'
|'mark_campaign_as_paid'
|'deliver_campaign_order'
|'freeze_campaign'
|'unfreeze_campaign'


|'update_payment_status'
|'update_running_campaign'
|'stop_running_campaign'

|'create_billboard'
|'update_billboard'
|'update_billboard_status'
|'delete_billboard'

|'view_dashboard'
|'add_users'
|'update_users'
|'delete_user'
|'add_user_role'
|'delete_role'
|'update_user_role'

import React from "react";
import { Switch } from "../../../../components/ui/switch";

// (1) List out exactly which Privilege keys this section cares about:
const PaymentPermissionsConfig: { key: Privilege; label: string }[] = [
  { key: "update_payment_status", label: "Change Payment Status" },
  { key: "update_running_campaign",   label: "Update Running Campaign" },
  { key: "stop_running_campaign",  label: "Delete Client" },
];

interface PaymentPermissionsSectionProps {
  // (2) receive the boolean map for the **active** role
  privileges: Record<Privilege, boolean>;
  // (3) handler that toggles one privilege on/off
  onToggle: (privilege: Privilege) => void;
}

{/* <div className="flex w-[377px] items-end gap-[120px]"> */}

  export const PaymentPermissionSection: React.FC<PaymentPermissionsSectionProps> = ({
    privileges,
    onToggle,
  }) => {


  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-4 flex-1">
          <h4 className="self-stretch font-poppins font-semibold text-colorsneutralgray-3 text-xs tracking-[0] leading-[20.5px]">
            PAYMENTS
          </h4>


<div className="grid grid-cols-2 gap-x-[120px] gap-y-8 w-full">
          {PaymentPermissionsConfig.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between w-full"
            >
              <span className="font-normal text-black text-[15.8px] leading-normal">
                {label}
              </span>
              <Switch
                checked={privileges[key]}
                onCheckedChange={() => onToggle(key)}
                className="data-[state=checked]:bg-[#2774ff] data-[state=unchecked]:bg-[#7e7e8f]"
              />
            </div>
          ))}
        </div>
        </div>

        

        
      </div>

    </section>
  );
};
