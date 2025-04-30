/* This example requires Tailwind CSS v2.0+ */
import { useContext, useEffect } from "react";

import _, { set } from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
import Button from "../../../../base-components/Button";
import { FormInput } from "../../../../base-components/Form";
import Lucide from "../../../../base-components/Lucide";
import { Tab } from "../../../../base-components/Headless";

import { UserContext } from "../../../../stores/UserContext";
import { PullCampaignContext } from "../../../../stores/CampaignDataContext";
import API from "../../../../utils/API";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "../../../../base-components/LoadingIcon";

import Breadcrumb from "../../../../base-components/Breadcrumb";
import OrderCreationModal from "../OrderCreationModal";
import Notification from "../../../../base-components/Notification";
import Toastify from "toastify-js";
import DisplayTable from "./DisplayTable";
import OrderFilterModal from "./OrderFilterModal";
import FilterChips from "../../../../components/FilterChips";



interface Client {
  id: string;
  company_name: string;
}

interface AvailableBillboard {
  id: string;
  serialNumber: string,
  internalCode: string,
  billboardName: string;
  billboardType: "static" | "digital" | "bespoke";
  numberOfSlotsOrFaces: number;
  available_faces: number[];
  available_slots: number[];
  pricePerDay: number;
    state: string,
    lga: string,
    address: string,
    geolocation: object ,
    dimension: string, // Default dimension
    height: string,
    width: string,

    pricePerMonth: string,
    status: string,
    activeStatus: string,
    images: [],
    orientation: string,
}

export default function DeliveredCampaign() {
  const { user } = useContext(UserContext);
  const { campaignDispatch} = useContext(PullCampaignContext)

  // const [openModal, setOpenModal] = useState(false);

  const [orderList, setOrderList] = useState<any[]>([]);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);

  const [dateRange, setDateRange] = useState<string>("");


  const [kpiData, setKpiData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [billboards, setBillboards] = useState<AvailableBillboard[]>([]);

  

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");


  const [activeFilter, setActiveFilter] = useState<
    "Date"  
>("Date");

  const [loading, setLoading] = useState(true);

  // console.log(vehicleList)

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token) {
      fetchOrderData();
     
    }
  }, [user?.token, dateRange]);

  const fetchOrderData = () => {
    const [startDate, endDate] = dateRange?.split(" - ") || [null, null];

    setError("");
    setLoading(true);

console.log(startDate, endDate)
    const params: any = {};
    if (startDate && endDate) {
      params.start_date = startDate.trim();
      params.end_date = endDate.trim();
    }
    

    API(
      "get",
      `delivered-campaign-orders`,
      params,
      // {lga: 'Alimosho'},
      function (orderData: any) {
        setOrderList(orderData?.data);
        campaignDispatch({ type: "STORE_CAMPAIGN_DATA", campaign: orderData?.data });
        setLoading(false);
        console.log(orderData);
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);
      },
      user?.token && user.token
    );
  };

  // const fetchClients = () => {

  //   setLoading(true);

  //   API(
  //     "get",
  //     `clients-data`,
  //     {},
  //     function (data: any) {
  //       setClients(data?.registered_clients);
  //       setLoading(false);
  //       console.log(data);
  //     },

  //     function (error: any) {
  //       console.error("Error fetching recent searches:", error);
  //       setLoading(false);
  //     },
  //     user?.token && user.token
  //   );
  // };

  // const fetchBillboards = () => {

  //   setLoading(true);


  //   API(
  //     "get",
  //     `billboard-data`,
  //     {},
  //     function (data: any) {
  //       setBillboards(data?.registered_billboards);
  //       setLoading(false);
  //     },
  //     function (error: any) {
  //       console.error("Error fetching recent searches:", error);
  //       setLoading(false);
  //     },
  //     user?.token && user.token
  //   );
  // };

  const handleAddOrder = (data: any) => {
    console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "post",
      `campaign-orders`,

      data,
      function (reponse: any) {
        console.log(reponse);
        setOrderList((prev) => [reponse.data, ...prev]);
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

   
  // Function to handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filter Type: ${filter}, Value: ${value}`);

    const newFilters = {
      
      date: dateRange,
    };

   if (filter === "Date") {
      setDateRange(value);
      newFilters.date = value;
    }

    // Call any logic to update data based on the new filters
    console.log("New Filters:", newFilters);

    // Update your data or perform actions here
  };

   // Function to handle removing filters
   const handleRemoveFilter = (filter: string) => {
    if (filter === "Date") {
      setDateRange("");
    } 
  };


  return (
    <>
       <OrderFilterModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        handleFilterChange={handleFilterChange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}

      />

      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 lg:mt-0 intro-y   py-8  ">
        <div className="col-span-12 justify-start items-start flex  intro-y sm:flex">
          {/* <div className='mr-auto'>
            <h2 className="text-lg font-medium text-black intro-y ">Users</h2>
            <p className="mt-4 text-xs text-black intro-y">View, Edit and Delete users</p>
          </div> */}
          <div className=" hidden mr-auto md:block">
            <h2 className="mr-5 text-3xl font-bold truncate">
              Delivered Campaigns
            </h2>
            <Breadcrumb
              light={false}
              className={clsx([
                "h-[45px]  text-xs md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
                // props.layout != "top-menu" && "md:pl-6",
              ])}
            >
              <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
              <Breadcrumb.Link to="/" active={true}>
                Campaingn 
              </Breadcrumb.Link>
            </Breadcrumb>
          </div>

          <Button
          
            onClick={() => setIsModalOpen(true)}
            className="mr-2 flex  justify-center items-center font-semibold shadow-sm  border-customColor rounded-lg px-4 py-2 text-customColor text-sm lg:text-[14px]"
          >
            <Lucide icon="Plus" className="w-5 h-5 mr-2  " /> This  Month
          </Button>

          <Button className="mr-2 shadow-sm  border-slate-300 py-1.5">
            <Lucide icon="Download" className="w-5 h-5 mr-2" /> Export as Excel
          </Button>

          {/* <OrderCreationModal
            clients={clients}
            availableBillboards={billboards}
            isOpen={isModalOpen}
            isLoading={loading}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddOrder}
          /> */}
        </div>

        <div className="col-span-12">
        <FilterChips
           selectedLocation=""
           selectedIndustry=""
           selectedRole=""
           dateRange={dateRange}
           selectedClientType=""
           selectedBillboardType={""}
                  selectedOrientation={""}
                  selectedStatus={""}
            onRemoveFilter={handleRemoveFilter}
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
                  All Campaigns
                </Tab.Button>
              </Tab>
              <Tab fullWidth={false}>
                <Tab.Button className="flex items-center  cursor-pointer">
                  {/* <Lucide icon="Shield" className="w-4 h-4 mr-2" /> */}
                  Running
                </Tab.Button>
              </Tab>
              <Tab fullWidth={false}>
                <Tab.Button className="flex items-center  cursor-pointer">
                  {/* <Lucide icon="Shield" className="w-4 h-4 mr-2" /> */}
                  End
                </Tab.Button>
              </Tab>
              <Tab fullWidth={false}>
                <Tab.Button className="flex items-center  cursor-pointer">
                  {/* <Lucide icon="Shield" className="w-4 h-4 mr-2" /> */}
                  Frozen
                </Tab.Button>
              </Tab>
              <Tab fullWidth={false}>
                <Tab.Button className="flex items-center  cursor-pointer">
                  {/* <Lucide icon="Lock" className="w-4 h-4 mr-2" />  */}
                  Finished
                </Tab.Button>
              </Tab>
            </Tab.List>

            {/* Search tab */}
            <div className="relative md:w-1/3 w-full text-slate-500 mr-6">
              <FormInput
                type="text"
                className="border-transparent w-full text-black border-slate-100  pl-12 shadow-none rounded-xl bg-white pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-96 dark:bg-darkmode-400/70 h-14"
                placeholder="Search database..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 left-4 w-6 h-6 my-auto mr-3 text-slate-300 dark:text-slate-500"
              />
            </div>
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

             {/* All Campaigns */}
    <Tab.Panel>
      <DisplayTable loading={loading} orderList={orderList} />
    </Tab.Panel>

    {/* Running Campaigns */}
    <Tab.Panel>
      <DisplayTable loading={loading} orderList={orderList.filter(order => order.status === "delivered")} />
    </Tab.Panel>

    {/* Ended Campaigns */}
    <Tab.Panel>
      <DisplayTable loading={loading} orderList={orderList.filter(order => order.status === "end")} />
    </Tab.Panel>

    {/* Frozen Campaigns */}
    <Tab.Panel>
      <DisplayTable loading={loading} orderList={orderList.filter(order => order.status === "frozen")} />
    </Tab.Panel>

    {/* Finished Campaigns */}
    <Tab.Panel>
      <DisplayTable loading={loading} orderList={orderList.filter(order => order.status === "finished")} />
    </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="col-span-12 border rounded-2xl  bg-white   px-5  sm:px-6 intro-y">
          {/* Delete Confirmation Modal */}
          {/* <Dialog
              open={deleteConfirmationModal}
              onClose={() => setDeleteConfirmationModal(false)}
              initialFocus={deleteButtonRef}
            >
            </Dialog> */}
        </div>
      </div>

      <Notification id="success-notification-content" className="flex  ">
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Campaign Added!</div>
          <div className="mt-1 text-slate-500">
            Successfully added new Campaign
          </div>
        </div>
      </Notification>
      {/* END: Success Notification Content */}
      {/* BEGIN: Failed Notification Content */}
      <Notification id="failed-notification-content" className="flex">
        <Lucide icon="XCircle" className="text-danger" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Failed to Create!</div>
          <div className="mt-1 text-slate-500">{errorMessage}</div>
        </div>
      </Notification>
    </>
  );
}
