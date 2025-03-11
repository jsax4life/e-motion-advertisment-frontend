/* This example requires Tailwind CSS v2.0+ */
import { Fragment, Key, useContext, useEffect } from "react";
// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import _, { set } from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
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
import ClientEditingModal from "./ClientEditingModal";
import { PullClientContext } from "../../stores/ClientDataContext";
import ClientCampaign from "./ClientCampaigns";


export default function Main() {
  const { user } = useContext(UserContext);

  const [openModal, setOpenModal] = useState(false);

  const [client, setClient] = useState<any>();
  const { clients, clientDispatch } = useContext(PullClientContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientList, setClientList] = useState<any>([]);

const {id} = useParams<{id: any}>();

  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "State" | "Status" | "Orientation" | "Type"
  >("State");
  const cancelButtonRef = useRef(null);
  const isInitialMount = useRef(true);

  // console.log(vehicleList)

  const navigate = useNavigate();

  const handleUpdateClient = (data: any) => {
    console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "put",
      `clients/${client?.id}`,

      data,
      function (reponse: any) {
        console.log(reponse);
        setClient(reponse?.data);
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
      fetchDashboardData();
    }
  }, [user?.token]);

  const fetchDashboardData = () => {
    if(!id) {
        setError("Billboard ID not found");
    }

    setLoading(true);

    const clientId = parseInt(id);
    if (clients && clients.length > 0) {
      const client = clients.find((c: { id: number; }) => c.id === clientId);
      if (client) {
        setClient(client);
        setLoading(false);
        return;
      }

    }


    API('get', `clinets/${clientId}`, {}, 
    (response: { data: any; }) => {
        setClient(response?.data);
        setLoading(false);
        clientDispatch({ type: 'STORE_CLIENT_DATA', client: response.data });
    }
    , (error: any) => {
        setLoading(false);
        setError("Failed to fetch billboard");
    }, user?.token);
  };

const imageUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  const DisplayStats = ({statTitle, statvalue} : any) => {
    return (
        <div className="relative  w-full py-2 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full"
            src={imageUrl}
            alt="admin"
          />
        </div>

        <div className="flex-1 ">
            {/* Extend touch target to entire panel */}
            {/* <span className="absolute inset-0" aria-hidden="true" /> */}
            <div className=" text-xs uppercase  text-slate-500">
              {statTitle}
            
            </div>
            <p className="text-xs truncate font-medium text-gray-900">
              {statvalue}
            </p>
        </div>
      </div>
    )
  }

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
            <h2 className="mr-5 text-3xl font-bold truncate ">{client?.company_name}</h2>
            {/* <div className="w-2 h-2 border rounded-full bg-green-400 mr-2"></div> */}
            <div className="font-normal text-sm"> {client?.status}</div>
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
                Client
              </Breadcrumb.Link>
            </Breadcrumb>
          </div>

          <Button
           
           onClick={() => setIsModalOpen(true)}
           className="mr-2 flex  justify-center items-center font-medium shadow-sm bg-customColor rounded-lg px-4 py-2 text-white text-sm"
          >
            <Lucide icon="Plus" className="w-5 h-5 mr-2 " /> Edit Client
          </Button>

          <Button className="mr-2 shadow-sm  border-slate-300 py-1.5">
            <Lucide icon="Download" className="w-5 h-5 mr-2" /> Export as Excel
          </Button>


          <ClientEditingModal
        isOpen={isModalOpen}
        client={client}
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
                  Campaigns
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
              <DisplaySection loading={loading} client={client} />
            </Tab.Panel>

            <Tab.Panel>
              <ClientCampaign loading={loading} campaignList={client?.campaign_order} />
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

        <div className="lg:col-span-4 lg:mt-20 col-span-12 justify-start items-start flex  intro-y sm:flex">
        <div className=" p-5  w-full flex flex-col gap-y-4 rounded-2xl  bg-white  overflow-auto intro-y 2xl:overflow-visible">
        <div className="border-b border-slate-200 pb-4 text-xl font-bold text-black">
          client stats
        </div>


      

              <DisplayStats statTitle = "Total Campaigns" statvalue= {client?.campaign_order?.length}/>
              <DisplayStats statTitle = " Total Campaign Days" statvalue= {355}/>
              <DisplayStats statTitle = " Total Billboards" statvalue= {355}/>
              <DisplayStats statTitle = " prefered billboard" statvalue= "Billboard 002"/>


            
         
      </div>
        </div>

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
