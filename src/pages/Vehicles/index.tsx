/* This example requires Tailwind CSS v2.0+ */
import { Fragment, Key, useContext, useEffect } from 'react'
// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import _ from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormCheck, FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";

import Litepicker from "../../base-components/Litepicker";
import Tippy from '../../base-components/Tippy';
import { UserContext } from '../../stores/UserContext';
import API from '../../utils/API';
import { useNavigate } from 'react-router-dom';
import LoadingIcon from '../../base-components/LoadingIcon';
import FilterChips from '../../components/FilterChips';
import FilterModal from '../Dashboard/filterModal';

const lagosLGAs = [
    "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa",
    "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye",
    "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland",
    "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"
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

export default function Main() {

    const { user } = useContext(UserContext);

    const [openModal, setOpenModal] = useState(false);

    const [vehicleList, setVehicleList] = useState<any[]>([]);

    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const deleteButtonRef = useRef(null);
    const [dateRange, setDateRange] = useState<string>('');
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [userList, setUserList] = useState<any[]>([]);

    const [selectedLGA, setSelectedLGA] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<string>('');

    const [kpiData, setKpiData] = useState(null);
    const [selectedPark, setSelectedPark] = useState<string>('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [datepickerModalPreview, setDatepickerModalPreview] = useState(false);
    const [activeFilter, setActiveFilter] = useState<"LGA" | "Date" | "Park" | "Users">(
      "LGA"
    );
    const cancelButtonRef = useRef(null);
    const isInitialMount = useRef(true);

// console.log(vehicleList)

const navigate = useNavigate();


useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // console.log('true')

        setDateRange('')
        const userListFromLocalStorage = localStorage.getItem('userList');
        setUserList(userListFromLocalStorage ? JSON.parse(userListFromLocalStorage) : []);   
          return;

    }

    
      fetchDashboardData();
    
  }, [dateRange, selectedLGA, selectedPark, selectedUser]);

    useEffect(() => {
        if (user?.token) {
          fetchDashboardData();
        }
      }, [user?.token ]);
    
   
     

    
      const fetchDashboardData = () => {
        const [startDate, endDate] = dateRange?.split(' - ') || [null, null];
    
        setError("");
        setLoading(true);
        
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
          `vehicle-data`,
          params,
          // {lga: 'Alimosho'},
          function (vehicleListData: any) {
            setVehicleList(vehicleListData.registered_vehicles);
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
      if (filter === 'LGA') {
        setSelectedLGA('');
      } else if (filter === 'Park') {
        setSelectedPark('');
      } else if (filter === 'Date') {
        setDateRange('');
      } else if (filter === 'User') {
        setSelectedUser('');
      }
  
      // Optionally update your data based on the filters being removed
    };
  
 


  // Function to handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    const newFilters = {
      lga: selectedLGA,
      park: selectedPark,
      date: dateRange,
      user: selectedUser,

    };

    if (filter === 'LGA') {
      setSelectedLGA(value);
      newFilters.lga = value;
    } else if (filter === 'Park') {
      setSelectedPark(value);
      newFilters.park = value;
    } else if (filter === 'Date') {
      setDateRange(value);
      newFilters.date = value;
    }else if (filter === 'User') {
      setSelectedUser(value);
      newFilters.user = value;
    }


    // Call any logic to update data based on the new filters
    console.log('New Filters:', newFilters);

    // Update your data or perform actions here
  };
     


  
  return (
    <>
   
   <FilterModal
        open={openModal}
        setOpen={setOpenModal}
        handleFilterChange={handleFilterChange}
        lagosLGAs={lagosLGAs}
        carParks={lagosParks}
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
  
    <div className="max-w-7xl mx-auto pb-12 lg:pb-0  lg:px-0 lg:mx-0 ">
      <div className="bg-white   px-5 py-6 sm:px-6">

        {/* Content Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-black intro-y">Vehicles</h2>
            <p className="mt-4 text-xs text-black intro-y">View, Edit and Delete Vehicle</p>
          </div>
          <Button variant="secondary" className="mr-2 shadow-sm">
            <Lucide icon="Download" className="w-4 h-4 mr-2" /> Export As Excel Document
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 intro-y text-black mb-8 bg-white p-2 lg:px-0">
          <div className="flex flex-col lg:flex-row w-full gap-y-2 text-primary items-center space-x-3">



      {datepickerModalPreview &&    <Dialog
                      open={datepickerModalPreview}
                      onClose={() => {
                        setDatepickerModalPreview(false);
                      }}
                      initialFocus={cancelButtonRef}
                      className="flex place-self-center lg:items-center lg:justify-center  "

                    >
                      <Dialog.Panel className='  ">
'>
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
 <p className="text-xs">Choose a date range to filter</p>
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
                              setDateRange(`${startDate}-${endDate}`)
                              // const dateString = date.toString(); // Convert date object to string
                              // handleAddFilter('Date', dateString);
                              handleFilterChange('Date', `${startDate} - ${endDate}`);
                              setDatepickerModalPreview(false);

            
                            }}

                          >
                            Apply Filter
                          </Button>
                        </Dialog.Footer>
                        {/* END: Modal Footer */}
                      </Dialog.Panel>
                    </Dialog>
}

       


            <div className="relative lg:w-1/4 w-full text-slate-500">
              <FormInput
              
                type="text"
                className="pr-10 box border-1 border-slate-200"
                placeholder="Search database..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
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
onClick={() => { setOpenModal(true); setActiveFilter("LGA"); }}
>
           
              <Lucide icon="Home" className="w-4 h-4 mr-2" />
              LGA
              <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
        </Menu.Item> 

        
        <Menu.Item
        onClick={() => { setOpenModal(true); setActiveFilter("Park"); }}
        >
            <Lucide icon="Cloud" className="w-4 h-4 mr-2" />
            Park

            <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />

        </Menu.Item>
        {/* <Menu.Item
        onClick={(event: React.MouseEvent ) => { setOpenModal(true); setActiveFilter("Approval"); }}
        >
            <Lucide icon="Check" className="w-4 h-4 mr-2 " />
            Approval

            <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />

        </Menu.Item> */}
        <Menu.Item
      

        onClick={(event: React.MouseEvent ) => {  event.preventDefault(); setOpenModal(true); setActiveFilter("Date"); }}
        >
            <Lucide icon="Calendar" className="w-4 h-4 mr-2" />
            Date
            <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />

        </Menu.Item>

        <Menu.Item
                // onClick={() => setShowLgaSubMenu(!showLgaSubMenu)}
                onClick={() => {
                  setOpenModal(true);
                  setActiveFilter("Users");
                }}
              >
                <Lucide icon="Users" className="w-4 h-4 mr-2" />
                Users
                <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
              </Menu.Item>
       
    </Menu.Items>
</Menu>
        
<FilterChips
selectedRole=''
selectedStatus=''
          lagosLGAs={lagosLGAs}
          selectedLGA={selectedLGA}
          selectedPark={selectedPark}
          dateRange={dateRange}
          selectedUser={selectedUser}
          onRemoveFilter={handleRemoveFilter}
        />
            {/* <FormSelect className="w-48 xl:w-1/5 !box mr-4">
              <option value="" disabled>--All LGA--</option>
              {lagosLGAs.map((lga, index) => (
                <option key={index} value={lga}>{lga}</option>
              ))}
            </FormSelect> */}

            {/* <FormSelect className="w-48 lg:ml-2 lg:w-1/5 !box mr-2" onChange={(e) => setSelectedLGA(e.target.value)}>
              <option value="" disabled>--All LGA--</option>
              {lagosLGAs.map((lga, index) => (
                <option key={index} value={lga}>{lga}</option>
              ))}
            </FormSelect>

            <FormSelect className="w-48  lg:w-1/5 !box mr-2">
              <option>All Parks</option>
              <option>Active</option>
              <option>Removed</option>
            </FormSelect>

            <div className="relative sm:mt-0 text-slate-500">
              <Lucide
                icon="Calendar"
                className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3"
              />
              <Litepicker
              title='testing'
            
                value={dateRange}
                onChange={setDateRange}
                placeholder='Pick a date range'
                options={{
                  autoApply: false,
                  singleMode: false,
                  numberOfColumns: 2,
                  numberOfMonths: 2,
                  showWeekNumbers: true,
                  dropdowns: {
                    minYear: 2023,
                    maxYear: null,
                    months: true,
                    years: true,
                  },
                }}
                className="pl-10 sm:w-56 !box text-slate-500"
              />
            </div> */}
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



              <Table className="border-spacing-y-[2px] border-separate ">
            <Table.Thead className='bg-slate-50 lg:h-10'>
              <Table.Tr>
                
                <Table.Th className="border-b-0 whitespace-nowrap">
                  S/N
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  DRIVER
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  PLATE NUMBER
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                PHONE NUMBER

                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                    VIN                
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                    ACCREDITATION                
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                    STATUS                
                </Table.Th>
                {/* <Table.Th className="text-right border-b-0 whitespace-nowrap">
                  <div className="pr-16">TOTAL TRANSACTION</div>
                </Table.Th> */}
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  ACTION
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody
            // className='overflow-y-scroll h-10'
            >
          
          {
              vehicleList.map((vehicle: any, vehicleKey: any | null | undefined) => (
                <Table.Tr key={vehicleKey} className="intro-x text-slate-600">
                 
                  <Table.Td className=" first:rounded-l-md last:rounded-r-md w-10  bg-white  dark:bg-darkmode-600 border-slate-200 border-b ">
                    <div
                      className=" whitespace-nowrap"
                    >
                      {vehicleKey + 1}
                    </div>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600  border-slate-200 border-b">
                    <div className="flex items-center" onClick={() => navigate(`/profile/${vehicle.id}`)}>
                      <div className="w-9 h-9 image-fit zoom-in">
                        <Tippy
                          as="img"
                          
                          alt="Profile"
                          className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={vehicle?.rider?.profile_picture_url}
                          content={`Uploaded at ${vehicle.created_at}`}
                        />
                      </div>
                      <div className="ml-4">
                        <a href="" className="font-medium whitespace-nowrap">
                          {vehicle?.rider?.first_name} {vehicle?.rider?.last_name }
                        </a>
                        {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                          {vehicle?.rider?.phone}
                        </div> */}
                      </div>
                    </div>
                  </Table.Td>


                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <span  className="font-medium whitespace-nowrap ">
{vehicle?.plate_number? vehicle?.plate_number : '------'}
                    </span>
                    
                  
                  </Table.Td>
                  
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                   
                      <>
                        <div className="whitespace-nowrap">


                        {vehicle?.rider?.phone}
</div>
                       
                      </>
                  
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40  bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <div className="pr-16">{vehicle?.vin ? vehicle?.vin : '------'}</div>
                  </Table.Td>

                  

                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <span
                      className=
 {`items-center  lg:py-1  text-xs font-medium uppercase ${
    vehicle?.verification_status? 'text-green-600' : 'text-danger'
  }`}
                         
                    >
                            {vehicle?.verification_status? 'approved' : 'rejected' }
                    </span>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                    <span
                      className=
 {`items-center px-2 lg:py-1 rounded-full text-xs font-medium capitalize ${
    tagStyle[vehicle?.tagged]
  }`}
                         
                    >
                            {vehicle?.tagged ? "tagged" : "Registered "}
                    </span>
                  </Table.Td>

                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center justify-center">
                      <button
                        className="flex items-center  text-customColor whitespace-nowrap"
                        onClick={() => navigate(`/profile/${vehicle.id}`)}

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
