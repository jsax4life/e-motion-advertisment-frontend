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
  |'Admin'
  |'Manager'
  |'Administrator'
  |'Operation Manager'
  |'Support Administrator'
  
type Privilege =
|'add_users'
|'change_password'
|'edit_users'
|'delete_user'
|'delete_role'
|'update_billboard_status'
|'update_campaign_status'
|'approve_campaign_order'
|'mark_campaign_as_paid'
|'deliver_campaign_order'

// Initial privileges for each role (can be fetched from backend)
const roles: Role[] = [
  'Super Admin',
  'Admin',
  'Manager',
  'Administrator',
  'Operation Manager',
  'Support Administrator',
];

const privileges: Privilege[] = [
  'add_users',
  'change_password',
  'edit_users',
  'delete_user',
  'delete_role',
  'update_billboard_status',
  'update_campaign_status',
  'approve_campaign_order',
  'mark_campaign_as_paid',
  'deliver_campaign_order',
];


  
  const roleMapping: Record<Role, number> = {
    "Super Admin": 1,
    "Admin": 2,
    "Manager" : 3,
    "Administrator": 4,
    "Operation Manager": 5,
    "Support Administrator": 6,
  };
  
  const privilegeMapping: Record<Privilege, number> = {
    'add_users': 1,
    'change_password' :2,
    'edit_users': 3,
    'delete_user': 4,
    'delete_role': 5,
    'update_billboard_status': 6,
    'update_campaign_status': 7,
    'approve_campaign_order': 8,
    'mark_campaign_as_paid': 9,
    'deliver_campaign_order': 10,
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

 

  const { user } = useContext(UserContext);

  const deleteButtonRef = useRef(null);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch the existing role privileges when the component mounts
  useEffect(() => {



    const fetchRolePrivileges = () => {

        // setError("");
        setLoading(true);
     
    
        API(
          "get",
          `get-role-privileges`,
          
          {},
        //   filterState,
          // {lga: 'Alimosho'},
          function (response: any) {
            const fetchedData = response;

            // Map the fetched data into the format that matches the rolePrivileges state
            const updatedPrivileges = { ...initialPrivileges };
            fetchedData.forEach((roleData: { role: Role, privileges: number[] }) => {
              privileges.forEach((privilege, index) => {
                // Assuming privileges are stored as ID numbers in the fetched data
                updatedPrivileges[roleData.role][privilege] = roleData.privileges.includes(index + 1); // Assuming privilege ID starts from 1
              });
            });
    
            setRolePrivileges(updatedPrivileges);
            setLoading(false);


          },
          function (error: any) {
            console.error("Error fetching recent searches:", error);
            setLoading(false);
          },
          user?.token && user.token
        );
    
    
      };
    


    fetchRolePrivileges();
  }, []); // Empty dependency array to ensure this runs only once on mount

  // console.log(vehicleList)


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
