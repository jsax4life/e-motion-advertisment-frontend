/* This example requires Tailwind CSS v2.0+ */
// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { Fragment, Key, useContext, useEffect, useCallback } from 'react'

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
import { Dialog, Menu } from "../../base-components/Headless";
import { Transition } from "@headlessui/react";

import Litepicker from "../../base-components/Litepicker";
import Tippy from "../../base-components/Tippy";
import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import FilterChips from "../../components/FilterChips";
import FilterModal from "./filterModal";
import Breadcrumb from "../../base-components/Breadcrumb";
import AdminCreationModal from "./AdminCreationModal";
import Notification from "../../base-components/Notification";
import Toastify from "toastify-js";
import DisplaySection from "./DisplaySection";
import DisplayTable from "./DisplayTable";
import { PullClientContext } from "../../stores/ClientDataContext";
import profile from "../../assets/images/profile.png";
import { debounce } from '../../utils/debounce';


const roles = [
    "Registration Officer",
    "Attachment Officer",
    "Operation Officer",

  ];

const lagosParks = [
  "Agege Park",
  "Alimosho Park",
  "Apapa Park",
  "Badagry Park",
  "Epe Park",
];

const tagStyle = [
  "bg-orange-100 text-orange-600",
  "bg-green-100 text-green-600",
];

type FilterType = {
    lga: string;
    role: string;
    date?: string; // Make date optional
    status: string;
    startDate?: string;
    endDate?: string;
  };

  interface SearchResult {

    users: Array<any>;
  }
  

export default function Main() {
  const { user } = useContext(UserContext);
  const { clients, clientDispatch } = useContext(PullClientContext);

  const [openModal, setOpenModal] = useState(false);

  const [clientList, setClientList] = useState<any[]>([]);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const [dateRange, setDateRange] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);

  const [selectedLGA, setSelectedLGA] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const [selectedUser, setSelectedUser] = useState<string>("");

  const [kpiData, setKpiData] = useState(null);
  const [selectedPark, setSelectedPark] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [datepickerModalPreview, setDatepickerModalPreview] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"Role"| "LGA" | "Date" | "Status">(
    "LGA"
  );

  const [filterState, setFilterState] = useState<FilterType>({
    lga: selectedLGA,
    role: selectedRole,
    date: dateRange,
    status: selectedStatus,
    startDate: startDate,
    endDate: endDate,
  });

  const [searchDropdown, setSearchDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
const [recentSearches, setRecentSearches] = useState<string[]>([]);

useEffect(() => {
  // Load recent searches from local storage when the component mounts
  const storedRecentSearches = localStorage.getItem('userRecentSearches');
  if (storedRecentSearches) {
    setRecentSearches(JSON.parse(storedRecentSearches));
  }
}, []);


  const cancelButtonRef = useRef(null);
  const isInitialMount = useRef(true);



const [query, setQuery] = useState('');
const [results, setResults] = useState<SearchResult>({

  users: [],
});





const performSearch = async (searchQuery: string) => {
  API(
    "get",
    `user-search`,

    {query: searchQuery},
    function (searchResultData: any) {
      console.log(searchResultData)
      setIsLoading(false);
      
      setResults(searchResultData);
       // Update recent searches
    updateRecentSearches(searchQuery);

      // if(recentData.length >  0) {
      //   SetIsRecentSearch(true)
      // }
    },
    function (error: any) {
      console.error("Error fetching recent searches:", error);
      setRecentSearches([]);
      setIsLoading(false);
    },
    user?.token && user.token
  );
  
};

// Use useCallback to memoize the debounced function
const debouncedSearch = useCallback(
  debounce((searchQuery: string) => {
    if (searchQuery.length > 2) {
      performSearch(searchQuery);
    } else {
      setResults({
       
        users: [],
      });
    }
  }, 500), // 500ms delay
  []
);


const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  const searchQuery = event.target.value;
  setQuery(searchQuery);

  // Use the debounced search function
  debouncedSearch(searchQuery);
};

// console.log(recentSearches);





const updateRecentSearches = (newSearch: string) => {
  // Add the new search term to the recent searches array
  const updatedSearches = [newSearch, ...recentSearches.filter(search => search !== newSearch)];

  // Keep only the first 3 most recent searches
  if (updatedSearches.length > 3) {
    updatedSearches.pop();
  }

  setRecentSearches(updatedSearches);

  // Save updated recent searches to local storage
  localStorage.setItem('userRecentSearches', JSON.stringify(updatedSearches));
};



const handleRecentSearchClick = (searchTerm: string) => {
  setQuery(searchTerm);

  if (searchTerm.length > 2) {
    performSearch(searchTerm);
  }
};

const showSearchDropdown = () => {
  setSearchDropdown(true);
};
const hideSearchDropdown = () => {
  setSearchDropdown(false);
};

  // console.log(vehicleList)

  const navigate = useNavigate();

 
  useEffect(() => {
    if (user?.token) {
        fetchUserData();
    }
  }, [user?.token]);

  const fetchUserData = () => {

    setError("");
    setLoading(true);
  

    console.log(filterState)


    API(
        "get",
        `all-admins`,
        
        // {},
        filterState,
        // {lga: 'Alimosho'},
        function (allAdmiinData: any) {
          console.log(allAdmiinData?.data)
          setUserList(allAdmiinData?.data);
           // Store the user list in local storage
    localStorage.setItem('adminList', JSON.stringify(allAdmiinData?.data));

          setLoading(false);
        },
        function (error: any) {
          console.error("Error fetching recent searches:", error);
          setLoading(false);
        },
        user?.token && user.token
      );
  };

  const handleAddAdmin = (data: any) => {
    console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "post",
      `register`,

      {...data},
      function (reponse: any) {
        console.log(reponse);
        setUserList((prev) => [reponse.data, ...prev]);
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

 
          // Function to handle removing filters
          const handleRemoveFilter = (filter: string) => {
            const newFilters = { ...filterState };
      
          if (filter === 'Role') {
              setSelectedRole('');
              newFilters.role = '';
      
            } else if (filter === 'Date') {
              setDateRange('');
              newFilters.startDate = '';
              newFilters.endDate = '';
      
            }else if (filter === 'Status') {
              setSelectedStatus('');
              newFilters.status = '';
            }
        
            // Update the filter state
            setFilterState(newFilters);
          };
        
      
      
      
        // Function to handle filter changes
      const handleFilterChange = (filter: string, value: string) => {
      console.log(filter)
        
      
        // const newFilters: FilterType = {
        //   lga: selectedLGA,
        //   role: selectedRole,
        //   date: dateRange,
        //   status: selectedStatus,
        //   startDate: startDate,
        //   endDate: endDate,
        // };
        const newFilters = { ...filterState };
      
      
      
      if (filter === 'Role') {
          setSelectedRole(value);  
          newFilters.role = value;
        } else if (filter === 'Date') {
          setDateRange(value);
          const [start, end] = value.split(' - ').map((date) => date.trim());
          newFilters.startDate = start;
          newFilters.endDate = end;
          delete newFilters.date;
        } else if (filter === 'Status') {
          setSelectedStatus(value);
          newFilters.status = value;
        }
      
        // Update the filter state
        setFilterState(newFilters);
      
        // Transform the date range into start and end dates
        // if (newFilters.date) {
        //   const [startDate, endDate] = newFilters.date.split(' - ').map(date => date.trim()) || [null, null];
        //   newFilters.startDate = startDate;
        //   newFilters.endDate = endDate;
        //   delete newFilters.date; 
      
        // }
      
       
      
        // Call any logic to update data based on the new filters
        // console.log('Transformed Filters:', newFilters);
      
        // Update your data or perform actions here
      };
      
  return (
    <>
       <FilterModal
        open={openModal}
        setOpen={setOpenModal}
        handleFilterChange={handleFilterChange}
        roles={roles}
        selectedLGA={selectedLGA}
        setSelectedLGA={setSelectedLGA}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 lg:mt-0 intro-y   py-8  ">
        <div className="col-span-12 justify-start items-start flex  intro-y sm:flex">
          {/* <div className='mr-auto'>
            <h2 className="text-lg font-medium text-black intro-y ">Users</h2>
            <p className="mt-4 text-xs text-black intro-y">View, Edit and Delete users</p>
          </div> */}
          <div className=" hidden mr-auto md:block">
            <h2 className="mr-5 text-3xl font-bold truncate">User Management</h2>
            <Breadcrumb
              light={false}
              className={clsx([
                "h-[45px]  text-xs md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
                // props.layout != "top-menu" && "md:pl-6",
              ])}
            >
              <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
              <Breadcrumb.Link to="/" active={true}>
                User Management
              </Breadcrumb.Link>
            </Breadcrumb>
          </div>

          <Button
           
           onClick={() => setIsModalOpen(true)}
           className="mr-2 flex  justify-center items-center font-medium shadow-sm bg-customColor rounded-lg px-4 py-2 text-white text-sm"
          >
            <Lucide icon="Plus" className="w-5 h-5 mr-2 " /> New User
          </Button>

          <Button className="mr-2 shadow-sm  border-slate-300 py-1.5">
            <Lucide icon="Download" className="w-5 h-5 mr-2" /> Export as Excel
          </Button>

        <AdminCreationModal
        isOpen={isModalOpen}
        isLoading={loading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAdmin}
      />
        </div>

        <div className="col-span-12 justify-start items-center flex  intro-y sm:flex ">
         
         
         
         
         
         
          {/* <div className="relative lg:w-1/3 w-full text-slate-500 mr-6">
            <FormInput
              type="text"
              className="border-transparent w-full text-black border-slate-100  pl-12 shadow-none rounded-xl bg-white pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-96 dark:bg-darkmode-400/70 h-14"
              placeholder="Search database..."
            />
            <Lucide
              icon="Search"
              className="absolute inset-y-0 left-4 w-6 h-6 my-auto mr-3 text-slate-300 dark:text-slate-500"
              />
          </div> */}
          


          <div className="relative lg:w-1/3 w-full text-slate-500 mr-6">
              <FormInput
              
                type="text"
                className="border-transparent w-full text-black border-slate-100  pl-12 shadow-none rounded-xl bg-white pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-96 dark:bg-darkmode-400/70 h-14"
                placeholder="Search database..."
                onFocus={showSearchDropdown}
                onBlur={hideSearchDropdown}
                value={query}
                onChange={handleSearch}
              />
              <Lucide
              icon="Search"
              className="absolute inset-y-0 left-4 w-6 h-6 my-auto mr-3 text-slate-300 dark:text-slate-500"
              />






{(query.length > 2 || recentSearches) && (

<Transition
  as={Fragment}
  show={searchDropdown}
  enter="transition-all ease-linear duration-150"
  enterFrom="mt-5 invisible opacity-0 translate-y-1"
  enterTo="mt-[3px] visible opacity-100 translate-y-0"
  leave="transition-all ease-linear duration-150"
  leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
  leaveTo="mt-5 invisible opacity-0 translate-y-1"
>

  <div className="absolute left-0 z-10 mt-[3px] overflow-y-scroll h-72 ">
    <div className="w-[450px] p-5 box bg-slate-100">


{/* Users Display */}
{results?.users?.length > 0 && (
<>
      <div className="mb-2 font-medium">Users</div>
      <div className="mb-5 font-medium border-b border-slate-200 pb-4">

      <ul>
    {results.users.map(user => (
      <li                       key={user?.id}                  >

<Link
          to={`/user-profile/${user?.id}`}
          className="flex items-center mt-2"
        >
          <div className="w-8 h-8 image-fit">
            <img
              alt="user"
              className="rounded-full"
              src={user?.profile_picture_url? user?.profile_picture_url : profile}
            />
          </div>
          <div className="ml-3">{user?.name}</div>
          <div className="ml-3 text-slate-500"> {user?.lga}</div>

          <div className="w-48 ml-auto text-xs text-right truncate text-slate-500">
          {user.email}

          </div>
        </Link>
      </li>
    ))}
  </ul>
</div>
</>
)}



{recentSearches && (
<div className="mt-4">
<h4>Recent Searches</h4>
<ul>
{recentSearches.map((search, index) => (
  <li key={index}>
    <button
      onClick={() => handleRecentSearchClick(search)}
      className="text-blue-500 underline"
    >
      {search}
    </button>
  </li>
))}
</ul>
</div>
)}


    </div>
  </div>

</Transition>

)}





            </div>

          

        

          <Menu className="text-xs mr-2 border rounded-lg border-customColor">
            <Menu.Button as={Button} className=" text-customColor text-[16px]">
            <Lucide icon="Filter" className="w-4 h-4 mr-2 " />
              Filter
              <Lucide icon="ChevronDown" className="w-6 h-6 ml-2 " />
    </Menu.Button>
    <Menu.Items className="w-40 text-xs">
    <Menu.Header className="">Filter Categories</Menu.Header>

        {/* <Menu.Item>
            <Lucide icon="Home" className="w-4 h-4 mr-2" />
            LGA

            <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />

        </Menu.Item> */}

<Menu.Item
onClick={() => { setOpenModal(true); setActiveFilter("Role"); }}
>
           
              <Lucide icon="User" className="w-4 h-4 mr-2" />
              Role
              <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
        </Menu.Item> 

<Menu.Item
onClick={() => { setOpenModal(true); setActiveFilter("LGA"); }}
>
           
              <Lucide icon="Home" className="w-4 h-4 mr-2" />
              LGA
              <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
        </Menu.Item> 

        <Menu.Item
        onClick={() => { setOpenModal(true); setActiveFilter("Date"); }}
        >
            <Lucide icon="Calendar" className="w-4 h-4 mr-2" />
            Date

            <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />

        </Menu.Item>
        
        <Menu.Item
        onClick={() => { setOpenModal(true); setActiveFilter("Status"); }}
        >
            <Lucide icon="Check" className="w-4 h-4 mr-2" />
            Status

            <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />

        </Menu.Item>
        
       
    </Menu.Items>
</Menu>
        
<FilterChips
          selectedRole={selectedRole}
          selectedStatus={selectedStatus}
          
          selectedUser=''
          dateRange={dateRange}
          onRemoveFilter={handleRemoveFilter}
        />

 
        </div>


        <div className="col-span-12 border rounded-2xl  bg-white   px-5  sm:px-6 intro-y">

         

          <div className="grid grid-cols-12 gap-6 ">
            <div className="col-span-12 intro-y text-black  bg-white  lg:px-0">
              <div className="flex flex-col lg:flex-row w-full gap-y-2 text-primary items-center space-x-3">
                {datepickerModalPreview && (
                  <Dialog
                    open={datepickerModalPreview}
                    onClose={() => {
                      setDatepickerModalPreview(false);
                    }}
                    initialFocus={cancelButtonRef}
                    className="flex place-self-center lg:items-center lg:justify-center  "
                  >
                    <Dialog.Panel
                      className=""
                    >
                      {/* BEGIN: Modal Header */}
                      <Dialog.Title>
                        <div className="flex justify-center items-center">
                          <div className="bg-customColor/20 fill-customColor text-customColor mr-2 rounded-lg p-1.5">
                            <Lucide icon="Calendar" className="w-6 h-6 " />
                          </div>
                          <div className="">
                            <h2 className="mr-auto text-slate-600 font-bold">
                              Date Range
                            </h2>
                            <p className="text-xs">
                              Choose a date range to filter
                            </p>
                          </div>
                        </div>
                      </Dialog.Title>
                      {/* END: Modal Header */}
                      {/* BEGIN: Modal Body */}
                      <Dialog.Description className="grid grid-cols-12 gap-x gap-y-6">
                        <div className="col-span-12 relative">
                          <FormLabel htmlFor="modal-datepicker-1">
                            Start Date
                          </FormLabel>
                          <Litepicker
                            id="modal-datepicker-1"
                            value={startDate}
                            onChange={setStartDate}
                            options={{
                              autoApply: false,
                              showWeekNumbers: true,
                              dropdowns: {
                                minYear: 1990,
                                maxYear: null,
                                months: true,
                                years: true,
                              },
                            }}
                          />
                          <div className="absolute flex items-center justify-center w-8  h-8 right-0 bottom-1  text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                            <Lucide icon="Calendar" className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="col-span-12 relative ">
                          <FormLabel htmlFor="modal-datepicker-2">
                            End Date
                          </FormLabel>
                          <Litepicker
                            id="modal-datepicker-2"
                            value={endDate}
                            onChange={setEndDate}
                            options={{
                              autoApply: false,
                              showWeekNumbers: true,
                              dropdowns: {
                                minYear: 1990,
                                maxYear: null,
                                months: true,
                                years: true,
                              },
                            }}
                          />

                          <div className="absolute flex items-center justify-center w-8  h-8 right-0 bottom-1  text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                            <Lucide icon="Calendar" className="w-4 h-4" />
                          </div>
                        </div>
                      </Dialog.Description>
                      {/* END: Modal Body */}
                      {/* BEGIN: Modal Footer */}
                      <Dialog.Footer className="text-right">
                        <Button
                          variant="outline-secondary"
                          type="button"
                          onClick={() => {
                            setDatepickerModalPreview(false);
                          }}
                          className="w-20 mr-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          // variant="primary"
                          type="button"
                          className="w-autos bg-customColor text-secondary"
                          ref={cancelButtonRef}
                          onClick={() => {
                            setDateRange(`${startDate}-${endDate}`);
                            // const dateString = date.toString(); // Convert date object to string
                            // handleAddFilter('Date', dateString);
                            handleFilterChange(
                              "Date",
                              `${startDate} - ${endDate}`
                            );
                            setDatepickerModalPreview(false);
                          }}
                        >
                          Apply Filter
                        </Button>
                      </Dialog.Footer>
                      {/* END: Modal Footer */}
                    </Dialog.Panel>
                  </Dialog>
                )}

          
              </div>
            </div>

            {/* Data List or Loading Indicator */}
         <DisplayTable userList={userList} loading={loading} />

          

            {/* Delete Confirmation Modal */}
            <Dialog
              open={deleteConfirmationModal}
              onClose={() => setDeleteConfirmationModal(false)}
              initialFocus={deleteButtonRef}
            >
              {/* Dialog content */}
            </Dialog>
          </div>
        </div>
      </div>

      <Notification
              id="success-notification-content"
              className="flex  "
            >
              <Lucide icon="CheckCircle" className="text-success" />
              <div className="ml-4 mr-4">
                <div className="font-medium">Admin Added!</div>
                <div className="mt-1 text-slate-500">
                Successfully  added new Admin
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
