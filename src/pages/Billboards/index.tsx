/* This example requires Tailwind CSS v2.0+ */
import { Fragment, Key, useContext, useEffect } from "react";
// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import _, { set } from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

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
import FilterModal from "../../components/filterModal";
import Breadcrumb from "../../base-components/Breadcrumb";
import BillboardCreationModal from "./BillboardCreationModal";
import Notification from "../../base-components/Notification";
import Toastify from "toastify-js";
import { PullBillboardContext } from "../../stores/BillboardDataContext";
import ChangeStatusModal from "./ChangeStatusModal";
import { formatCurrency } from "../../utils/utils";

const locations = [
  "Abia", "Adamawa", "AkwaIbom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
]

const billboard_types  =[
  "Digital",
  "Static",
  "Bespoke",
]

const orientations = [
  "Landscape",
  "Portrait",
  "Cube",
]

const statuses = [
  'Active',
  "Inactive",
  "Under Maintenance",
]



export default function Main() {
  const { user } = useContext(UserContext);

  const [openModal, setOpenModal] = useState(false);

  const [billboardList, setBillboardList] = useState<any[]>([]);
  const { billboards, billboardDispatch } = useContext(PullBillboardContext);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const [dateRange, setDateRange] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);

  const [selectedOrientation, setSelectedOrientation] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const [selectedBillboardType, setSelectedBillboardType] =
    useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);

  const [selectedBillboard, setSelectedBillboard] = useState();

  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<
    | "Location"
    | "Date"
    | "Industry"
    | "ClientType"
    | "Orientation"
    | "BillboardType"
    | "Status"
  >("Location");
  const cancelButtonRef = useRef(null);
  const isInitialMount = useRef(true);

  // console.log(vehicleList)

  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // console.log('true')

      
      const userListFromLocalStorage = localStorage.getItem("userList");
      setUserList(
        userListFromLocalStorage ? JSON.parse(userListFromLocalStorage) : []
      );
      return;
    }

    fetchBillboardData();
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      fetchBillboardData();
    }
  }, [user?.token, selectedBillboardType, selectedOrientation, selectedStatus, selectedLocation]);

  const fetchBillboardData = () => {

    setError("");
    setLoading(true);

    const params: any = {};
    if (selectedBillboardType) params.billboardType = selectedBillboardType;
    
    if (selectedOrientation) params.orientation = selectedOrientation;
    if (selectedStatus) params.status = selectedStatus;
    if (selectedLocation) params.location = selectedLocation;


    API(
      "get",
      `billboard-data`,
      params,
      // {lga: 'Alimosho'},
      function (bbListData: any) {
        setBillboardList(bbListData.registered_billboards);
        billboardDispatch({
          type: "STORE_BILLBOARD_DATA",
          billboard: bbListData.registered_billboards,
        });
        setLoading(false);
        console.log(bbListData);
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
      `create-billboard`,

      { ...data },
      function (reponse: any) {
        console.log(reponse);
        setBillboardList((prev) => [reponse.data, ...prev]);
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

  const handleChangeStatusClick = (billboard: any) => {
    setSelectedBillboard(billboard);
    setStatusModalOpen(true);
  };
  const handleUpdateBillboardStatus = (data: any) => {
    console.log(data);
    // setIsModalOpen(false);
    setLoading(true);

    API(
      "patch",
      `billboards/${data?.id}/status`,

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
        toast.error(error);
      },
      user?.token && user.token
    );
    // Call your API to add a new billboard here
  };

  // Function to handle removing filters
  const handleRemoveFilter = (filter: string) => {
    if (filter === "Location") {
      setSelectedLocation("");
    } else if (filter === "Status") {
      setSelectedStatus("");
    } else if (filter === "Orientation") {
      setSelectedOrientation("");
    } else if (filter === "BillboardType") {
      setSelectedBillboardType("");
    } 

    // Optionally update your data based on the filters being removed
  };

  // Function to handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    const newFilters = {
      orientation: selectedOrientation,
      location: selectedLocation,
      status: selectedStatus,
      billboardType: selectedBillboardType,
    };

    if (filter === "Location") {
      setSelectedLocation(value);
      newFilters.location = value;
    } else if (filter === "Status") {
      setSelectedStatus(value);
      newFilters.status = value;
    } else if (filter === "Orientation") {
      setSelectedOrientation(value);
      newFilters.orientation = value;
    } else if (filter === "BillboardType") {
      setSelectedBillboardType(value);
      newFilters.billboardType = value;
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
       

        setSelectedBillboardType={setSelectedBillboardType}
        setSelectedOrientation={setSelectedOrientation}
        setSelectedStatus={setSelectedStatus}
        setSelectedLocation={setSelectedLocation}

        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        clientTypes={[]}
        industries={[]}
        setSelectedClientType={() => {}}
        setSelectedIndustry={() => {}}
        selectedClientType={""}
        selectedIndustry={""}

        selectedBillboardType={selectedBillboardType}
        selectedOrientation={selectedOrientation}
        selectedStatus={selectedStatus}
        selectedLocation={selectedLocation}


        billboardTypes={billboard_types}
        orientations={orientations}
        statuses={statuses}
        locations={locations}

      />

      <div className="grid grid-cols-12 gap-5 lg:gap-7 mt-5 lg:mt-0 intro-y   py-8  ">
        <div className="col-span-12 justify-start items-start flex  intro-y sm:flex">
          {/* <div className='mr-auto'>
            <h2 className="text-lg font-medium text-black intro-y ">Users</h2>
            <p className="mt-4 text-xs text-black intro-y">View, Edit and Delete users</p>
          </div> */}
          <div className=" hidden mr-auto md:block">
            <h2 className="mr-5 text-3xl font-bold truncate">Billboard</h2>
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
            <Lucide icon="Plus" className="w-5 h-5 mr-2 " /> New Billboard
          </Button>

          <Button className="mr-2 shadow-sm  border-slate-300 py-1.5">
            <Lucide icon="Download" className="w-5 h-5 mr-2" /> Export as Excel
          </Button>

          <BillboardCreationModal
            isOpen={isModalOpen}
            isLoading={loading}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddBillboard}
          />

          <ChangeStatusModal
            isOpen={isStatusModalOpen}
            billboard={selectedBillboard}
            isLoading={loading}
            onClose={() => setStatusModalOpen(false)}
            onSubmit={handleUpdateBillboardStatus}
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
                  setActiveFilter("BillboardType");
                }}
              >
                <Lucide icon="Home" className="w-4 h-4 mr-2" />
                Billboard Type
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
                  setActiveFilter("Location");
                }}
              >
                <Lucide icon="Type" className="w-4 h-4 mr-2" />
                Location
                <Lucide icon="ChevronRight" className="w-4 h-4 ml-auto" />
              </Menu.Item>
            </Menu.Items>
          </Menu>

         
          <FilterChips
                 selectedLocation={selectedLocation}
                  selectedIndustry={""}
                  dateRange={dateRange}
                  selectedClientType={""}
                  selectedBillboardType={selectedBillboardType}
                  selectedOrientation={selectedOrientation}
                  selectedStatus={selectedStatus}

                  onRemoveFilter={handleRemoveFilter}
                />
        </div>

        <div className="col-span-12 border rounded-2xl  bg-white   px-5  sm:px-6 intro-y">
          <div className="grid grid-cols-12 gap-6 ">
          

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

                <Table className="border-spacing-y-[8px] border-separate ">
                  <Table.Thead className=" lg:h-10 text-slate-400">
                    <Table.Tr>
                      <Table.Th className="   whitespace-nowrap">S/N</Table.Th>
                      <Table.Th className="   whitespace-nowrap">
                        BILLBOARD NAME
                      </Table.Th>
                      <Table.Th className="   whitespace-nowrap">
                        PRICE PER MONTH
                      </Table.Th>
                      <Table.Th className="   whitespace-nowrap">
                        BILLBOARD NUMBER
                      </Table.Th>
                      <Table.Th className="   whitespace-nowrap">
                        STATE
                      </Table.Th>

                      <Table.Th className="text-start    whitespace-nowrap">
                        STATUS
                      </Table.Th>
                      <Table.Th className="   whitespace-nowrap">
                        SPECIFICATION
                      </Table.Th>
                      {/* <Table.Th className="text-right border-b-0   whitespace-nowrap">
                  <div className="pr-16">TOTAL TRANSACTION</div>
                </Table.Th> */}
                      <Table.Th className="text-center    whitespace-nowrap">
                        ACTION
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody className="">
                    {billboardList.map(
                      (
                        billboard: any,
                        billboardKey: any | null | undefined
                      ) => (
                        <Table.Tr
                          key={billboardKey}
                          className="intro-x text-black capitalize"
                        >
                          <Table.Td className=" first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                            <div className=" whitespace-nowrap">
                              {billboardKey + 1}
                            </div>
                          </Table.Td>

                          {/* <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600  border-slate-200 border-b">
                            <div
                              className="flex items-center"
                              onClick={() => navigate(`/profile/${billboard.id}`)}
                            >
                              <div className="w-9 h-9 image-fit zoom-in">
                                <Tippy
                                  as="img"
                                  alt="Profile"
                                  className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                  src={billboard?.rider?.profile_picture_url}
                                  content={`Uploaded at ${billboard.created_at}`}
                                />
                              </div>
                              <div className="ml-4">
                                <a
                                  href=""
                                  className="font-medium whitespace-nowrap"
                                >
                                  {billboard?.rider?.first_name}{" "}
                                  {billboard?.rider?.last_name}
                                </a>
                          
                              </div>
                            </div>
                          </Table.Td> */}

                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white  dark:bg-darkmode-600 border-slate-200 border-b">
                            <>
                              <div className="whitespace-nowrap">
                                {billboard?.billboardName}
                              </div>
                            </>
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                            <>
                              <div className=" whitespace-nowrap">
                                &#x20A6;
                                {formatCurrency(billboard?.pricePerMonth)}
                              </div>
                            </>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                            <>
                              <div className="whitespace-nowrap">
                                {billboard?.internalCode}
                              </div>
                            </>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-40  bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                            <div className="">{billboard.state}</div>
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-1 dark:bg-darkmode-600 border-slate-200 border-b">
                            <span
                              className={`items-center  lg:py-1  text-xs font-medium uppercase ${
                                billboard?.status == "active"
                                  ? "text-green-600"
                                  : billboard?.status == "inactive"
                                  ? "text-red-600"
                                  : "text-orange-400"
                              }`}
                            >
                              {billboard?.status}
                            </span>
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md text-start   dark:bg-darkmode-600 border-slate-200 border-b">
                            <div className="">
                              <span className="mr-1 bg-purple-100 text-indigo-600 px-1">
                                {billboard?.orientation}
                              </span>

                              <span className="bg-blue-100 text-blue-7600 px-1">
                                {billboard?.billboardType}
                              </span>
                            </div>
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-slate-200 border-b   dark:bg-darkmode-600  py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            {/* <div className="flex items-center justify-center">
                              <button
                                className="flex items-center  text-customColor whitespace-nowrap"
                                onClick={() =>
                                  navigate(`/profile/${billboard.id}`)
                                }
                              >
                                <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                                View Profile
                              </button>
                            </div> */}
                            <Menu className="ml-3">
                              <Menu.Button
                                //   tag="p"
                                className="w-5 h-5 text-slate-500"
                              >
                                <Lucide
                                  icon="MoreVertical"
                                  className="w-5 h-5"
                                />
                              </Menu.Button>
                              <Menu.Items className="w-40">
                                <Menu.Item
                                  onClick={() => {
                                    navigate(`/details/${billboard?.id}`);
                                  }}
                                >
                                  <Lucide
                                    icon="Edit2"
                                    className="w-4 h-4 mr-2"
                                  />{" "}
                                  View Details
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() =>
                                    handleChangeStatusClick(billboard)
                                  }
                                >
                                  <Lucide
                                    icon="Edit2"
                                    className="w-4 h-4 mr-2"
                                  />{" "}
                                  Change Status
                                </Menu.Item>
                                <Menu.Item className="text-red-500">
                                  <Lucide
                                    icon="Trash"
                                    className="w-4 h-4 mr-2 "
                                  />{" "}
                                  Delete
                                </Menu.Item>
                              </Menu.Items>
                            </Menu>
                          </Table.Td>
                        </Table.Tr>
                      )
                    )}
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

      <Notification id="success-notification-content" className="flex  ">
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Billboard Added!</div>
          <div className="mt-1 text-slate-500">
            Successfully added new billboard
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
