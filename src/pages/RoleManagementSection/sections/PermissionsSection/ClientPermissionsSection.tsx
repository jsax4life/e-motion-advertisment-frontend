// import React from "react";
// import { Switch } from "../../../../components/ui/switch";


// const clientPermissions = [
//   { id: 1, name: "Create Client", enabled: false },
//   { id: 2, name: "Edit Client", enabled: true },
//   { id: 3, name: "Delete Client", enabled: true },
//   { id: 4, name: "Download Client Details", enabled: true },
// ];

// export const ClientPermissionsSection = (): JSX.Element => {
//   return (
//     <section className="flex flex-col items-start gap-8 w-full">
//       <div className="flex flex-col items-start gap-4 w-full">
//         <h3 className="font-semibold text-xs text-colorsneutralgray-3 font-['Poppins',Helvetica] tracking-[0] leading-[20.5px]">
//           CLIENTS
//         </h3>

//         <div className="grid grid-cols-2 gap-x-[120px] gap-y-8 w-full">
//           {clientPermissions.slice(0, 2).map((permission) => (
//             <div
//               key={permission.id}
//               className="flex items-center justify-between w-full"
//             >
//               <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
//                 {permission.name}
//               </span>
//               <Switch
//                 checked={permission.enabled}
//                 className="data-[state=checked]:bg-[#2774ff] data-[state=unchecked]:bg-[#7e7e8f]"
//               />
//             </div>
//           ))}

//           {clientPermissions.slice(2, 4).map((permission) => (
//             <div
//               key={permission.id}
//               className="flex items-center justify-between w-full"
//             >
//               <span className="font-['Poppins',Helvetica] font-normal text-black text-[15.8px] leading-normal">
//                 {permission.name}
//               </span>
//               <Switch
//                 checked={permission.enabled}
//                 className="data-[state=checked]:bg-[#2774ff] data-[state=unchecked]:bg-[#7e7e8f]"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

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
const clientPermissionsConfig: { key: Privilege; label: string }[] = [
  { key: "create_clients", label: "Create Client" },
  { key: "edit_clients",   label: "Edit Client" },
  { key: "delete_client",  label: "Delete Client" },
  { key: "download_client_details", label: "Download Client Details" },
];

interface ClientPermissionsSectionProps {
  privileges: Record<Privilege, boolean>;
  onToggle: (privilege: Privilege) => void;
}

export const ClientPermissionsSection: React.FC<ClientPermissionsSectionProps> = ({
  privileges,
  onToggle,
}) => {
  return (
    <section className="flex flex-col items-start gap-8 w-full">
      <div className="flex flex-col items-start gap-4 w-full">
        <h3 className="font-semibold text-xs text-colorsneutralgray-3 tracking-[0] leading-[20.5px]">
          CLIENTS
        </h3>

        <div className="grid grid-cols-2 gap-x-[120px] gap-y-8 w-full">
          {clientPermissionsConfig.map(({ key, label }) => (
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
    </section>
  );
};


