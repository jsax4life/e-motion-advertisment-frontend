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
import BillboardCreationModal from "./BillboardCreationModal";
import Notification from "../../base-components/Notification";
import Toastify from "toastify-js";
import { PullBillboardContext } from "../../stores/BillboardDataContext";
import DisplaySection from "./DisplaySection";
import { formatDate } from "../../utils/utils";
import BillboardEditingModal from "./BillboardEditingModal";
import PriceEditingModal from "./PriceEditingModal";


export default function Main() {
  const { user } = useContext(UserContext);

  const [openModal, setOpenModal] = useState(false);

  const [billboard, setBillboard] = useState<any>();
  const { billboards, billboardDispatch } = useContext(PullBillboardContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [billboardList, setBillboardList] = useState<any>([]);

const {id} = useParams<{id: any}>();

  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "State" | "Status" | "Orientation" | "Type"
  >("State");
  const cancelButtonRef = useRef(null);
  const isInitialMount = useRef(true);

  console.log(id)

  // console.log(vehicleList)

  const navigate = useNavigate();

  const handleUpdateBillboard = (data: any) => {
    console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "put",
      `billboards/${billboard?.id}`,

      data,
      function (response: any) {
        console.log(response);
        // setBillboard((prev: any) =>  reponse.data);
        setBillboard((prev: any) => ({
          ...prev,
          ...response.data
        }));
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

  const handleUpdatePrice = (data: { pricePerMonth: number; pricePerDay: number }) => {
    console.log("Updating price:", data);
    setLoading(true);

    API(
      "patch",
      `billboards/${billboard?.id}/price`,
      data,
      function (response: any) {
        console.log(response);
        setBillboard((prev: any) => ({
          ...prev,
          ...response.data
        }));
        setLoading(false);
        setIsPriceModalOpen(false);

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
      },
      function (error: any) {
        console.error("Error updating price:", error);
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
  };


  useEffect(() => {
    if (user?.token) {
      fetchDashboardData();
    }
  }, [user?.token]);

  // Add event listener for edit price button
  useEffect(() => {
    const handleEditPrice = (event: CustomEvent) => {
      setIsPriceModalOpen(true);
    };

    window.addEventListener('editPrice', handleEditPrice as EventListener);

    return () => {
      window.removeEventListener('editPrice', handleEditPrice as EventListener);
    };
  }, []);

  const fetchDashboardData = () => {
    if(!id) {
        setError("Billboard ID not found");
    }

    setLoading(true);

    const billboardId = parseInt(id);
    if (billboards && billboards.length > 0) {
      const billboard = billboards.find((b: { id: number; }) => b.id === billboardId);
      if (billboard) {
        setBillboard(billboard);
        console.log("Billboard found in context:", billboard);
        setLoading(false);
        return;
      }

    }


    API('get', `billboards/${billboardId}`, {}, 
    (response: { billboard: any; }) => {
        setBillboard(response?.billboard);
        setLoading(false);
        // add the fetched billboard to the context
        billboardDispatch({
          type: "ADD_BILLBOARD",
          payload: response?.billboard,
        });
      
    }
    , (error: any) => {
        setLoading(false);
        setError("Failed to fetch billboard");
    }, user?.token);
  };


console.log(billboard)
 
  return (
    <>
  

      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 lg:mt-0 intro-y   py-8  ">
        <div className="col-span-12 justify-start items-start flex  intro-y sm:flex">
          {/* <div className='mr-auto'>
            <h2 className="text-lg font-medium text-black intro-y ">Users</h2>
            <p className="mt-4 text-xs text-black intro-y">View, Edit and Delete users</p>
          </div> */}
          <div className=" hidden mr-auto md:block capitalize">
            <div className="flex justify-center items-center ">
            <h2 className="mr-5 text-3xl font-bold truncate lg:max-w-md md:max-w-sm ">{billboard?.billboardName}</h2>
            <div className="w-2 h-2 border rounded-full bg-green-400 mr-2"></div>
            <div className="font-normal text-sm"> {billboard?.status}</div>
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
           
           onClick={() => setIsModalOpen(true)}
           className="mr-2 flex  justify-center items-center font-medium shadow-sm bg-customColor rounded-lg px-4 py-2 text-white text-sm"
          >
            <Lucide icon="Plus" className="w-5 h-5 mr-2 " /> Edit Billboard
          </Button>

          <Button className="mr-2 shadow-sm  border-slate-300 py-1.5">
            <Lucide icon="Download" className="w-5 h-5 mr-2" /> Export as Excel
          </Button>


          <BillboardEditingModal
        isOpen={isModalOpen}
        billboard={billboard}
        isLoading={loading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateBillboard}
      />

      <PriceEditingModal
        isOpen={isPriceModalOpen}
        billboard={billboard}
        isLoading={loading}
        onClose={() => setIsPriceModalOpen(false)}
        onSubmit={handleUpdatePrice}
      />

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
                  Logs
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
              <DisplaySection loading={loading} billboard={billboard} />
            </Tab.Panel>

           

            <Tab.Panel>
             
<div className="grid grid-cols-12 gap-x-4 text-slate-600  ">
      <div className=" col-span-12 flex flex-col lg:p-5 p-2 gap-y-4 rounded-2xl  bg-white lg:col-span-8 overflow-auto intro-y 2xl:overflow-visible">
        {/* <div className="text-xl font-medium text-slate-600">Billboard Details</div> */}

        {billboard?.activity_logs?.map((log: any, logKey: Key) => {
//   const newValues = typeof log?.new_values === "string" ? JSON.parse(log.new_values) : log?.new_values;

            return (<div className="">

                    <div className="text-customColor text-sm font-bold" key={logKey}>
                            {log?.admin.firstName} {log?.admin.lastName} {log?.type}  {billboard?.billboardName}
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
                <div className="font-medium">Billboard Updated!</div>
                <div className="mt-1 text-slate-500">
                Successfully updated billboard
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
