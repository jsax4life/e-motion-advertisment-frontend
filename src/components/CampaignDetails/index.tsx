/* This example requires Tailwind CSS v2.0+ */
import { Fragment, Key, useContext, useEffect } from "react";


import _, { set } from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
import Button from "../../base-components/Button";

import Lucide from "../../base-components/Lucide";
import {  Tab } from "../../base-components/Headless";

import Tippy from "../../base-components/Tippy";
import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import Breadcrumb from "../../base-components/Breadcrumb";
import Notification from "../../base-components/Notification";
import Toastify from "toastify-js";
import { PullBillboardContext } from "../../stores/BillboardDataContext";
import { formatDate } from "../../utils/utils";
// import EditOrderModal from "./EditOrderModal";
import DisplayDetailsSection from "./DisplayDetailSection";
import { PullCampaignContext } from "../../stores/CampaignDataContext";
import  ChangeOrderStatusModal from "../../pages/Campaigns/Orders/ChangeStatusModal";
import  EditOrderModal from "../../pages/Campaigns/Orders/EditOrderModal";

import  ChangeDeliveryStatusModal from "../../pages/Campaigns/Orders/delivered/ChangeStatusModal"
import ChangeFinanceStatusModal from "../../pages/Finance/ChangeStatusModal";

import toast from "react-hot-toast";

// different background colors for different status
const statusColors = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  paid: "bg-blue-500",
  delivered: "bg-purple-500",
  frozen: "bg-red-500",
};


export default function DeliveredCampaignDetails({ section }: { section: string }) {
  const { user } = useContext(UserContext);

  const [openModal, setOpenModal] = useState(false);

  const [campaign, setCampaign] = useState<any>();
  const { campaigns, campaignDispatch } = useContext(PullCampaignContext);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const {  billboardDispatch } = useContext(PullBillboardContext);

const {id} = useParams<{id: any}>();
const location = useLocation(); 

  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "State" | "Status" | "Orientation" | "Type"
  >("State");

  // console.log(vehicleList)

  const navigate = useNavigate();

  const handleUpdateOrder = (data: any) => {
    console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "patch",
      `campaign-orders/${campaign?.id}`,

      data,
      function (reponse: any) {
        console.log(reponse);
        setCampaign((prev: any) => ({
          ...prev,  
          ...reponse.data,
          billboards: reponse.data.billboards, 
        }));
        setLoading(false);
        setEditModalOpen(false);
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

      
      
      API(
        "get",
        `billboard-data`,
        {},
        // {lga: 'Alimosho'},
        function (data: any) {
          billboardDispatch({ type: "STORE_BILLBOARD_DATA", billboard: data.registered_billboards });
        },
        function (error: any) {
          console.error("Error fetching recent searches:", error);
        },
        user?.token && user.token
      );

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


  const handleUpdateCampaignStatus = (data: any) => {
    console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "patch",
      `campaign-orders/${campaign?.id}/status`,

      data,
      function (reponse: any) {
        console.log(reponse);
        setLoading(false);
        setStatusModalOpen(false);


        setLoading(false);
        toast.success("Status updated successfully");
      },

      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);


        setErrorMessage(error);
        toast.error(error)
     
      },
      user?.token && user.token
    );
    // Call your API to add a new billboard here
  };

  
  const handleUpdateCampaignPaymentStatus = (data: any) => {
    // console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "patch",
      `campaign-orders/${campaign?.id}/payment-status`,

      data,
      function (reponse: any) {
        console.log(reponse);
        setLoading(false);
        setStatusModalOpen(false);


        setLoading(false);
        toast.success("Status updated successfully");
      },

      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);


        setErrorMessage(error);
        toast.error(error)
     
      },
      user?.token && user.token
    );
    // Call your API to add a new billboard here
  };


  useEffect(() => {
    if (user?.token) {
      fetchCampaignData();
    }
  }, [user?.token]);

  const fetchCampaignData = () => {
    if(!id) {
        setError("Billboard ID not found");
    }

    setLoading(true);

    const campaignId = parseInt(id);
    if (campaigns && campaigns.length > 0) {
      const campaign = campaigns.find((b: { id: number; }) => b.id === campaignId);
      if (campaign) {
        setCampaign(campaign);
        setLoading(false);
        return;
      }

    }


    API('get', `billboards/${campaignId}`, {}, 
    (response: { data: any; }) => {
        setCampaign(response?.data);
        setLoading(false);
        campaignDispatch({ type: 'STORE_CAMPAIGN_DATA', campaign: response.data });
    }
    , (error: any) => {
        setLoading(false);
        setError("Failed to fetch billboard");
    }, user?.token);
  };


// console.log(campaign)
 
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
            <h2 className="mr-5 text-3xl font-bold truncate ">{campaign?.campaign_name}</h2>
            <div className={`w-2 h-2 border rounded-full 
            ${statusColors[campaign?.status as keyof typeof statusColors] || "bg-gray-100"}  mr-2`}></div>
            
            <div className="font-normal text-sm"> {campaign?.status}</div>
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
                Billboard
              </Breadcrumb.Link>
            </Breadcrumb>
          </div>

          <Button
           
           onClick={() =>     setStatusModalOpen(true) }
           className="mr-2 flex  justify-center items-center font-medium shadow-sm bg-customColor rounded-lg px-4 py-2 text-white text-sm"
          >
            <Lucide icon="Plus" className="w-5 h-5 mr-2 " />  Status Update
          </Button>

         {/* <Button
           
           onClick={() => setIsModalOpen(true)}
           className="mr-2 flex  justify-center items-center font-medium shadow-sm rounded-lg px-4 py-2 text-customColor border-customColor text-sm"
          >
            Modify 
          </Button> */}
          {section === "order" && (
              <Button
           
              onClick={() => setEditModalOpen(true)}
              className="mr-2 flex  justify-center items-center font-medium shadow-sm rounded-lg px-4 py-2 text-customColor border-customColor text-sm"
             >
               Modify 
             </Button>
          )}

          <Button className="mr-2 shadow-sm  border-slate-300 py-1.5">
            <Lucide icon="Download" className="w-5 h-5 mr-2" /> Export as Excel
          </Button>

      

{/* {isModalOpen && (
          <EditOrderModal
        isOpen={isModalOpen}
        orderToEdit={campaign}
        isLoading={loading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateOrder}
      />)} */}

{section === "delivery" && (
<ChangeDeliveryStatusModal
        isOpen={isStatusModalOpen}
        campaign={campaign}
        isLoading={loading}
        onClose={() => setStatusModalOpen(false)}
        onSubmit={handleUpdateCampaignStatus}
      />
)}

{section === "order" && (
   <>
        <EditOrderModal
      isOpen={isEditModalOpen}
      orderToEdit={campaign}
      isLoading={loading}
      onClose={() => setEditModalOpen(false)}
      onSubmit={handleUpdateOrder}
    />

<ChangeOrderStatusModal
      isOpen={isStatusModalOpen}
      campaign={campaign}
      isLoading={loading}
      onClose={() => setStatusModalOpen(false)}
      onSubmit={handleUpdateCampaignStatus}
    />
    </>


    

)}

{section === "finance" && (
    <ChangeFinanceStatusModal
        isOpen={isStatusModalOpen}
        campaign={campaign}
        isLoading={loading}
        onClose={() => setStatusModalOpen(false)}
        onSubmit={handleUpdateCampaignPaymentStatus}
      />
)}

        </div>


    

        <Tab.Group className="col-span-12">
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
              <DisplayDetailsSection loading={loading} campaign={campaign} />
            </Tab.Panel>

           

            <Tab.Panel>
             
<div className="grid grid-cols-12 gap-x-4 text-slate-600  ">
      <div className=" col-span-12 flex flex-col lg:p-5 p-2 gap-y-4 rounded-2xl  bg-white lg:col-span-8 overflow-auto intro-y 2xl:overflow-visible">
        {/* <div className="text-xl font-medium text-slate-600">Billboard Details</div> */}

        {campaign?.activity_logs?.map((log: any, logKey: Key) => {
//   const newValues = typeof log?.new_values === "string" ? JSON.parse(log.new_values) : log?.new_values;

            return (<div className="">

                    <div className="text-customColor text-sm font-bold" key={logKey}>
                            {log?.admin.firstName} {log?.admin.lastName} {log?.type}  {campaign?.campaign_name}
                    </div>
                    <div className="text-black text-sm">
                            {log?.remarks}
                    </div>
                    <div className="text-slate-500 text-sm">
                            {formatDate(log?.created_at)}
                    </div>
                </div>)
                
            
            }
                    
        )}


     
       

    
      </div>
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
                <div className="font-medium">Billboard Added!</div>
                <div className="mt-1 text-slate-500">
                Successfully  added new billboard
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
