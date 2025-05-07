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
const billboardPermissionsConfig: { key: Privilege; label: string }[] = [
  { key: 'create_billboard', label: "Create Billboard" },
  { key: 'update_billboard', label: "Edit Billboard"},
  { key: 'update_billboard_status', label: "Update Billboard"},
  { key: 'delete_billboard', label: "Delete Billboard"},
];

interface BillboardPermissionsSectionProps {
  privileges: Record<Privilege, boolean>;
  onToggle: (privilege: Privilege) => void;
}


  export const BillboardPermissionSection: React.FC<BillboardPermissionsSectionProps> = ({
    privileges,
    onToggle,
  }) => {



  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-4 flex-1">

      <h3 className="font-semibold text-xs text-colorsneutralgray-3 tracking-[0] leading-[20.5px]">
          BILLBOARD
        </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {billboardPermissionsConfig.map(({ key, label }) => (
            <div
            key={key}
            className="flex items-center justify-between w-full"
            >
              <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] tracking-[0]">
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
