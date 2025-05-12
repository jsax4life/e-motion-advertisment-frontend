

type Privilege =
'create_clients'
|'edit_clients'
|'delete_client'
|'download_client_details'

|'create_campaigns'
|'approve_campaign'
|'download_campaign'
|'end_campaign'
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
const clientPermissionsConfig: { key: Privilege; label: string }[] = [
  { key: 'create_campaigns', label: "Create Campaign" },
  // { key: 'approve_campaign', label: "Approve Campaign"},
  { key: 'download_campaign', label: "Decline Campaign"},
  { key: 'end_campaign', label: "End Campaign"},
  { key: 'update_campaign_status', label: "Download Campaign"},
  { key: 'approve_campaign_order', label: "Approved Campaign"},
  { key: 'mark_campaign_as_paid', label: "Mark Order Paid"},
  { key: 'deliver_campaign_order', label: "Delivered Campaign "},
  { key: 'freeze_campaign', label: "Freeze Campaign "},
  { key: 'unfreeze_campaign', label: "UnFreeze Campaign "},
];

interface CampaignPermissionsSectionProps {
  privileges: Record<Privilege, boolean>;
  onToggle: (privilege: Privilege) => void;
}


  export const CampaignPermissionsSection: React.FC<CampaignPermissionsSectionProps> = ({
    privileges,
    onToggle,
  }) => {

  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="w-full">
        <h3 className="text-xs font-semibold text-colorsneutralgray-3 font-['Poppins',Helvetica] mb-4 tracking-[0]">
          CAMPAIGNS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {clientPermissionsConfig.map(({ key, label }) => (
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
    </section>
  );
};
