/* This example requires Tailwind CSS v2.0+ */
import { Fragment, Key, useContext, useEffect, useCallback } from 'react'
// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import _ from "lodash";
import { useState, useRef } from "react";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormCheck, FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";

import { Transition } from "@headlessui/react";
import Tippy from '../../base-components/Tippy';
import { UserContext } from '../../stores/UserContext';
import API from '../../utils/API';
import { Link, useNavigate } from 'react-router-dom';
import LoadingIcon from '../../base-components/LoadingIcon';
import FilterChips from '../../components/FilterChips';
import FilterModal from './filterModal';
import profile from "../../assets/images/profile.png"
import { debounce } from '../../utils/debounce';


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



const lagosLGAs = [
    "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa",
    "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye",
    "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland",
    "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"
  ];

  const roles = [
    "Registration Officer",
    "Attachment Officer",
    "Operation Officer",

  ];

  const usersStatus = [
    "Inactive",
    "Active",
  ]

  const tagStyle = [
    "bg-orange-100 text-orange-600",
    "bg-green-100 text-green-600",
  ];

export default function Main() {

    const { user } = useContext(UserContext);

    const [openModal, setOpenModal] = useState(false);

    const [userList, setUserList] = useState<any[]>([]);

    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const deleteButtonRef = useRef(null);
    const [dateRange, setDateRange] = useState<string>('');
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [selectedLGA, setSelectedLGA] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
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
  const storedRecentSearches = localStorage.getItem('recentSearches');
  if (storedRecentSearches) {
    setRecentSearches(JSON.parse(storedRecentSearches));
  }
}, []);

// console.log(vehicleList)

const navigate = useNavigate();


useEffect(() => {
  

            fetchDashboardData();
    
  }, [dateRange, selectedLGA, filterState ]);

    // useEffect(() => {
    //     if (user?.token) {
    //       fetchDashboardData();
    //     }
    //   }, [user?.token ]);
    
   
     

    
      const fetchDashboardData = () => {
        const [startDate, endDate] = dateRange?.split(' - ') || [null, null];
    
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
    


          // Function to handle removing filters
    const handleRemoveFilter = (filter: string) => {
      const newFilters = { ...filterState };

      if (filter === 'LGA') {
        setSelectedLGA('');
        newFilters.lga = '';
      } else if (filter === 'Role') {
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



  if (filter === 'LGA') {
    setSelectedLGA(value);
    newFilters.lga = value;
  } else if (filter === 'Role') {
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

  




// search

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
  localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
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



  
  return (
    <>
   
   <FilterModal
        open={openModal}
        setOpen={setOpenModal}
        handleFilterChange={handleFilterChange}
        lagosLGAs={lagosLGAs}
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
  
    <div className="max-w-7xl mx-auto pb-12 lg:pb-0  lg:px-0 lg:mx-0 ">
      <div className="bg-white   px-5 py-6 sm:px-6">

        {/* Content Section */}
        <div className="flex justify-start items-center">
          <div className='mr-auto'>
            <h2 className="text-lg font-medium text-black intro-y ">Users</h2>
            <p className="mt-4 text-xs text-black intro-y">View, Edit and Delete admins</p>
          </div>
          <Link to='/add-admin'  className="mr-2 flex font-medium shadow-sm bg-customColor rounded-lg px-4 py-2 text-white">
            <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New Admin
          </Link>
          <Button variant="secondary" className="mr-2 shadow-sm">
            <Lucide icon="Download" className="w-4 h-4 mr-2" /> Export As Excel
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 intro-y text-black mb-8 bg-white p-2 lg:px-0">
          <div className="flex flex-col lg:flex-row w-full gap-y-2 text-primary items-center space-x-3">




       
{/* search */}

            <div className="relative lg:w-1/4 w-full text-slate-500">
              <FormInput
              
                type="text"
                className="pr-10 box border-1 border-slate-200"
                placeholder="Search database..."
                onFocus={showSearchDropdown}
                onBlur={hideSearchDropdown}
                value={query}
                onChange={handleSearch}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
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
              alt="Midone Tailwind HTML Admin Template"
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












            


            <Menu className="text-xs ml-2">
    <Menu.Button as={Button} className="bg-customColor text-secondary" >
    <Lucide icon="Filter" className="w-4 h-4 mr-2" />

        Filter
        <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
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
          dateRange={dateRange}
          onRemoveFilter={handleRemoveFilter}
          selectedUser=''
        />
            
          </div>
        </div>

          {/* Data List or Loading Indicator */}
          {loading ? (
            <div className="col-span-12 flex items-center justify-center h-full">
              <div className="flex flex-col items-center justify-center w-full">
                <LoadingIcon icon="bars" className="w-8 h-8" />
                <div className="mt-2 text-xs text-center">Loading data</div>
              </div>
            </div>
          ) : (
            <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
              {/* Your table or data list */}
              {/* Render your vehicleList here */}



              <Table className="border-spacing-y-[2px] border-separate -mt-2">
            <Table.Thead className='bg-customColor/5 lg:h-11'>
              <Table.Tr>
                
                <Table.Th className="border-b-0 whitespace-nowrap">
                  S/N
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  USER'S NAME
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  FIRST NAME
                </Table.Th>
               
                <Table.Th className="border-b-0 whitespace-nowrap">
                    LAST NAME                
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    STAFF ID                
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    STATUS                
                </Table.Th>
              
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  ACTION
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody
            // className='overflow-y-scroll h-10'
            >
          
          {
              userList.map((admin: any, userKey: any | null | undefined) => (
                <Table.Tr key={userKey} className="intro-x text-slate-600">
                 
                  <Table.Td className=" first:rounded-l-md last:rounded-r-md w-10  bg-white  dark:bg-darkmode-600 border-slate-200 border-b ">
                    <div
                      className=" whitespace-nowrap"
                    >
                      {userKey + 1}
                    </div>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white  dark:bg-darkmode-600  border-slate-200 border-b">
                    <div className="flex items-center" onClick={() => navigate(`/admin-profile/${admin?.id}`)}>
                      <div className="w-9 h-9 image-fit zoom-in">
                        <Tippy
                          as="img"
                          
                          alt="Profile"
                          className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={profile}
                          content={`Uploaded at ${admin?.created_at}`}
                        />
                      </div>
                      <div className="ml-4">
                        <a href="" className="font-medium whitespace-nowrap">
                          {admin?.name}
                        </a>
                        {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                          {vehicle?.rider?.phone}
                        </div> */}
                      </div>
                    </div>
                  </Table.Td>


                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <span  className="font-medium whitespace-nowrap ">
{admin?.firstName}
                    </span>
                    
                  
                  </Table.Td>
                  
           
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40  bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div className="pr-16">{admin?.lastName}</div>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <span  className="font-medium whitespace-nowrap ">
{admin?.staffId}
                    </span>
                    
                  
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <span
                      className=
 {`items-center px-2 lg:py-1 rounded-full text-xs font-medium capitalize ${
    tagStyle[admin?.active]
  }`}
                         
                    >
                            {usersStatus[admin?.active]}
                    </span>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center justify-center">
                      <button
                        className="flex items-center  text-customColor whitespace-nowrap"
                        onClick={() => navigate(`/admin-profile/${admin?.id}`)}

                      >
                        {/* <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "} */}
                        View Profile
                      </button>
                   
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
          

            </Table.Tbody>
          </Table>



            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
            {/* Pagination component */}
            <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link>
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>1</Pagination.Link>
            <Pagination.Link active>2</Pagination.Link>
            <Pagination.Link>3</Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect className="w-20 mt-3 !box sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </FormSelect>
          </div>

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



    </>
  )
}
