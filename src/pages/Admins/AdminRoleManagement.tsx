/* This example requires Tailwind CSS v2.0+ */
import { useContext, useEffect } from "react";
// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import { useState, useRef } from "react";
import Toastify from "toastify-js";

import Lucide from "../../base-components/Lucide";
import Table from "../../base-components/Table";

import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import Button from "../../base-components/Button";
import Notification from "../../base-components/Notification";

// | "Super Admin"
// | "Administrator"
// | "Operation Manager"
// | "Operation Officer"
// | "Vehicle Registration Officer"
// | "Vehicle Attachment Officer";

type Role =
|'Super Admin'
|'Administrator'
|'Operation Manager'
|'Guest'
|'CEO'
|'Finance'
  
type Privilege =
|'add_users'
|'change_password'
|'view_vehicle'
|'edit_vehicle'
|'view_users'
|'edit_users'
|'delete_user'
|'view_admins'
|'edit_admins'
|'delete_admin'
|'view_role'
|'delete_role'
|'dashboard_view'

// Initial privileges for each role (can be fetched from backend)

  const roles: Role[] = [
  'Super Admin',
    'Administrator',
    'Operation Manager',
    'Guest',
    'CEO',
    'Finance',
];

const privileges: Privilege[] = [
  'add_users',
  'change_password',
  'view_vehicle',
  'edit_vehicle',
  'view_users',
  'edit_users',
  'delete_user',
  'view_admins',
  'edit_admins',
  'delete_admin',
  'view_role',
  'delete_role',
  'dashboard_view',
];


  
  const roleMapping: Record<Role, number> = {
    'Super Admin' : 1,
    'Administrator': 2,
    'Operation Manager' : 3,
    'Guest' : 4,
    'CEO': 5,
    'Finance': 6,
  };
  
  const privilegeMapping: Record<Privilege, number> = {
    'add_users' : 1,
    'change_password' : 2,
    'view_vehicle' : 3,
    'edit_vehicle': 4,
    'view_users': 5,
    'edit_users': 6,
    'delete_user': 7,
    'view_admins': 8,
    'edit_admins': 9,
    'delete_admin': 10,
    'view_role': 11,
    'delete_role': 12,
    'dashboard_view': 13,
  };

  const initialPrivileges = roles.reduce((acc, role) => {
    acc[role] = privileges.reduce((roleAcc, privilege) => {
      roleAcc[privilege] = false;
      return roleAcc;
    }, {} as Record<Privilege, boolean>);
    return acc;
  }, {} as Record<Role, Record<Privilege, boolean>>);
  
  

const AdminRolePrivilegesTable: React.FC = () => {
  const [rolePrivileges, setRolePrivileges] = useState(initialPrivileges);
 
  const [roles, setRoles] = useState<Role[]>([]);

  const { user } = useContext(UserContext);

  const deleteButtonRef = useRef(null);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRole(); // Will also initialize rolePrivileges
  }, []);
  
  useEffect(() => {
    if (roles.length > 0) {
      fetchRolePrivileges(); // Only fetch privileges once roles are available
    }
  }, [roles]);
  

  const initializePrivileges = (roles: Role[]): Record<Role, Record<Privilege, boolean>> => {
    return roles.reduce((acc, role) => {
      acc[role] = privileges.reduce((roleAcc, privilege) => {
        roleAcc[privilege] = false;
        return roleAcc;
      }, {} as Record<Privilege, boolean>);
      return acc;
    }, {} as Record<Role, Record<Privilege, boolean>>);
  };
  

 

    const fetchRolePrivileges = () => {
      setLoading(true);
    
      API(
        "get",
        "get-role-privileges",
        {},
        function (response: any) {
          const updatedPrivileges = initializePrivileges(roles);
          response.forEach((roleData: { role: Role, privileges: number[] }) => {
            privileges.forEach((privilege, index) => {
              updatedPrivileges[roleData.role][privilege] = roleData.privileges.includes(index + 1);
            });
          });
    
          setRolePrivileges(updatedPrivileges);
          setLoading(false);
        },
        function (error: any) {
          console.error("Error fetching role privileges:", error);
          setLoading(false);
        },
        user?.token && user.token
      );
    };
    


  
  // console.log(vehicleList)
  const fetchRole = () => {
    setLoading(true);
  
    API(
      "get",
      "get-roles",
      {},
      function (response: any) {
        const fetchedRoles = response.map((role: { role: Role }) => role.role);
        setRoles(fetchedRoles);
        setRolePrivileges(initializePrivileges(fetchedRoles));
        setLoading(false);
      },
      function (error: any) {
        console.error("Error fetching roles:", error);
        setLoading(false);
      },
      user?.token && user.token
    );
  };
  

//   const transformPrivilegesForBackend = () => {
//     const transformedData = Object.entries(rolePrivileges).reduce(
//       (acc, [role, privileges]) => {
//         const selectedPrivileges = Object.entries(privileges)
//           .filter(([privilege, isChecked]) => isChecked) // Only include checked privileges
//           .map(([privilege]) => privilegeMapping[privilege as Privilege]); // Map privilege names to IDs
  
//         acc[role as Role] = selectedPrivileges; // Store the transformed role privileges
//         return acc;
//       },
//       {} as Record<Role, number[]>
//     );
  
//     return transformedData;
//   };

const transformPrivilegesForBackend = () => {
    const transformedData = Object.entries(rolePrivileges).reduce(
      (acc, [role, privileges]) => {
        const selectedPrivileges = Object.entries(privileges)
          .filter(([privilege, isChecked]) => isChecked)
          .map(([privilege]) => privilegeMapping[privilege as Privilege]);

        acc[role as Role] = selectedPrivileges;
        return acc;
      },
      {} as Record<Role, number[]>
    );

    return transformedData;
  };


  const handleSubmit = () => {

    setMessage("");
    setLoading(true);
  
    const transformedData = transformPrivilegesForBackend();

   
  // Prepare the batch request payload
  const payload = Object.entries(transformedData).map(([role, privilegeIds]) => ({
    role_id: roleMapping[role as Role], // Get the corresponding role ID
    privilege_ids: privilegeIds,        // The privilege IDs for the role
  }));

  console.log(payload);  // Check the payload structure


    API(
        "post",
        `roles/batch-update-privileges`, // Adjust this to your backend route for batch update
        { roles: payload },               // Send the entire batch of role-privilege pairs
      function (response: any) {
        console.log(response)
        setMessage(response?.message)
        setLoading(false);

        showToast(true); // Show error toast with the error message

      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);
        setMessage(error);
        showToast(false); // Show success toast

      },
      user?.token && user.token
    );


  };

  

  // Toastify helper for both success and error
  const showToast = (isSuccess: boolean, message?: string) => {
    const toastEl = document
      .querySelectorAll(isSuccess ? "#success-notification-content" : "#failed-notification-content")[0]
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

const handleCheckboxChange = (role: Role, privilege: Privilege) => {
    setRolePrivileges((prevState) => ({
      ...prevState,
      [role]: {
        ...prevState[role],
        [privilege]: !prevState[role][privilege],
      },
    }));
  };

//   const navigate = useNavigate();

  console.log(rolePrivileges);

  return (
    <>
      <div className="max-w-7xl mx-auto pb-12 lg:pb-0  lg:px-0 lg:mx-0 ">
        <div className="bg-white   px-5 py-6 sm:px-6">
          {/* Content Section */}
          <div className="flex justify-end items-center">
            <Link
              to="#"
              className="mr-2 flex font-medium shadow-sm bg-customColor rounded-lg px-4 py-2 text-white"
            >
              <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New Role
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-6 mt-5">
            {/* Data List or Loading Indicator */}
            {loading ? (
              <div className="col-span-12 flex items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center w-full">
                  <LoadingIcon icon="bars" className="w-8 h-8" />
                  <div className="mt-2 text-xs text-center">Loading data</div>
                </div>
              </div>
            ) : (
              <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
                {/* Your table or data list */}
                {/* Render your vehicleList here */}

                <Table className="border-spacing-y-[2px] border-separate -mt-2">
                  <Table.Thead className="bg-customColor/5 lg:h-11">
                    <Table.Tr>
                      <Table.Th className="px-4 py-2 border-b-0 whitespace-nowrap">
                        Roles
                      </Table.Th>

                      {privileges.map((privilege) => (
                        <Table.Th
                          key={privilege}
                          className="px-4 py-2 border-b-0 whitespace-nowrap"
                        >
                          {privilege}
                        </Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody
                  // className='overflow-y-scroll h-10'
                  >
                    {roles.map((role) => (
                      <Table.Tr key={role} className="intro-x text-slate-600">
                        <Table.Td className="first:rounded-l-md last:rounded-r-md w-10  bg-white  dark:bg-darkmode-600 border-slate-200 border-b">
                          {role}
                        </Table.Td>

                        {privileges.map((privilege) => (
                          <Table.Td
                            key={privilege}
                            className=" first:rounded-l-md last:rounded-r-md w-10  bg-white  dark:bg-darkmode-600 border-slate-200 border-b "
                          >
                            <input
                              type="checkbox"
                              checked={rolePrivileges[role][privilege]}
                              onChange={() =>
                                handleCheckboxChange(role, privilege)
                              }
                              className="form-checkbox h-5 w-5 text-customColor"
                            />
                          </Table.Td>
                        ))}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>

                <Button
                onClick={handleSubmit}
                className="mt-4 bg-customColor text-white px-4 py-2 rounded"
              >
                Submit Changes
              </Button>
              </div>
              
            )}

        
            
          </div>
        
          
        </div>
      </div>

        
      <Notification id="success-notification-content" className="flex">
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                  <div className="font-medium">Update Successful</div>
                  <div className="mt-1 text-slate-500">
                  {message}
                  </div>
                </div>
              </Notification>
              {/* END: Success Notification Content */}
              {/* BEGIN: Failed Notification Content */}
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

export default AdminRolePrivilegesTable;
