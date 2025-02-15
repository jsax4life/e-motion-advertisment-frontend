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
import TopClient from "./TopClient";

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
  const [parks, setParks] = useState<{ code: string, desc: string }[]>([]); // Updated to include parkDesc

  const [dateRange, setDateRange] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [selectedLGA, setSelectedLGA] = useState<string>("");
  const [selectedPark, setSelectedPark] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingKpiData, setLoadingKpiData] = useState(true);
  const [loadingActivityData, setLoadingActivityData] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState<any>(null);
  const [activitylogs, setActiviyLogs] = useState([]);
  const [datepickerModalPreview, setDatepickerModalPreview] = useState(false);
  const [lgaModal, setLGAModal] = useState(false);
  const [tempSelectedLGA, setTempSelectedLGA] = useState("");
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
      fetchKPIData();
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

  // useEffect(() => {
  //   if (user?.token) {
  //     fetchKPIData();
  //   }
  // }, [user?.token]);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  useEffect(() => {
   
  
    const validatePack = async () => {
      try {
        const response = await axios.post('https://api.lagroute.org/validattion/sa.getpark.php', {
          PassKey: `9c83a5d9-56f0-11ef-8aae-f23c93600e21`,
          type: 'A'
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
  
        // console.log('Responses:', response.data.data);
  
        if (Array.isArray(response?.data?.data)) {
          setParks(response?.data?.data);
          console.log(response.data.data)
          // localStorage.setItem('parks', response?.data?.data)
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error making request:', error);
      }
    };
  
    validatePack();
  }, []);
  


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

  const fetchKPIData = () => {
    setError("");

    setLoadingKpiData(true);

    API(
      "get",
      `registration-kpi`,
      {},

      function (response: any) {
        setKpiData(response);

        console.log(response);
        setLoadingKpiData(false);
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoadingKpiData(false);
      },
      user?.token && user.token
    );
  };

  const fetchActivityLogs = () => {
    setError("");

    console.log("hello");

    setLoadingActivityData(true);

    API(
      "get",
      "activity-logs",
      {},

      function (response: any) {
        setActiviyLogs(response);

        console.log(response);
        setLoadingActivityData(false);
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoadingActivityData(false);
      },
      user?.token && user.token
    );
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
    const [startDate, endDate] = dateRange?.split(" - ") || [null, null];

    setError("");

    const params: any = {};
    if (selectedLGA) params.lga = selectedLGA;
    if (startDate && endDate) {
      params.start_date = startDate.trim();
      params.end_date = endDate.trim();
    }
    if (selectedUser) params.user = selectedUser;
    if (selectedPark) params.park = selectedPark;

    API(
      "get",
      `dashboard-analytics`,
      params,
      function (dashboardData: any) {
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
  // const formatChanges = (changes: Changes): string => {
  //   let formattedChanges = '';

  //   Object.entries(changes).forEach(([section, fields]) => {
  //     Object.entries(fields).forEach(([field, values]) => {
  //       if (field !== 'updated_at') { // Optional: skip 'updated_at' field
  //         formattedChanges += `${section.toUpperCase()} - ${field}: ${values.original} -> ${values.updated}\n`;
  //       }
  //     });
  //   });

  //   return formattedChanges;
  // };

  // const formatChanges = (changes: string): JSX.Element => {
  //   const changeElements: JSX.Element[] = [];

  //   try {
  //     // Parse the changes JSON string into an object
  //     const parsedChanges: Changes = JSON.parse(changes);

  //     // Iterate over the parsed object
  //     Object.entries(parsedChanges).forEach(([section, fields]) => {
  //       if (fields && typeof fields === 'object') {
  //         Object.entries(fields).forEach(([field, values]) => {
  //           if (values && typeof values === 'object' && 'original' in values && 'updated' in values) {
  //             if (field !== 'updated_at') { // Optional: skip 'updated_at' field
  //               changeElements.push(
  //                 <div key={`${section}-${field}`} className=" inline-flex items-center   text-xs  truncate">
  //                   <span className="">
  //                     {section.toUpperCase()} - {field}: {values.original} -{">"} {values.updated}
  //                   </span>
  //                   <span
  //                     className='bg-orange-600 h-1.5 w-1.5 rounded-full inline-block mx-2'
  //                     aria-hidden="true"
  //                   />
  //                 </div>
  //               );
  //             }
  //           }
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error parsing changes:', error);
  //   }

  //   return <>{changeElements}</>;
  // };

  const formatChanges = (changes: string | null | undefined): JSX.Element => {
    const changeElements: JSX.Element[] = [];

    // Check if changes is a valid non-empty string
    if (typeof changes !== "string" || changes.trim() === "") {
      console.error("Invalid changes input: The input is not a valid string.");
      return <>{changeElements}</>; // Return empty if input is invalid
    }

    try {
      // Parse the changes JSON string into an object
      const parsedChanges: Changes = JSON.parse(changes);

      // Iterate over the parsed object
      Object.entries(parsedChanges).forEach(([section, fields]) => {
        if (fields && typeof fields === "object") {
          Object.entries(fields).forEach(([field, values]) => {
            if (
              values &&
              typeof values === "object" &&
              "original" in values &&
              "updated" in values
            ) {
              if (field !== "updated_at") {
                // Optional: skip 'updated_at' field
                changeElements.push(
                  <div
                    key={`${section}-${field}`}
                    className=" inline-flex items-center   text-xs  truncate"
                  >
                    <span className="">
                      {section.toUpperCase()} - {field}: {values.original} -
                      {">"} {values.updated}
                    </span>
                    <span
                      className="bg-orange-600 h-1.5 w-1.5 rounded-full inline-block mx-2"
                      aria-hidden="true"
                    />
                  </div>
                );
              }
            }
          });
        }
      });
    } catch (error) {
      console.error("Error parsing changes:", error);
    }

    return <>{changeElements}</>;
  };

  // const formatChanges = (changes: string): JSX.Element => {
  //   const changeElements: JSX.Element[] = [];

  //   try {
  //     const parsedChanges: Changes = JSON.parse(changes);

  //     Object.entries(parsedChanges).forEach(([section, fields]) => {
  //       if (fields && typeof fields === 'object') {
  //         Object.entries(fields).forEach(([field, values]) => {
  //           if (values && typeof values === 'object' && 'original' in values && 'updated' in values) {
  //             if (field !== 'updated_at') { // Optional: skip 'updated_at' field
  //               changeElements.push(
  //                 <div key={`${section}-${field}`}>
  //                   {section.toUpperCase()} - {field}: {values.original}
  //                   <span className='bg-orange-600 h-1.5 w-1.5 rounded-full inline-block mx-2' aria-hidden="true" />
  //                   {values.updated}
  //                 </div>
  //               );
  //             }
  //           }
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error parsing changes:', error);
  //   }

  //   return <>{changeElements}</>;
  // };


  
//   const revenueBreakdown = ({ numberOfRegistrations}: any ) => {
//     const companySharePerVehicle = 5000;
//     const motSharePerVehicle = 1000;
  
  
  
//     // Calculate the breakdown
//     const companyTotal = numberOfRegistrations * companySharePerVehicle;
//     const motTotal = numberOfRegistrations * motSharePerVehicle;

//     const revenueDailyShare = {
//       dailySiitechRevenue: companyTotal? companyTotal : 0,
//       dailMoTRevenue: motTotal? motTotal : 0,
//     }
  
//     if (!companyTotal || isNaN(companyTotal)) {
//       revenueDailyShare.dailySiitechRevenue = 0;
//       revenueDailyShare.dailMoTRevenue = 0;
//     }
  


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
        lagosLGAs={lagosLGAs}
        carParks={parks}
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
            lagosLGAs={lagosLGAs}
            selectedLGA={selectedLGA}
            selectedPark={selectedPark}
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

{monthlyReveneModal && <Dialog
      open={monthlyReveneModal}
      onClose={() => {handleClose}}
      initialFocus={sendButtonRef}
      className="flex place-self-center lg:items-center lg:justify-center "
    >
      <Dialog.Panel className="relative">
        <Dialog.Title>

       <button className="absolute right-4 top-4"
       onClick={() => seTotalReveneModal(false)}
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
                
                 Total Revenue Distribution
                
              </h2>
              <p className="text-xs text-slate-500">
               Breakdown of revenue sharing with specific date.
                
              </p>
            </div>
           </div>
           <div>
       <FilterChips
          selectedRole=""
          selectedStatus=""
            lagosLGAs={lagosLGAs}
            selectedLGA={selectedLGA}
            selectedPark={selectedPark}
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
                  ) :  (`N ${formatCurrency (revenueBreakdown({ numberOfRegistrations: dashboardData?.total_registered_vehicles || 0 }).dailySiitechRevenue)}`)
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
                  ) :  (`N ${formatCurrency (revenueBreakdown({ numberOfRegistrations: dashboardData?.total_registered_vehicles || 0 }).dailMoTRevenue)}`)
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
            lagosLGAs={lagosLGAs}
            selectedLGA={selectedLGA}
            selectedPark={selectedPark}
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

      

        <div className="col-span-12 intro-y lg:col-span-8">
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
        </div>

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



<div className="relative size-40 " onClick = {() => setDailyReveneModal(true)}>
  <svg className="rotate-[135deg] size-full rounded-full bg-green-100" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">

    <circle cx="18" cy="18" r="17" fill="none" className="stroke-current text-green-500 dark:text-green-500" stroke-width="2" stroke-dasharray="56.25 100" stroke-linecap="round"></circle>
  </svg>

  <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
  <span className="text-center text-4xl font-bold text-green-600 dark:text-green-500">35%</span>

  </div>
</div>
    
          {/* </div> */}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 intro-y">
                

<TopClient title="Top Client"/>  
<TopClient title="Top Performing Billboard"/>
<TopClient title="Top Campaigns"/>




      </div>
    </>
  );
}

export default Main;
