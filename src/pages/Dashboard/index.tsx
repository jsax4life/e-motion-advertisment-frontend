import {
  Fragment,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from "react";
import _ from "lodash";
import { useState, useRef, useEffect, useContext, Key } from "react";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab, Dialog } from "../../base-components/Headless";
import Litepicker from "../../base-components/Litepicker";
import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import DashboardCard from "./DashboardCard";
import Progress from "../../base-components/Progress";
import { formatCurrency, formatDate } from "../../utils/utils";
import { Link } from "react-router-dom";
import Chip from "../../components/Chip";
import FilterChips from "../../components/FilterChips";
import { date } from "yup";
import FilterModal from "./filterModal";
import LoadingIcon from "../../base-components/LoadingIcon";
import axios from "axios";
import Breadcrumb from "../../base-components/Breadcrumb";
import clsx from "clsx";
import Tippy from "../../base-components/Tippy";
import AnalyticsCard from "./AnalyticsCard";
import Analytics from "./Analytics/Analytics";

interface Change {
  original: string | number | null;
  updated: string | number | null;
}

interface Changes {
  [section: string]: {
    [field: string]: Change;
  };
}



const lagosLGAs = [
  "Agege",
  "Ajeromi-Ifelodun",
  "Alimosho",
  "Amuwo-Odofin",
  "Apapa",
  "Badagry",
  "Epe",
  "Eti-Osa",
  "Ibeju-Lekki",
  "Ifako-Ijaiye",
  "Ikeja",
  "Ikorodu",
  "Kosofe",
  "Lagos Island",
  "Lagos Mainland",
  "Mushin",
  "Ojo",
  "Oshodi-Isolo",
  "Shomolu",
  "Surulere",
];




// const parks = ["Agege Park", "Alimosho Park"];

// const tags = [
//   { name: "Updated vehicle registration", href: "#", color: "bg-rose-500" },
//   { name: "User logged in", href: "#", color: "bg-indigo-500" },
// ];

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(" ");
// }

function Main() {
  const { user } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);

  const [dateRange, setDateRange] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [selectedLGA, setSelectedLGA] = useState<string>("");
  const [selectedPark, setSelectedPark] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"State" | "Status" | "Orientation" | "Type">(
    "State"
  );

  const cancelButtonRef = useRef(null);
  const [showLgaSubMenu, setShowLgaSubMenu] = useState(false);

  const sendButtonRef = useRef(null);
const [dailyReveneModal, setDailyReveneModal] = useState(false);
  const [monthlyReveneModal, seTotalReveneModal] = useState(false);


  useEffect(() => {
    if (user?.token) {
      fetchDashboardData();
      fetchAllUsers();
    }
  }, [user?.token]);

  useEffect(() => {
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;

    //   setDateRange("");
    //   return;
    // }

    fetchDashboardData();
  }, [dateRange, selectedLGA, selectedPark, selectedUser]);



  const fetchAllUsers = () => {

    setError("");
    // setLoading(true);
  


    API(
      "get",
      `all-users`,
      
      {},
      // {lga: 'Alimosho'},
      function (allUserData: any) {
        console.log(allUserData?.data)
        setUserList(allUserData?.data);
        // setLoading(false);

         // Store the user list in local storage
      localStorage.setItem('userList', JSON.stringify(allUserData?.data));

      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        // setLoading(false);
      },
      user?.token && user.token
    );
  };

  // console.log(startDate, endDate);

  // const handleAddFilter = (filter: string, value: string) => {
  //   if (filter === 'LGA') setSelectedLGA(value);
  //   else if (filter === 'Park') setSelectedPark(value);
  //   else if (filter === 'Date') setDateRange(value);

  //   onFilterChange({
  //     lga: filter === 'LGA' ? value : selectedLGA,
  //     park: filter === 'Park' ? value : selectedPark,
  //     date: filter === 'Date' ? value : dateRange,
  //   });
  // };

  // const handleRemoveFilter = (filter: string) => {
  //   if (filter === 'LGA') setSelectedLGA('');
  //   else if (filter === 'Park') setSelectedPark('');
  //   else if (filter === 'Date') setDateRange('');

  //   onFilterChange({
  //     lga: filter === 'LGA' ? '' : selectedLGA,
  //     park: filter === 'Park' ? '' : selectedPark,
  //     date: filter === 'Date' ? '' : dateRange,
  //   });
  // };

  // Function to handle adding filters
  // const handleAddFilter = (filter: string, value: string) => {
  //   if (filter === 'LGA') {
  //     setSelectedLGA(value);
  //   } else if (filter === 'Park') {
  //     setSelectedPark(value);
  //   } else if (filter === 'Date') {
  //     setDateRange(value);
  //   }

  //   // Here you can add any logic to fetch or update data based on the new filters
  //   // For example, if you are fetching data, call your API here
  // };

  // Function to handle removing filters
  const handleRemoveFilter = (filter: string) => {
    if (filter === "LGA") {
      setSelectedLGA("");
    } else if (filter === "Park") {
      setSelectedPark("");
    } else if (filter === "Date") {
      setDateRange("");
    } else if (filter === "User") {
    setSelectedUser("");
  }
    // Optionally update your data based on the filters being removed
  };

  
  // Function to handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filter Type: ${filter}, Value: ${value}`);

    const newFilters = {
      lga: selectedLGA,
      park: selectedPark,
      date: dateRange,
    };

    if (filter === "LGA") {
      setSelectedLGA(value);
      newFilters.lga = value;
    } else if (filter === "Park") {
      setSelectedPark(value);
      newFilters.park = value;
    } else if (filter === "Date") {
      setDateRange(value);
      newFilters.date = value;
    }

    // Call any logic to update data based on the new filters
    console.log("New Filters:", newFilters);

    // Update your data or perform actions here
  };



  // useEffect(() => {
  //   if (user?.token) {
  //     fetchDashboardData();
  //   }
  // }, [user?.token]);

  // useEffect(() => {

  //     fetchDashboardData();
  // }, [  dateRange, selectedLGA ]);

  const fetchDashboardData = () => {
    setLoadingAnalytics(true);

    setError("");


    API(
      "get",
      `analytics`,
      {},
      function (dashboardData: any) {
        console.log(dashboardData)
        setDashboardData(dashboardData);
        setLoadingAnalytics(false);
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoadingAnalytics(false);
      },
      user?.token && user.token
    );
  };

  const handleClose = () => {
    setDailyReveneModal(false);
    seTotalReveneModal(false);
  };


 const {occupancy, revenue, top_billboards, top_campaigns, top_clients} = dashboardData?? {}
  
console.log(occupancy)

// return revenueDailyShare;
    
//   };
  
const revenueBreakdown = ({ numberOfRegistrations }: { numberOfRegistrations: number }) => {
  const companySharePerVehicle = 4000;
  const motSharePerVehicle = 2000;

  // Check if numberOfRegistrations is valid
  if (!numberOfRegistrations || isNaN(numberOfRegistrations)) {
    return {
      dailySiitechRevenue: 0,
      dailMoTRevenue: 0,
    };
  }

  // Calculate the breakdown
  const companyTotal = numberOfRegistrations * companySharePerVehicle;
  const motTotal = numberOfRegistrations * motSharePerVehicle;

  const revenueDailyShare = {
    dailySiitechRevenue: companyTotal,
    dailMoTRevenue: motTotal,
  };

  return revenueDailyShare;
};

  return (
    <>
      <FilterModal
        open={openModal}
        setOpen={setOpenModal}
        handleFilterChange={handleFilterChange}
        selectedLGA={selectedLGA}
        setSelectedLGA={setSelectedLGA}
        selectedCarPark={selectedPark}
        setSelectedCarPark={setSelectedPark}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        users={userList}
      />


{dailyReveneModal && <Dialog
      open={dailyReveneModal}
      onClose={() => {handleClose}}
      initialFocus={sendButtonRef}
      className="flex place-self-center lg:items-center lg:justify-center "
    >
      <Dialog.Panel className="relative">
        <Dialog.Title>

       <button className="absolute right-4 top-4"
       onClick={() => setDailyReveneModal(false)}
       >
       <Lucide
                icon= "X"
                className="w-4 h-4  "
              />
       </button>

          <div className="flex flex-col gap-y-2">
     
           <div className="justify-center items-center flex">
           <div className="bg-customColor/20 fill-customColor text-customColor mr-2 rounded-lg p-2">
              <Lucide
                icon= "Banknote"
                className="w-5 h-5"
              />
             
            </div>
            <div className="">
              <h2 className="mr-auto text-slate-600 font-bold">
                
                 Daily Revenue Contribution
                
              </h2>
              <p className="text-xs text-slate-500">
               Breakdown of revenue sharing today.
                
              </p>
            </div>
           </div>
           <div>
       <FilterChips
          selectedRole=""
          selectedStatus=""
            dateRange={dateRange}
            selectedUser={selectedUser}
            onRemoveFilter={handleRemoveFilter}
          />
       </div>
          </div>
        </Dialog.Title>

        <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
         
            <div className="col-span-12 p-4 cursor-pointer   rounded-xl  flex  items-center justify-between box ">
            <div className="flex">
            <div
                className={`  rounded-md  bg-blue-500 w-5 h-5 mr-4`}
              >
            
              </div>
              <div>Administrator</div>
            </div>

              <div className="font-bold text-lg">
                

{loadingAnalytics ? (
                    <div className="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2">
                      <LoadingIcon icon="three-dots" className="w-6 h-6" />
                    </div>
                  ) :  (`N ${formatCurrency (revenueBreakdown({ numberOfRegistrations: dashboardData?.daily_registered_vehicles || 0 }).dailySiitechRevenue)}`)
              }

                      </div>
              </div>

          
              <div className="col-span-12 p-4 cursor-pointer   rounded-xl py-5 flex  items-center justify-between box ">
            <div className="flex">
            <div
                className={`  rounded-md  bg-customColor w-5 h-5 mr-4`}
              >
            
              </div>
              <div>Remittance</div>
            </div>

              <div className="font-bold text-lg">
                

{loadingAnalytics ? (
                    <div className="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2">
                      <LoadingIcon icon="three-dots" className="w-6 h-6" />
                    </div>
                  ) :  (`N ${formatCurrency (revenueBreakdown({ numberOfRegistrations: dashboardData?.daily_registered_vehicles || 0 }).dailMoTRevenue)}`)
              }

                      </div>
              </div>
        </Dialog.Description>

        <Dialog.Footer className="text-right">
          {/* <Button
            type="button"
            variant="outline-secondary"
            onClick={handleClose}
            className="w-20 mr-1 border-customColor text-customColor"
          >
            Cancel
          </Button> */}
          {/* <Button
            variant="primary"
            type="button"
            className="lg:w-25 bg-customColor"
            ref={sendButtonRef}
            onClick={
              activeFilter === "LGA"
            }
          >
            Apply Filter
          </Button> */}
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
    }



      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 lg:mt-0 intro-y   py-8  ">
        <div className="col-span-12 justify-end items-start flex  intro-y sm:flex">
       
      <div className=" hidden mr-auto md:block">
              <h2 className="mr-5 text-3xl font-bold truncate">
                Dashboard
              </h2>
        <Breadcrumb
            light = {false}
            className={clsx([
              "h-[45px]  text-xs md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
              // props.layout != "top-menu" && "md:pl-6",
              
            ])}
          >
            <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
            <Breadcrumb.Link to="/" active={true}>
              Dashboard
            </Breadcrumb.Link>
          </Breadcrumb>
      </div>
          
          <FilterChips
          selectedRole=""
          selectedStatus=""
            dateRange={dateRange}
            selectedUser={selectedUser}
            onRemoveFilter={handleRemoveFilter}
          />

          <Menu className="text-xs ml-2 border rounded-lg border-customColor">
            <Menu.Button as={Button} className=" text-customColor text-[18px]">
              <Lucide icon="Filter" className="w-4 h-4 mr-2 " />
              Filter
              {/* <Lucide icon="ChevronDown" className="w-4 h-4 ml-2 " /> */}
            </Menu.Button>
            <Menu.Items className="w-40 text-xs">
              <Menu.Header className="">Filter Categories</Menu.Header>

              {/* <Menu.Item>
            <Lucide icon="Home" className="w-4 h-4 mr-2" />
            LGA

            <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />

        </Menu.Item> */}

              <Menu.Item
                onClick={(event: React.MouseEvent) => {
                  // event.preventDefault();
                  // setLGAModal(true);

                  setActiveFilter("State");
                  setOpenModal(true);
                }}
              >
                <Lucide icon="Home" className="w-4 h-4 mr-2" />
                State
                <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
              </Menu.Item>

              {/* LGA Submenu */}
              {showLgaSubMenu && (
                <Menu.Items
                  className="lg:w-60 w-40 overflow-y-scroll h-72"
                  placement="right-start"
                >
                  {lagosLGAs.map((lga, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className={`flex items-center px-8 cursor-pointer ${
                            active ? "bg-gray-100" : ""
                          }`}
                        >
                          {lga}
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              )}

              <Menu.Item
                // onClick={() => setShowLgaSubMenu(!showLgaSubMenu)}
                onClick={() => {
                  setOpenModal(true);
                  setActiveFilter("Status");
                }}
              >
                <Lucide icon="Cloud" className="w-4 h-4 mr-2" />
                Status
                <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
              </Menu.Item>
              <Menu.Item
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  // setDatepickerModalPreview(true);
                  setActiveFilter("Orientation");
                  setOpenModal(true);
                }}
              >
                <Lucide icon="Calendar" className="w-4 h-4 mr-2" />
                Orientation
                <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
              </Menu.Item>

              <Menu.Item
                // onClick={() => setShowLgaSubMenu(!showLgaSubMenu)}
                onClick={() => {
                  setOpenModal(true);
                  setActiveFilter("Type");
                }}
              >
                <Lucide icon="Type" className="w-4 h-4 mr-2" />
                Users
                <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
              </Menu.Item>

            </Menu.Items>

           
          </Menu>
        </div>

        <Analytics title="Revenue"  item1Name={'upfront'} item2Name={'postpaid'} item3Name={'total'} item1Data={`₦${formatCurrency(revenue?.upfront)}`} item2Data={`₦${formatCurrency(revenue?.postpaid)}`} item3Data={`₦${formatCurrency(revenue?.total)}`} iconBgColor1={'bg-blue-500'} iconBgColor2={'bg-pink-400'} iconBgColor3={'bg-green-400'}/>  
        <Analytics title="Occupancy"  item1Name={'vacant'} item2Name={'occupied'} item3Name={'total'}  item1Data={occupancy?.vacant} item2Data={occupancy?.occupied}  item3Data={occupancy?.total}  iconBgColor1={'bg-purple-500'} iconBgColor2={'bg-yellow-500'} iconBgColor3={'bg-pink-400'}/>  

        {/* <div className="col-span-12 intro-y lg:col-span-8">
          <div className="grid grid-cols-12 gap-6 mt-5 lg:mt-0">
            <DashboardCard
              count={dashboardData?.daily_registered_vehicles}
              label="Total Revenue"
              bgColor="bg-emerald-300"
              iconFill=""
              iconText="text-white"
              laadingCount={loadingAnalytics}
            />
            <DashboardCard
              count={dashboardData?.daily_untagged_vehicles}
              label="upfront"
              bgColor="bg-blue-500"
              iconFill="orange"
              iconText="text-white"
              laadingCount={loadingAnalytics}
            />
            <DashboardCard
              count={dashboardData?.daily_tagged_vehicles}
              label="postpaid"
              bgColor="bg-violet-700"
              iconFill="pink"
              iconText="text-white"
              laadingCount={loadingAnalytics}
            />
            <DashboardCard
              count={dashboardData?.total_registered_vehicles}
              label="Total Billboard Space"
              bgColor="bg-blue-300"
              iconFill=""
              iconText="text-white"
              laadingCount={loadingAnalytics}
            />
            <DashboardCard
              count={dashboardData?.total_untagged_vehicles}
              label="Occupied Billboard Space"
              bgColor="bg-fuchsia-200"
              iconFill=""
              iconText="text-white"
              laadingCount={loadingAnalytics}
            />
            <DashboardCard
              count={dashboardData?.total_tagged_vehicles}
              label="Vacant Billboard Space"
              bgColor="bg-amber-500"
              iconFill=""
              iconText="text-white"
              laadingCount={loadingAnalytics}
            />
          </div>
        </div> */}

        <div className=" flex flex-col col-span-12 justify-center items-center lg:col-span-4 gap-y-4 bg-white border-slate-300  rounded-2xl">
          {/* <div className="flex flex-col flex-cols-12  lg:mt-0 justify-center items-center"> */}
            {/* <div onClick={() => setDailyReveneModal(true)} className="col-span-12 p-4 cursor-pointer  shadow-lg rounded-xl bg-white py-5 zoom-in flex" >
              <div
                className={`flex mr-4 items-center justify-center rounded-md  bg-green-200 w-10 h-10`}
              >
                <Lucide
                  icon="Banknote"
                  fill="green"
                  className={`p-1 w-[40px] h-[38px] text-green-300`}
                />
              </div>
              <div>
                <div className="text-base font-medium ">
                

{loadingAnalytics ? (
                    <div className="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2">
                      <LoadingIcon icon="three-dots" className="w-6 h-6" />
                    </div>
                  ) : (
                    `N ${formatCurrency(
                      dashboardData?.daily_registered_vehicles * 6000
                      )}`
                  )}
                </div>
                <div className="text-slate-500 text-xs">
                  Daily Registration Fee
                </div>
              </div>
            </div> */}
            <div>
              Occupancy
            </div>


            {/* <Progress className="h-1 mt-2">

<Progress.Bar
  className="bg-customColor"
  role="progressbar"
  aria-valuenow={kpiData?.percentage_achieved}
  aria-valuemin={0}
  aria-valuemax={100}
  style={{ width: `${kpiData?.percentage_achieved}%` }}
></Progress.Bar>

</Progress> */}

<div className="relative size-40 " onClick = {() => setDailyReveneModal(true)}>
  {/* <svg className="rotate-[135deg] size-full rounded-full bg-green-100" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">

    <circle cx="18" cy="18" r="17" fill="none" className="stroke-current text-green-500 dark:text-green-500" stroke-width="2" stroke-dasharray="56.25 100" stroke-linecap="round"></circle>
  </svg> */}

  <svg className="rotate-[135deg] size-full rounded-full bg-green-100" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="17" fill="none" className="stroke-current text-green-500 dark:text-green-500" stroke-width="2" stroke-dasharray={`${occupancy?.occupancy_percentage} ${100 - occupancy?.occupancy_percentage}`} stroke-linecap="round"></circle>
</svg>

  <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
  <span className="text-center text-4xl font-bold text-green-600 dark:text-green-500">{occupancy?.occupancy_percentage}%</span>

  </div>
</div>
    
          {/* </div> */}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 intro-y">
                

{/* <TopAnalytics title="Top Client" itemData={top_clients}/>   */}
<AnalyticsCard
  title="Top Clients"
  itemData={top_clients?.map((client: { id: any; company_name: any; logo: any; campaign_order_sum_total_order_amount: any; campaign_order_count: any; }) => ({
    id: client.id,
    name: client.company_name,
    image: client.logo,
    value: `₦${formatCurrency(client.campaign_order_sum_total_order_amount)}`,
    secondaryValue: `${client.campaign_order_count}`,
  }))}
  valueLabel="Total spent"
  secondaryValueLabel="Campaigns"
/>

<AnalyticsCard
  title="Top Billboards"
  itemData={top_billboards?.map((billboard: { id: any; billboard: { billboardName: any; pricePerMonth: any; presigned_picture_url:any }; usage_count: any; } ) => ({
    id: billboard.id,
    name: billboard.billboard.billboardName,
    value: `₦${formatCurrency (billboard.billboard.pricePerMonth)} `,
    secondaryValue: `${billboard.usage_count}`,
    image: billboard.billboard.presigned_picture_url
  }))}
  valueLabel="Impressions"
  secondaryValueLabel="Usage"
/>
{/* <TopAnalytics title="Top Performing Billboard" itemData={top_billboards}/>
<TopAnalytics title="Top Campaigns" itemData={top_campaigns}/> */}


<AnalyticsCard
  title="Top Campaigns"
  itemData={top_campaigns?.map((campaign: { id: any; campaign_name: any; presigned_image_url: any; total_order_amount: any; ctr: any; }) => ({
    id: campaign.id,
    name: campaign.campaign_name,
    image: campaign?.presigned_image_url?.[0],
    value: `₦${formatCurrency(campaign.total_order_amount)}`,
    secondaryValue: ``,
  }))}
  valueLabel="Conversions"
  secondaryValueLabel=""
/>

      </div>
    </>
  );
}

export default Main;
