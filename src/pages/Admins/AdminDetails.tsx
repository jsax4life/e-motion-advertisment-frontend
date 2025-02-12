/* This example requires Tailwind CSS v2.0+ */
import { Fragment, JSXElementConstructor, ReactElement, ReactNode, useContext, useEffect } from "react";

// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import _ from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";

import { Dialog, Menu, Tab } from "../../base-components/Headless";

import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import Tippy from "../../base-components/Tippy";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { formatDate } from "../../utils/utils";
import profile from "../../assets/images/profile.png"
import { FormSwitch } from "../../base-components/Form";
import Alert from "../../base-components/Alert";

// const tagStyle = [
//   "bg-red-200 text-green-white",
//   "bg-green-100 text-green-600",

// ];



type UserRoleKey = 'supper_administrator' | 'administrator' | 'operation_manager' | 'support_officer';



const userRole: Record<UserRoleKey, any> = {
  supper_administrator: 'Supper Admin',
  administrator: 'Administrator',
  operation_manager: 'operation_manager',
  support_officer: 'Support Officer',
};



export default function UserAdminDetails() {
  const { user } = useContext(UserContext);

  const { id } = useParams<{ id: string }>();
  const [adminDetails, setAdminDetails] = useState<any>(null);

  

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const [active, setActive] = useState<any>();
const [message, setMessage] = useState("");

  const navigate = useNavigate();

  

  useEffect(() => {
    if (user?.token) {
        fetchAdminData();
    }
  }, [user?.token]);

  const { rider, owner, user_activity_logs } = adminDetails ?? {};

  // const user_activity_logs: any[] =[];

  const isNull = 'Unavailable';

  const fetchAdminData = () => {

        setLoading(false);

    const userListFromLocalStorage = localStorage.getItem('adminList');
let adminList = userListFromLocalStorage ? JSON.parse(userListFromLocalStorage) : [];

console.log(adminList)
// Assuming you are looking for the user with id 2
const adminId = Number(id);
const admin = adminList.find((u: any) => u.id === adminId);

if (admin) {
       setAdminDetails(admin);
        setLoading(false);

        setActive(admin?.status)
  console.log("Admin found:", admin);
} else {
  setLoading(false);

  console.log("Admin not found");
}

    setError("");

    // const userListFromLocalStorage = localStorage.getItem('userList');
    // const userList = userListFromLocalStorage ? JSON.parse(userListFromLocalStorage) : [];
    // API(
    //   "get",

    //   `users/${id}/profile`, 
    //   {},

    //   function (userData: any) {
    //     console.log(userData?.data.user)
    //     setadminDetails(userData?.data?.user);
    //     setLoading(false);

    //     setActive(userData?.data?.user?.status)
    //   },
    //   function (error: any) {

    //     console.error("Error fetching recent searches:", error);
    //     setLoading(false);
    //   },
    //   user?.token && user.token
    // );
  };

  const deleteUser = () => {

    setMessage("");
    setError("");
    

    API(
      "delete",

      `delete-admin/${id}`, 
      {},

      // {lga: 'Alimosho'},
      function (response: any) {
        setActive(false);
        setMessage(response?.message)
        setDeleteConfirmationModal(false)

        console.log(response)
        setLoading(false);
      },
      function (error: any) {
        setDeleteConfirmationModal(false)

        console.error("Error fetching recent searches:", error);
        setLoading(false);
      },
      user?.token && user.token
    );
  };


  const activateUser = () => {

    setError("");
setMessage("")

    API(
      "post",

      `activate-users/${id}`, 
      {},

      // {lga: 'Alimosho'},
      function (response: any) {
        setActive(true);
        setMessage(response.message);
        // setDeleteConfirmationModal(false)

        console.log(response)
        setLoading(false);
      },
      function (error: any) {
        // setDeleteConfirmationModal(false)

        console.error("Error fetching recent searches:", error);
        setLoading(false);
      },
      user?.token && user.token
    );
  };

  const toggle = (val: any) => {
    console.log(val.target.checked)

    const toggleVal = val.target.checked;

    if (toggleVal) {
      activateUser();
    }else {
      deleteUser()
    }
  }
  
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>

     {/* BEGIN: Delete Confirmation Modal */}
     <Dialog
        open={deleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
            onClick={() => deleteUser()}
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
            >
              Deactivate
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}


          <div className=" mx-auto pb-12 lg:pb-0  lg:px-0 ">
            {/* Replace with your content */}

            

            <div className="bg-white   px-2 py-6 sm:px-6 sm:py-2">
              {/* content */}

             {message && ( <Alert
                      variant={`outline-${active? 'success' : 'warning'}`}
                      className="flex items-center mb-2 lg:w-1/2 intro-x"
                    >
                      {({ dismiss }) => (
                        <>
                          <Lucide icon={`${active? 'Check' : 'AlertCircle'}`} className="w-6 h-6 mr-2" />{" "}
                          {message}
                          <Alert.DismissButton
                            // type="button"
                            className="btn-close"
                            onClick={dismiss}
                            aria-label="Close"
                          >
                            <Lucide icon="X" className="w-4 h-4" />
                          </Alert.DismissButton>
                        </>
                      )}
                    </Alert>)}

              <Tab.Group>
                {/* BEGIN: Profile Info */}
                <div className=" pt-5 lg:pt-2  intro-y ">
   

                  <div className="flex flex-col pb-5 -mx-5  lg:flex-row border-slate-200/60 dark:border-darkmode-400">
           
                    <div className="flex items-center justify-center flex-1 px-5 md:justify-start">
         
                      <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-36 lg:h-36 image-fit">
                        <img
                          alt="Profile pix"
                          className="rounded-lg"
                          src={adminDetails?.profile_picture_url? adminDetails?.profile_picture_url : profile}
                        />
                      </div>
                      <div className="ml-5 items-center  ">

                      {/* <FormSwitch className="w-full mt-3 sm:w-auto sm:ml-auto sm:mt-0">
                    <FormSwitch.Label htmlFor="show-example-1">
                    <div
                          className={`  px-4 lg:py-1 py-0.5 rounded-full text-xs font-medium capitalize ${
                            tagStyle[adminDetails?.status]
                          }`}
                        >
                          {adminDetails?.status === 0? "Inactive" : adminDetails?.status === 1?  'Active' : 'Deactivated'}
                        </div>
                    </FormSwitch.Label>
                    <FormSwitch.Input
                      id="show-example-1"
                      onClick={toggle}
                      className="ml-3 mr-0"
                      type="checkbox"
                    />
                  </FormSwitch> */}

                        <div
                          className={`flex w-1/3 justify-start items-center text-center px-2 lg:py-1 py-0.5 mb-2 rounded-full text-xs font-medium capitalize ${
                            active?  "bg-green-100 text-green-600" : "bg-red-200 text-green-white"
                          }`}
                        >
                          {active? "Active" :  'Inactive'}

                          <FormSwitch className=" sm:w-auto  sm:mt-0">
                   
                    <FormSwitch.Input
                      id="show-example-1"
                      onClick={toggle}
                      className="ml-4"
                      type="checkbox"
                      checked = {active}
                      disabled
                    />
                  </FormSwitch>

                  <Button variant="primary" className="shadow-sm px-2 ml-8 bg-customColor" onClick={() => {
              navigate(`/edit-admin-profile/${id}`);
            }}
            
            disabled = {active}
            >Edit</Button>

                        </div>
                        <div className="w-24 lg:w-full text-xl font-medium truncate sm:w-40 sm:whitespace-normal">
                          {adminDetails?.name} 
                        </div>
                        <div className="text-slate-500 lg:mb-4 capitalize">
                          <span className="font-semibold text-md mr-2">
                            Role:
                          </span>
                          <span>{adminDetails?.roles[0]?.name}</span>
                        </div>

                        <div className="text-slate-500 hidden text-xs md:flex">
                        {/* <Button variant="primary" className="mr-2  px-4 py-1 bg-customColor" onClick={() => {
              navigate(`/edit-user-profile/${id}`);
            }}
            disabled = {!active}

            >Edit</Button> */}

                      {/* <Button className="mr-2 shadow-sm bg-white">
            <Lucide icon="Download" className="w-4 h-4 mr-2" /> Export As PDF Document
          </Button> */}
          {/* <Button variant="primary" className="mr-2  px-4 py-1 bg-red-700" onClick={() => {
                              setDeleteConfirmationModal(true);
                            }}
                            disabled = {adminDetails?.status === 0 || adminDetails?.status === 2}

                            >Delete</Button> */}
                        </div>
                      </div>

                    </div>
                  </div>
                  <Tab.List
                    variant="link-tabs"
                    className="flex-col justify-center text-center sm:flex-row lg:justify-start"
                  >
                    <Tab fullWidth={false}>
                      <Tab.Button className="flex items-center cursor-pointer ">
                        {/* <Lucide icon="User" className="w-4 h-4 mr-2" />  */}
                        User Details
                      </Tab.Button>
                    </Tab>
                  
                  </Tab.List>
                </div>
                {/* END: Profile Info */}
                <Tab.Panels className="mt-5">
                  <Tab.Panel>
                    <div className="grid grid-cols-12 gap-4 lg:gap-0 text-slate-600">
                      {/* BEGIN: Rider Details */}
                      <div className="col-span-12 intro-y  ">
                        <div className=" flex lg:col-span-6 justify-start items-center py-5 gap-x-6  border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400 text-md">
                          <div className=" lg:w-1/5 mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2">
                          <div className="font-semibold ">First Name:</div>
                          <div className="font-semibold ">last Name:</div>

                            <div className="font-semibold ">Gender:</div>
                            <div className="font-semibold ">Phone Number:</div>
                            <div className="font-semibold ">Email:</div>
                          </div>
                          <div className=" mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2 ">
                          <div className=" capitalize">
                              {adminDetails?.firstName}
                            </div>
                            <div className=" capitalize">
                              {adminDetails?.lastName}
                            </div>
                            <div className=" capitalize">
                              {adminDetails?.gender}
                            </div>

                            <div className="">{adminDetails?.phoneNumber}</div>
                            <div className="capitalize">{adminDetails?.email}</div>
                          </div>
                        </div>
                      </div>
                      {/* END: Rider Details */}


                      {/* BEGIN: Ownser's  */}

                     
                    
                    </div>
                  </Tab.Panel>

                  {/* <Tab.Panel>
                    <div className="grid grid-cols-12 gap-6 text-slate-600">
                      <div className="col-span-12 intro-y  ">
                        <div className=" flex justify-start items-center py-5 gap-x-6  border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                          <div className=" items-center mb-5">
                            <div className="font-semibold lg:mb-4 text-md">
                              Registration Fee
                            </div>
                            <div className="font-semibold lg:mb-4 text-md">
                              Plate Number:
                            </div>
                            <div className="font-semibold lg:mb-4 text-md">VIN:</div>
                            <div className="font-semibold lg:mb-4 text-md">
                              Vehicle Type
                            </div>
                            <div className="font-semibold lg:mb-4 text-md">
                              Manufacturer{" "}
                            </div>
                            <div className="font-semibold lg:mb-4 text-md">
                              Vehicle Color{" "}
                            </div>
                            <div className="font-semibold lg:mb-4 text-md">
                              Year of Purchase{" "}
                            </div>
                          
                          </div>

                          <div className=" items-center mb-5">
                            <div className="ml-auto lg:mb-4">4,500</div>

                            <div className="ml-auto lg:mb-4">{adminDetails?.plate_number? userDetails?.plate_number : isNull}</div>
                            <div className="ml-auto lg:mb-4">
                              {userDetails?.vin? userDetails?.vin: isNull}
                            </div>

                            <div className="ml-auto lg:mb-4">{userDetails?.vehicle_type? userDetails?.vehicle_type : isNull}</div>
                            <div className="ml-auto lg:mb-4">{userDetails?.manufacturer? userDetails?.manufacturer : isNull}</div>
                            <div className="ml-auto lg:mb-4">{userDetails?.vehicle_color? userDetails?.vehicle_color : isNull}</div>
                            <div className="ml-auto lg:mb-4">{userDetails?.year_of_purchase? userDetails?.year_of_purchase : isNull}</div>

                          </div>
                        </div>
                      </div>
                     
                      <div className="col-span-12 intro-y box text-base ">
                        <div className="flex items-center py-4">
                          <h3 className="intro-y box  font-semibold mr-4 text-sm">
                            VEHICLE IMAGES
                          </h3>
                          <hr className="flex-grow border-t border-slate-200/" />
                        </div>
                       



                        <div className="flex-1 gap-y-4 lg:px-5 pt-5 mt-2 border-t-2 lg:mt-0 lg:border-0 border-slate-200/60 dark:border-darkmode-400 lg:pt-0">
              <div className="flex justify-start items-center space-x-4 lg:flex-none text-sm lg:font-medium text-center lg:text-left lg:mt-5">
                <div>
                  <img alt="Front" className="" src={userDetails?.images?.vehicle_picture1} />
                </div>
                <div>
                  <img alt="Side" className="" src={userDetails?.images?.vehicle_picture2} />
                </div>
                <div>
                  <img alt="Aeriel" className="" src={userDetails?.images?.vehicle_picture3} />
                </div>
              </div>
            </div>

                      </div>

                    
                    </div>
                  </Tab.Panel> */}

                  
                </Tab.Panels>
              </Tab.Group>

              {/* end content */}

              {/* <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" /> */}
            </div>
            {/* /End replace */}
          </div>
    </>
  );
}



