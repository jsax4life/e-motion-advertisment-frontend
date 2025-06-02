import React, { useContext, useEffect, useState, useRef } from "react";

import Toastify from "toastify-js";

import Lucide from "../../base-components/Lucide";
import Table from "../../base-components/Table";

import { Separator } from "../../components/ui/separator";
import { ActiveRoleSection } from "./sections/ActiveRoleSection";
import { UserPermissionSection } from "./sections/UserPermissionSection/UserPermissionSection";
import { EmailPermissionSection } from "./sections/EmailPermissionSection/EmailPermissionSection";
import { PaymentPermissionSection } from "./sections/PaymentPermissionSection";
import { NewRoleSection } from "./sections/NewRoleSection";
import { ClientPermissionsSection } from "./sections/PermissionsSection/ClientPermissionsSection";
import { CampaignPermissionsSection } from "./sections/CampaignPermissionsSection/CampaignPermissionsSection";
import { SettingsWrapperSection } from "./sections/SettingsWrapperSection";
import { BillboardPermissionSection } from "./sections/BillboardPermissionSection/BillboardPermissionSection";

import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import Button from "../../base-components/Button";
import Notification from "../../base-components/Notification";
import { FormInput, FormLabel } from "../../base-components/Form";
import { Dialog } from "../../base-components/Headless";

type Role = {
  id: number;
  name: string;
};

type Privilege =
  | "create_clients"
  | "edit_clients"
  | "delete_client"
  | "download_client_details"
  | "create_campaigns"
  | "approve_campaign"
  | "end_campaign"
  | "download_campaign"
  | "delivered_campaign"
  | "update_campaign_status"
  | "approve_campaign_order"
  | "mark_campaign_as_paid"
  | "deliver_campaign_order"
  | "freeze_campaign"
  | "unfreeze_campaign"
  | "update_payment_status"
  | "update_running_campaign"
  | "stop_running_campaign"
  | "create_billboard"
  | "update_billboard"
  | "update_billboard_status"
  | "delete_billboard"
  | "view_dashboard"
  | "add_users"
  | "update_users"
  | "delete_user"
  | "add_user_role"
  | "delete_role"
  | "update_user_role"



// Initial privileges for each role (can be fetched from backend)

const privileges: Privilege[] = [
  "create_clients",
  "edit_clients",
  "delete_client",
  "download_client_details",
  "end_campaign",
  "create_campaigns",
  "approve_campaign",
  "download_campaign",
  "delivered_campaign",
  "update_campaign_status",
  "approve_campaign_order",
  "mark_campaign_as_paid",
  "deliver_campaign_order",
  "freeze_campaign",
  "unfreeze_campaign",

  "update_payment_status",
  "update_running_campaign",
  "stop_running_campaign",

  "create_billboard",
  "update_billboard",
  "update_billboard_status",
  "delete_billboard",

  "view_dashboard",
  "add_users",
  "update_users",
  "delete_user",
  "add_user_role",
  "delete_role",
  "update_user_role",


];

type EmailPrivilege =
  |'campaign_end_reminder'
|'campaign_start_reminder'
|'campaign_approval_notice'
|'campaign_delivered_notice'
|'payment_notification'
|'campaign_approval_reminder'
|'campaign_approved_notification'
|'campaign_delivered_notification'
|'campaign_creation_notification'


const emailPrivileges: EmailPrivilege[] = [
 
  'campaign_end_reminder',
'campaign_start_reminder',
'campaign_approval_notice',
'campaign_delivered_notice',
'payment_notification',
'campaign_approval_reminder',
'campaign_approved_notification',
'campaign_delivered_notification',
'campaign_creation_notification',
];

const privilegeMapping: Record<Privilege, number> = {
  create_clients: 1,
  edit_clients: 2,
  delete_client: 3,
  download_client_details: 4,

  create_campaigns: 5,
  approve_campaign: 6,
  download_campaign: 7,
  delivered_campaign: 8,
  
  update_campaign_status: 9,
  approve_campaign_order: 10,
  mark_campaign_as_paid: 11,
  deliver_campaign_order: 12,
  freeze_campaign: 13,
  unfreeze_campaign: 14,

  update_payment_status: 15,
  update_running_campaign: 16,
  stop_running_campaign: 17,

  create_billboard: 18,
  update_billboard: 19,
  update_billboard_status: 20,
  delete_billboard: 21,

  view_dashboard: 22,
  add_users: 23,
  update_users: 24,
  delete_user: 25,
  add_user_role: 26,
  delete_role: 27,
  update_user_role: 28,
  end_campaign: 29,

};

const emailPrivilegeMapping: Record<EmailPrivilege, number> = {
  campaign_start_reminder: 1,
  campaign_end_reminder: 2,
campaign_approval_notice : 3,
campaign_delivered_notice: 4,
payment_notification: 5,
campaign_approval_reminder : 6,
campaign_approved_notification: 7,
campaign_delivered_notification : 8,
campaign_creation_notification: 9
};

// const initialPrivileges = roles.reduce((acc, role) => {
//   acc[role] = privileges.reduce((roleAcc, privilege) => {
//     roleAcc[privilege] = false;
//     return roleAcc;
//   }, {} as Record<Privilege, boolean>);
//   return acc;
// }, {} as Record<Role, Record<Privilege, boolean>>);

const initialPrivileges = (
  roles: Role[]
): Record<number, Record<Privilege, boolean>> => {
  const defaultPrivileges = Object.fromEntries(
    privileges.map((priv) => [priv, false])
  ) as Record<Privilege, boolean>;

  return roles.reduce((acc, role) => {
    acc[role.id] = { ...defaultPrivileges };
    return acc;
  }, {} as Record<number, Record<Privilege, boolean>>);
};

const ErpRoleManagement: React.FC = () => {
  // const [rolePrivileges, setRolePrivileges] = useState(initialPrivileges);
  const [roles, setRoles] = useState<Role[]>([]);

  // const [rolePrivileges, setRolePrivileges] = useState(() => initialPrivileges(roles));
  // const [rolePrivileges, setRolePrivileges] = useState<Record<number, Record<Privilege, boolean>>>(() => initialPrivileges(roles));
  const [rolePrivileges, setRolePrivileges] = useState<
    Record<number, Record<Privilege, boolean>>
  >({});

  const [roleEmailPrivileges, setRoleEmailPrivileges] = useState<
  Record<number, Record<EmailPrivilege, boolean>>
>({});

  const { user } = useContext(UserContext);
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  const deleteButtonRef = useRef(null);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // Track modal visibility
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);

  // Track the new role’s name and its privilege toggles
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePrivileges, setNewRolePrivileges] = useState<
    Record<Privilege, boolean>
  >(
    () =>
      Object.fromEntries(privileges.map((p) => [p, false])) as Record<
        Privilege,
        boolean
      >
  );

  const [newRoleEmailPrivileges, setNewRoleEmailPrivileges] = useState<
  Record<EmailPrivilege, boolean>
>(
  () =>
    Object.fromEntries(emailPrivileges.map((p) => [p, false])) as Record<
      EmailPrivilege,
      boolean
    >
);

  useEffect(() => {
    fetchRole(); // Will also initialize rolePrivileges
  }, []);

  useEffect(() => {
    // if (!roles.length) return;
    if (roles.length > 0) {
      fetchRolePrivileges(); // Only fetch privileges once roles are available
    }
  }, [roles]);



  const initializePrivileges = (
    roles: Role[]
  ): Record<number, Record<Privilege, boolean>> => {
    const defaultPrivileges = Object.fromEntries(
      privileges.map((priv) => [priv, false])
    ) as Record<Privilege, boolean>;

    return roles.reduce((acc, role) => {
      acc[role.id] = { ...defaultPrivileges };
      return acc;
    }, {} as Record<number, Record<Privilege, boolean>>);
  };

  const initializeEmailPrivileges = (
    roles: Role[]
  ): Record<number, Record<EmailPrivilege, boolean>> => {
    const defaultPrivileges = Object.fromEntries(
      emailPrivileges.map((emailPriv) => [emailPriv, false])
    ) as Record<EmailPrivilege, boolean>;

    return roles.reduce((acc, role) => {
      acc[role.id] = { ...defaultPrivileges };
      return acc;
    }, {} as Record<number, Record<EmailPrivilege, boolean>>);
  };

  

  const fetchRolePrivileges = () => {
    if (!roles.length) return;

    setLoading(true);

    API(
      "get",
      "get-role-privileges",
      {},
      function (response: any) {
        console.log(response);
        // Initialize all privileges to false for each role
        const updatedPrivileges = initializePrivileges(roles);
        const updatedEmailPrivileges = initializeEmailPrivileges(roles);

        // Assume each item in the response looks like: { role_id: number, privileges: number[] }
        response.forEach(
          (roleData: { role_id: number; privileges: number[]; email_notification_types: number[] }) => {
            roleData.privileges.forEach((privilegeId: number) => {
              const privilegeKey = privileges[privilegeId - 1]; // assuming privilege IDs are 1-based and map directly by index
              if (privilegeKey && updatedPrivileges[roleData.role_id]) {
                updatedPrivileges[roleData.role_id][privilegeKey] = true;
              }
            });

            roleData.email_notification_types.forEach((emailPrivilegeId: number) => {
              const privilegeKey = emailPrivileges[emailPrivilegeId - 1]; // assuming privilege IDs are 1-based and map directly by index
              if (privilegeKey && updatedEmailPrivileges[roleData.role_id]) {
                updatedEmailPrivileges[roleData.role_id][privilegeKey] = true;
              }
            });
          }
        );

        setRolePrivileges(updatedPrivileges);
        setRoleEmailPrivileges(updatedEmailPrivileges);
        
        setLoading(false);
      },
      function (error: any) {
        console.error("Error fetching role privileges:", error);
        setLoading(false);
      },
      user?.token && user.token
    );
  };

  // const fetchEmailRolePrivileges = () => {
  //   if (!roles.length) return;

  //   setLoading(true);

  //   API(
  //     "get",
  //     "get-role-privileges",
  //     {},
  //     function (response: any) {
  //       console.log(response);
  //       // Initialize all privileges to false for each role
  //       const updatedPrivileges = initializePrivileges(roles);

  //       // Assume each item in the response looks like: { role_id: number, privileges: number[] }
  //       response.forEach(
  //         (roleData: { role_id: number; privileges: number[] }) => {
  //           roleData.privileges.forEach((privilegeId: number) => {
  //             const privilegeKey = privileges[privilegeId - 1]; // assuming privilege IDs are 1-based and map directly by index
  //             if (privilegeKey && updatedPrivileges[roleData.role_id]) {
  //               updatedPrivileges[roleData.role_id][privilegeKey] = true;
  //             }
  //           });
  //         }
  //       );

  //       setRolePrivileges(updatedPrivileges);
  //       setLoading(false);
  //     },
  //     function (error: any) {
  //       console.error("Error fetching role privileges:", error);
  //       setLoading(false);
  //     },
  //     user?.token && user.token
  //   );
  // };

  const handleRoleClick = (role: Role) => {
    setActiveRole(role);
  };

 

  const fetchRole = () => {
    setLoading(true);

    API(
      "get",
      "get-roles",
      {},
      (response: any) => {
        // Build Role objects directly from the API
        const fetchedRoles: Role[] = response.map((r: any) => ({
          id: r.id,
          name: r.name,
        }));

        setRoles(fetchedRoles);
        setActiveRole(fetchedRoles[0] || null);

        // Now initialize privileges *after* we have the real Role[]
        setRolePrivileges(initializePrivileges(fetchedRoles));
        setRoleEmailPrivileges(initializeEmailPrivileges(fetchedRoles));
        setLoading(false);
      },
      (error: any) => {
        console.error("Error fetching roles:", error);
        setLoading(false);
      },
      user?.token
    );
  };

  
  const handleSave = () => {
    if (!activeRole) return;
    // setLoading(true);
    // transform just activeRole’s privileges
    const selected = Object.entries(rolePrivileges[activeRole.id])
      .filter(([, v]) => v)
      .map(([p]) => privilegeMapping[p as Privilege]);
    console.log(selected);

    const selectedEmailPriviledgeIds = Object.entries(roleEmailPrivileges[activeRole.id])
    .filter(([_, v]) => v)
    .map(([p]) => emailPrivilegeMapping[p as EmailPrivilege]);


    const payload = {
      roles: [{ role_id: activeRole?.id, privilege_ids: selected, email_notification_type_ids: selectedEmailPriviledgeIds }],
    };
    console.log(payload);

    API(
      "post",
      `roles/batch-update-privileges`,
      payload,
      function (response: any) {
        console.log(response);
        setMessage(response?.message);
        setLoading(false);

        showToast(true); // Show error toast with the error message
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);
        setMessage(error);
        showToast(false); // Show success toast
      },
      user?.token
    );
  };

  // Toastify helper for both success and error
  const showToast = (isSuccess: boolean, message?: string) => {
    const toastEl = document
      .querySelectorAll(
        isSuccess
          ? "#success-notification-content"
          : "#failed-notification-content"
      )[0]
      .cloneNode(true) as HTMLElement;

    toastEl.classList.remove("hidden");

    Toastify({
      node: toastEl,
      duration: 8000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    }).showToast();
  };

  
  const handleCheckboxChange = (privilege: Privilege) => {
    if (!activeRole) return;

    setRolePrivileges((prev) => ({
      ...prev,
      [activeRole.id]: {
        ...prev[activeRole.id],
        [privilege]: !prev[activeRole.id][privilege],
      },
    }));

  
  };


  const handleEmailCheckboxChange = (emailPrivilege: EmailPrivilege) => {
    if (!activeRole) return;

   

    setRoleEmailPrivileges((prev) => ({
      ...prev,
      [activeRole.id]: {
        ...prev[activeRole.id],
        [emailPrivilege]: !prev[activeRole.id][emailPrivilege],
      },
    }));
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;
    setLoading(true);

    const selectedIds = Object.entries(newRolePrivileges)
    .filter(([_, v]) => v)
    .map(([key]) => privilegeMapping[key as Privilege]);

    const selectedEmailPriviledgeIds = Object.entries(newRoleEmailPrivileges)
    .filter(([_, v]) => v)
    .map(([key]) => emailPrivilegeMapping[key as EmailPrivilege]);

    // 1) Create the role
    // API(
    //   "post",
    //   "create-new-role", // your endpoint to create a role
    //   { name: newRoleName, privilege_ids: selectedIds, }, // payload
    //   (res: any) => {
    //     console.log(res);
    //     const createdRole: Role = res.role; // assume backend returns { role: { id, name } }

        // 2) Now assign the privileges for that new role
        // const selectedIds = Object.entries(newRolePrivileges)
        //   .filter(([_, v]) => v)
        //   .map(([key]) => privilegeMapping[key as Privilege]);

        API(
          "post",
          "roles/batch-update-privileges",
          {
            roles: [
              {name: newRoleName,
                // role_id: createdRole.id,
                privilege_ids: selectedIds,
                email_notification_type_ids: selectedEmailPriviledgeIds
              },
            ],
          },
          () => {
            // 3) Refresh roles + privileges
            fetchRole();
            fetchRolePrivileges();
            setShowNewRoleModal(false);
            setLoading(false);
            showToast(true);
          },
          (err: any) => {
            console.error("Failed to set new role privileges:", err);
            setLoading(false);
            showToast(false);
          },
          user?.token
        );
      // },
      // (err: any) => {
      //   console.error("Failed to create role:", err);
      //   setLoading(false);
      //   showToast(false);
      // },
      // user?.token
    // );
  };

  //   const navigate = useNavigate();

  console.log(rolePrivileges);
  console.log(roles);
  

  const handleResetNewRoleForm = () => {
    setNewRoleName("");
    setNewRolePrivileges(
      Object.fromEntries(privileges.map((p) => [p, false])) as Record<
        Privilege,
        boolean
      >
    );
  };

  const hanldeShowNewRoleModal = (
    value: boolean | ((prevState: boolean) => boolean)
  ) => {
    setShowNewRoleModal(value);
  };

  const hanldeCloseNewRoleModal = () => {
    setShowNewRoleModal(false);
  };
  return (
    <>
      {showNewRoleModal && (
        <Dialog
          open={showNewRoleModal}
          onClose={hanldeCloseNewRoleModal}
          // initialFocus={sendButtonRef}
          className="flex place-self-center lg:items-center lg:justify-center  "
          size="lg"
        >
          <Dialog.Panel className=" max-h-[95vh] overflow-y-auto ">
            <Dialog.Title className="border-slate-200 ">
              <div className="flex justify-center items-center lg:text-xl font-bold ">
                <div>Create New Role</div>
              </div>
            </Dialog.Title>

            <Dialog.Description className="grid grid-cols-12  gap-y-3 max-h-[90vh] overflow-y-auto ">
              <div className="col-span-12 rounded-lg w-full max-w-2xl  p-4 space-y-8 max-h-[90vh] overflow-y-auto">
            

                <div className="col-span-12">
                  <FormLabel
                    className="font-medium lg:text-[16px] text-black"
                    htmlFor="internalCode "
                  >
                    Role Name
                  </FormLabel>
                  <FormInput
                    formInputSize="lg"
                    id="role_name"
                    type="text"
                    value={newRoleName}
                    required
                    placeholder="Type here"
                    onChange={(e) => setNewRoleName(e.target.value)}

                    // {...register("company_name")}
                  />
              
                </div>

                {/* Reuse your permissions sections, but bound to newRolePrivileges */}
                <ClientPermissionsSection
                  privileges={newRolePrivileges}
                  onToggle={(priv) =>
                    setNewRolePrivileges((prev) => ({
                      ...prev,
                      [priv]: !prev[priv],
                    }))
                  }
                />
                <Separator />
                <CampaignPermissionsSection
                  privileges={newRolePrivileges}
                  onToggle={(priv) =>
                    setNewRolePrivileges((prev) => ({
                      ...prev,
                      [priv]: !prev[priv],
                    }))
                  }
                />

                <Separator />
                <PaymentPermissionSection
                  privileges={newRolePrivileges}
                  onToggle={(priv) =>
                    setNewRolePrivileges((prev) => ({
                      ...prev,
                      [priv]: !prev[priv],
                    }))
                  }
                />

                <Separator />
                <BillboardPermissionSection
                  privileges={newRolePrivileges}
                  onToggle={(priv) =>
                    setNewRolePrivileges((prev) => ({
                      ...prev,
                      [priv]: !prev[priv],
                    }))
                  }
                />

                <Separator />
                <UserPermissionSection
                  privileges={newRolePrivileges}
                  onToggle={(priv) =>
                    setNewRolePrivileges((prev) => ({
                      ...prev,
                      [priv]: !prev[priv],
                    }))
                  }
                />
                <Separator />


                      <EmailPermissionSection
                        privileges={newRoleEmailPrivileges}
                        onToggle={(priv) =>
                          setNewRoleEmailPrivileges((prev) => ({
                            ...prev,
                            [priv]: !prev[priv],
                          }))
                        }
                      />
                    <Separator className="w-full" />

                
                {/* …other sections as needed… */}
              </div>
            </Dialog.Description>

            <Dialog.Footer className="text-right">
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  // className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setShowNewRoleModal(false)}
                  type="button"
                  variant="outline-secondary"
                  className="w-auto  border-red-500 text-red-500"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  className="w-auto bg-customColor"
                  // className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleCreateRole}
                  disabled={!newRoleName.trim()}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2 justify-end">
                      <LoadingIcon
                        icon="spinning-circles"
                        className="w-6 h-6"
                      />
                      <div className=" text-xs text-center">Creating...</div>
                    </div>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
      )}

      {/* Data List or Loading Indicator */}
      {loading ? (
        <div className="col-span-12 flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center w-full">
            <LoadingIcon icon="bars" className="w-8 h-8" />
            <div className="mt-2 text-xs text-center">Loading data</div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Main content area */}
          <div className=" w-full">
            <div className="flex flex-col gap-6">
              <NewRoleSection
                resetNewRoleForm={handleResetNewRoleForm}
                setShowNewRoleModal={hanldeShowNewRoleModal}
              />

              <div className="flex bg-white space-x-6">
                {/* Left sidebar */}
                {/* <ActiveCampaignsSection roles = {roles}  getActiveRole = {getActiveRole}/> */}
                <ActiveRoleSection
                  roles={roles}
                  activeRole={activeRole!}
                  onRoleClick={handleRoleClick}
                />

                {/* Main content with scrollable sections */}
                <div className="flex flex-col w-full gap-8 p-6  bg-neutralneutral-bg-day rounded-[0px_10px_10px_0px] border border-solid border-neutralneutral-border-day overflow-y-auto">
              
                  {activeRole && (
                    <SettingsWrapperSection
                      isDisabled={loading}
                      onSave={handleSave}
                      activeRole={activeRole}
                    />
                  )}
                  <div className="flex flex-col gap-8 w-full border-b border-[#e4e4e499]">
                    <h2 className="text-xl font-semibold mb-4">
                      Permissions for: {activeRole?.name}
                    </h2>

                   

                    {activeRole && rolePrivileges[activeRole.id] && (
                      <ClientPermissionsSection
                        privileges={rolePrivileges[activeRole.id]}
                        onToggle={handleCheckboxChange}
                      />
                    )}
                    <Separator className="w-full" />

       

                    {activeRole && rolePrivileges[activeRole.id] && (
                      <CampaignPermissionsSection
                        privileges={rolePrivileges[activeRole.id]}
                        onToggle={handleCheckboxChange}
                      />
                    )}

                    <Separator className="w-full" />


                    {activeRole && rolePrivileges[activeRole.id] && (
                      <PaymentPermissionSection
                        privileges={rolePrivileges[activeRole.id]}
                        onToggle={handleCheckboxChange}
                      />
                    )}

           

                    <Separator className="w-full" />

            
                    {activeRole && rolePrivileges[activeRole.id] && (
                      <BillboardPermissionSection
                        privileges={rolePrivileges[activeRole.id]}
                        onToggle={handleCheckboxChange}
                      />
                    )}

                    <Separator className="w-full" />


                    {activeRole && rolePrivileges[activeRole.id] && (
                      <UserPermissionSection
                        privileges={rolePrivileges[activeRole.id]}
                        onToggle={handleCheckboxChange}
                      />
                    )}
                    <Separator className="w-full" />


                    {activeRole && roleEmailPrivileges[activeRole.id] && (
                      <EmailPermissionSection
                        privileges={roleEmailPrivileges[activeRole.id]}
                        onToggle={handleEmailCheckboxChange}
                      />
                    )}
                    <Separator className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Notification id="success-notification-content" className="flex">
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Update Successful</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>

      <Notification id="failed-notification-content" className="flex">
        <Lucide icon="XCircle" className="text-danger" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Update Failed!</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
};

export default ErpRoleManagement;
