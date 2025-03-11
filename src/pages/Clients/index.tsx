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
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";

import Litepicker from "../../base-components/Litepicker";
import Tippy from "../../base-components/Tippy";
import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import FilterChips from "../../components/FilterChips";
import FilterModal from "../Dashboard/filterModal";
import Breadcrumb from "../../base-components/Breadcrumb";
import CllientCreationModal from "./ClientCreationModal";
import Notification from "../../base-components/Notification";
import Toastify from "toastify-js";
import DisplaySection from "./DisplayTable";
import DisplayTable from "./DisplayTable";
import { PullClientContext } from "../../stores/ClientDataContext";

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
  const { clients, clientDispatch } = useContext(PullClientContext);

  const [openModal, setOpenModal] = useState(false);

  const [clientList, setClientList] = useState<any[]>([]);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const [dateRange, setDateRange] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);

  const [selectedLGA, setSelectedLGA] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");

  const [kpiData, setKpiData] = useState(null);
  const [selectedPark, setSelectedPark] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [datepickerModalPreview, setDatepickerModalPreview] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "State" | "Status" | "Orientation" | "Type"
  >("State");
  const cancelButtonRef = useRef(null);
  const isInitialMount = useRef(true);

  // console.log(vehicleList)

  const navigate = useNavigate();

 
  useEffect(() => {
    if (user?.token) {
      fetchClientData();
    }
  }, [user?.token]);

  const fetchClientData = () => {
    const [startDate, endDate] = dateRange?.split(" - ") || [null, null];

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
      `clients-data`,
      params,
      // {lga: 'Alimosho'},
      function (clientData: any) {
        clientDispatch({ type: "STORE_CLIENT_DATA", client: clientData.registered_clients });

        setClientList(clientData.registered_clients);

        setLoading(false);
        console.log(clientData);
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);
      },
      user?.token && user.token
    );
  };

  const handleAddBillboard = (data: any) => {
    console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "post",
      `create-client`,

      {...data},
      function (reponse: any) {
        console.log(reponse);
        setClientList((prev) => [reponse.data, ...prev]);
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
    if (filter === "State") {
      setSelectedLGA("");
    } else if (filter === "Status") {
      setSelectedPark("");
    } else if (filter === "Orientation") {
      setDateRange("");
    } else if (filter === "Type") {
      setSelectedUser("");
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

    if (filter === "State") {
      setSelectedLGA(value);
      newFilters.lga = value;
    } else if (filter === "Status") {
      setSelectedPark(value);
      newFilters.park = value;
    } else if (filter === "Orientation") {
      setDateRange(value);
      newFilters.date = value;
    } else if (filter === "Type") {
      setSelectedUser(value);
      newFilters.user = value;
    }

    // Call any logic to update data based on the new filters
    console.log("New Filters:", newFilters);

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

      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 lg:mt-0 intro-y   py-8  ">
        <div className="col-span-12 justify-start items-start flex  intro-y sm:flex">
          {/* <div className='mr-auto'>
            <h2 className="text-lg font-medium text-black intro-y ">Users</h2>
            <p className="mt-4 text-xs text-black intro-y">View, Edit and Delete users</p>
          </div> */}
          <div className=" hidden mr-auto md:block">
            <h2 className="mr-5 text-3xl font-bold truncate">Clients</h2>
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
            <Lucide icon="Plus" className="w-5 h-5 mr-2 " /> New Client
          </Button>

          <Button className="mr-2 shadow-sm  border-slate-300 py-1.5">
            <Lucide icon="Download" className="w-5 h-5 mr-2" /> Export as Excel
          </Button>

        <CllientCreationModal
        isOpen={isModalOpen}
        isLoading={loading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBillboard}
      />
        </div>

        <div className="col-span-12 justify-start items-center flex  intro-y sm:flex ">
          <div className="relative lg:w-1/3 w-full text-slate-500 mr-6">
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
                onClick={() => {
                  setOpenModal(true);
                  setActiveFilter("State");
                }}
              >
                <Lucide icon="Home" className="w-4 h-4 mr-2" />
                State
                <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
              </Menu.Item>

              <Menu.Item
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
                  setOpenModal(true);
                  setActiveFilter("Orientation");
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
                Type
                <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
              </Menu.Item>
            </Menu.Items>
          </Menu>

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
         <DisplayTable clientList={clientList} loading={loading} />

          

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
                <div className="font-medium">Client Added!</div>
                <div className="mt-1 text-slate-500">
                Successfully  added new Client
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
