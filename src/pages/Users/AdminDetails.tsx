/* This example requires Tailwind CSS v2.0+ */
import { Fragment, Key, useContext, useEffect } from "react";
// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import _, { set } from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
import Button from "../../base-components/Button";

import Lucide from "../../base-components/Lucide";
import { Dialog, Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";

import Litepicker from "../../base-components/Litepicker";
import Tippy from "../../base-components/Tippy";
import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import FilterChips from "../../components/FilterChips";
import FilterModal from "../Dashboard/filterModal";
import Breadcrumb from "../../base-components/Breadcrumb";
import Notification from "../../base-components/Notification";
import Toastify from "toastify-js";
import { PullBillboardContext } from "../../stores/BillboardDataContext";
import DisplaySection from "./DisplaySection";
import { formatDate } from "../../utils/utils";
import AdminEditingModal from "./AdminEditingModal";


const usersStatus = [
  "Inactive",
  "Active",
]

export default function Main() {
  const { user } = useContext(UserContext);

  const [openModal, setOpenModal] = useState(false);

  const [client, setUser] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);

const {id} = useParams<{id: any}>();
const [adminDetails, setAdminDetails] = useState<any>(null);


  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "State" | "Status" | "Orientation" | "Type"
  >("State");
  const cancelButtonRef = useRef(null);
  const isInitialMount = useRef(true);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const [active, setActive] = useState<any>();
const [message, setMessage] = useState("");

  // console.log(vehicleList)

  const navigate = useNavigate();

  const handleUpdateClient = (data: any) => {
    console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "put",
      `update-admin/${id}`,

      data,
      function (reponse: any) {
        console.log(reponse);
        setUser(reponse?.data);
        setLoading(false);
        setIsModalOpen(false);


        setLoading(false);
        const successEl = document
        .querySelectorAll("#success-notification-content")[0]
        .cloneNode(true) as HTMLElement;
  
      successEl.classList.remove("hidden");
      Toastify({
        node: successEl,
        duration: 8000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
        // console.log(responseData);
      },

      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);


        setErrorMessage(error);
        const failedEl = document
        .querySelectorAll("#failed-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      failedEl.classList.remove("hidden");
      Toastify({
        node: failedEl,
        duration: 8000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
      },
      user?.token && user.token
    );
    // Call your API to add a new billboard here
  };


  

  useEffect(() => {
    if (user?.token) {
        fetchAdminData();
    }
  }, [user?.token]);


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
 

// console.log(billboard)
 
  return (
    <>
  

      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 lg:mt-0 intro-y   py-8  ">
        <div className="col-span-12 justify-start items-start flex  intro-y sm:flex">
          {/* <div className='mr-auto'>
            <h2 className="text-lg font-medium text-black intro-y ">Users</h2>
            <p className="mt-4 text-xs text-black intro-y">View, Edit and Delete users</p>
          </div> */}
          <div className=" hidden mr-auto md:block capitalize">
            <div className="flex justify-center items-center">
            <h2 className="mr-5 text-3xl font-bold truncate ">{adminDetails?.firstName} {adminDetails?.lastName}</h2>
            {/* <div className="w-2 h-2 border rounded-full bg-green-400 mr-2"></div> */}
            <div className="font-normal text-sm"> {usersStatus[adminDetails?.active]}</div>
            </div>
            <Breadcrumb
              light={false}
              className={clsx([
                "h-[45px]  text-xs md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
                // props.layout != "top-menu" && "md:pl-6",
              ])}
            >
              <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
              <Breadcrumb.Link to="/" active={true}>
                Users
              </Breadcrumb.Link>
            </Breadcrumb>
          </div>

          <Button
           
           onClick={() => setIsModalOpen(true)}
           className="mr-2 flex  justify-center items-center font-medium shadow-sm bg-customColor rounded-lg px-4 py-2 text-white text-sm"
          >
            <Lucide icon="Plus" className="w-5 h-5 mr-2 " /> Edit 
          </Button>

          <Button className="mr-2 shadow-sm  border-slate-300 py-1.5">
            <Lucide icon="Download" className="w-5 h-5 mr-2" /> Export as Excel
          </Button>


          <AdminEditingModal
        isOpen={isModalOpen}
        admin={adminDetails}
        isLoading={loading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateClient}
      />

      

        </div>


    

        <Tab.Group className="lg:col-span-8  col-span-12">
          <div className="  space-x-4 justify-between items-center flex  intro-y   pt-5 lg:pt-2  intro-y ">
            <Tab.List
              variant="link-tabs"
              className="flex-col justify-center text-center sm:flex-row lg:justify-start border-b  border-neutral-300 md:w-auto"
            >
              <Tab fullWidth={false}>
                <Tab.Button className="flex items-center cursor-pointer ">
                  {/* <Lucide icon="User" className="w-4 h-4 mr-2" />  */}
                  Details
                </Tab.Button>
              </Tab>
         
              <Tab fullWidth={false}>
                <Tab.Button className="flex items-center  cursor-pointer">
                  {/* <Lucide icon="Shield" className="w-4 h-4 mr-2" /> */}
                  Log & Comments
                </Tab.Button>
              </Tab>
    
            </Tab.List>

       
          </div>

          <Tab.Panels className="mt-5">
            {loading && (
              <div className="col-span-12 flex items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center w-full">
                  <LoadingIcon icon="bars" className="w-8 h-8" />
                  <div className="mt-2 text-xs text-center">Loading data</div>
                </div>
              </div>
            )}

            <Tab.Panel>
              <DisplaySection loading={loading} admin={adminDetails} />
            </Tab.Panel>

     

            <Tab.Panel>
             
      <div className=" col-span-12  flex flex-col lg:p-5 p-2 gap-y-4 rounded-2xl  bg-white lg:col-span-8 overflow-auto intro-y 2xl:overflow-visible ">
        {/* <div className="text-xl font-medium text-slate-600">Billboard Details</div> */}

        {client?.client_activity_logs?.map((log: any, logKey: Key) => {
//   const newValues = typeof log?.new_values === "string" ? JSON.parse(log.new_values) : log?.new_values;

            return (<div className="">

                    <div className="text-customColor text-sm font-bold" key={logKey}>
                            {log?.admin.firstName} {log?.admin.lastName} {log?.action}  {client?.company_name}
                    </div>
                    <div className="text-slate-500 text-sm">
                            {formatDate(log?.created_at)}
                    </div>
                </div>)
                
            
            }
                    
        )}
     
       

    
      </div>
            </Tab.Panel>

         
          </Tab.Panels>
        </Tab.Group>

   

      </div>

      <Notification
              id="success-notification-content"
              className="flex  "
            >
              <Lucide icon="CheckCircle" className="text-success" />
              <div className="ml-4 mr-4">
                <div className="font-medium">Client Updated!</div>
                <div className="mt-1 text-slate-500">
                Successfully  updated client
                </div>
              </div>
            </Notification>
            {/* END: Success Notification Content */}
            {/* BEGIN: Failed Notification Content */}
            <Notification
              id="failed-notification-content"
              className="flex"
            >
              <Lucide icon="XCircle" className="text-danger" />
              <div className="ml-4 mr-4">
                <div className="font-medium">Failed to Create!</div>
                <div className="mt-1 text-slate-500">
                  {errorMessage}
                </div>
              </div>
            </Notification>
    </>
  );
}
