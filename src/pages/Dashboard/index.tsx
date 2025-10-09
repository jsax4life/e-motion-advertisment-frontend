
import _ from "lodash";
import { useState, useRef, useEffect, useContext, Key } from "react";
import Button from "../../base-components/Button";

import Lucide from "../../base-components/Lucide";
import { Menu, Tab, Dialog } from "../../base-components/Headless";
import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";

import { formatCurrency, formatDate } from "../../utils/utils";

import FilterChips from "../../components/FilterChips";
import FilterModal from "../../components/filterModal";
import LoadingIcon from "../../base-components/LoadingIcon";
import Breadcrumb from "../../base-components/Breadcrumb";
import clsx from "clsx";

import { ErpDashboardOld } from "./ErpDashboardOld";

interface Change {
  original: string | number | null;
  updated: string | number | null;
}

interface Changes {
  [section: string]: {
    [field: string]: Change;
  };
}








function Main() {
  const { user } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);

  const [dateRange, setDateRange] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");


  const [userList, setUserList] = useState<any[]>([]);

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
  "Location" | "Date" | "Industry" | "ClientType" | "Orientation" | "BillboardType" | "Status"  
>("Location");
  const cancelButtonRef = useRef(null);

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
  }, [dateRange]);



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

  // Function to handle removing filters
  const handleRemoveFilter = (filter: string) => {
    if (filter === "Date") {
      setDateRange("");
    } 
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



  // useEffect(() => {
  //   if (user?.token) {
  //     fetchDashboardData();
  //   }
  // }, [user?.token]);

  // useEffect(() => {

  //     fetchDashboardData();
  // }, [  dateRange, selectedLGA ]);

  const fetchDashboardData = () => {
    const [startDate, endDate] = dateRange?.split(" - ") || [null, null];


    setLoadingAnalytics(true);

    setError("");


    setError("");

    const params: any = {};
    if (startDate && endDate) {
      params.start_date = startDate.trim();
      params.end_date = endDate.trim();
    }
   
console.log(params)
    API(
      "get",
      `analytics`,
      params,
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

 const itemData = {
  postpaid: revenue?.postpaid,
 
  total_billboard_space: occupancy?.total?.count,
  vacant_billboard_space: occupancy?.vacant?.count,  // Extract count
  occupied_billboards: occupancy?.occupied?.count,

  

  total_digital_billboard_available: occupancy?.total?.digital,
  total_static_billboard_available: occupancy?.total?.static,
  total_lamp_pole_billboard_available: occupancy?.total?.lamp_pole,

  total_static_billboard_occupied: occupancy?.occupied?.static,
  total_static_billboard_vacant: occupancy?.vacant?.static,

  total_digital_billboard_occupied: occupancy?.occupied?.digital,
  total_digital_billboard_vacant: occupancy?.vacant?.digital,

  total_lamp_pole_billboard_occupied: occupancy?.occupied?.lamp_pole,
  total_lamp_pole_billboard_vacant: occupancy?.vacant?.lamp_pole,
total_revenue: revenue?.total,
upfront: revenue?.upfront,
occupancy_percentage: occupancy?.occupancy_percentage

 }
  
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
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        roles={[]}
        setEndDate={setEndDate}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedClientType=""
        selectedIndustry=""
        selectedLocation=""
        selectedBillboardType=""
        selectedOrientation=""
        selectedStatus=""
        setSelectedClientType={() =>{}}
        setSelectedIndustry={() =>{}}
        setSelectedLocation={() =>{}}
        setSelectedBillboardType={() =>{}}
        setSelectedOrientation={() =>{}}
        setSelectedStatus={() =>{}}
      selectedRole=""
      setSelectedRole={() =>{}}
        

clientTypes={[]}    
industries={[]}
locations={[]} 

billboardTypes={[]}
orientations={[]}
statuses={[]}

      />





      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 lg:mt-0 intro-y   py-8  ">
        <div className="col-span-12 justify-end items-start flex  intro-y ">
       
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

          <Menu className="text-xs ml-2 border rounded-lg border-customColor">
            <Menu.Button as={Button} className=" text-customColor text-[18px]">
              <Lucide icon="Filter" className="w-4 h-4 mr-2 " />
              Filter
              {/* <Lucide icon="ChevronDown" className="w-4 h-4 ml-2 " /> */}
            </Menu.Button>
            <Menu.Items className="w-40 text-xs">
              <Menu.Header className="">Filter Categories</Menu.Header>

          

              <Menu.Item
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  // setDatepickerModalPreview(true);
                  setActiveFilter("Date");
                  setOpenModal(true);
                }}
              >
                <Lucide icon="Calendar" className="w-4 h-4 mr-2" />
                Date
                <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
              </Menu.Item>

              

  

            </Menu.Items>

           
          </Menu>
        </div>
    
<ErpDashboardOld top_billboards={top_billboards} top_campaigns={top_campaigns} top_clients={top_clients} itemData={itemData}/>
     
      </div>

   
    </>
  );
}

export default Main;
