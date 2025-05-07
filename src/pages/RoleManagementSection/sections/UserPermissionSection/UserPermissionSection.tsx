
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
const userPermissionsConfig: { key: Privilege; label: string }[] = [
  { key: 'view_dashboard', label: "View Dashboard",  },
  { key: 'add_users', label: "Add Users", },
  { key: 'update_users', label: "Update Users", },
  { key: 'add_user_role', label: "Delete Users", },
  { key: 'delete_role', label: "Add User Roles", },
  { key: 'update_user_role', label: "Update User Roles", },
];

interface UserPermissionsSectionProps {
  // (2) receive the boolean map for the **active** role
  privileges: Record<Privilege, boolean>;
  // (3) handler that toggles one privilege on/off
  onToggle: (privilege: Privilege) => void;
}

export const UserPermissionSection: React.FC<UserPermissionsSectionProps> = ({
  privileges,
  onToggle,
}) => {


  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-4 flex-1">
          <h3 className="w-full font-['Poppins',Helvetica] font-semibold text-colorsneutralgray-3 text-xs tracking-[0] leading-[20.5px]">
            USERS
          </h3>


          <div className="grid grid-cols-2 gap-x-[120px] gap-y-8 w-full">
          {userPermissionsConfig.map(({ key, label }) => (
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
