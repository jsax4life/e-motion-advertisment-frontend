
type Privilege =
|'campaign_end_reminder'
|'campaign_start_reminder'
|'campaign_approval_notice'
|'campaign_delivered_notice'
|'payment_notification'
|'campaign_approval_reminder'
|'campaign_approved_notification'
|'campaign_delivered_notification'
|'campaign_creation_notification'



import React from "react";
import { Switch } from "../../../../components/ui/switch";

// (1) List out exactly which Privilege keys this section cares about:
const userPermissionsConfig: { key: Privilege; label: string }[] = [
  { key: 'campaign_end_reminder', label: "Campaign End Reminder ",  },
  { key: 'campaign_start_reminder', label: "Campaign Start Reminder", },
  { key: 'campaign_approval_notice', label: "Campaign Approval Notice", },
  { key: 'campaign_delivered_notice', label: "Campaign Delivered Notice", },
  { key: 'payment_notification', label: "Payment Notification", },
  { key: 'campaign_approval_reminder', label: "Campaign Approval Notice", },
  { key: 'campaign_approved_notification', label: "Campaign Approved Notice", },
  { key: 'campaign_delivered_notification', label: "Campaign Delivered Notice", },
  { key: 'campaign_creation_notification', label: "Campaign Creation Notice", },





 
];

interface EmailPermissionsSectionProps {
  // (2) receive the boolean map for the **active** role
  privileges: Record<Privilege, boolean>;
  // (3) handler that toggles one privilege on/off
  onToggle: (privilege: Privilege) => void;
}

export const EmailPermissionSection: React.FC<EmailPermissionsSectionProps> = ({
  privileges,
  onToggle,
}) => {


  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="flex items-end gap-[120px] w-full">
        <div className="flex flex-col items-start gap-4 flex-1">
          <h3 className="w-full font-['Poppins',Helvetica] font-semibold text-colorsneutralgray-3 text-xs tracking-[0] leading-[20.5px]">
            Email Notification Settings
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
