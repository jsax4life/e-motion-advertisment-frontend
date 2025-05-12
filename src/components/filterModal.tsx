import _ from "lodash";
import { useState, useRef, useEffect, useContext, Key } from "react";
import Button from "../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../base-components/Form";
import Lucide from "../base-components/Lucide";
import { Menu, Tab, Dialog } from "../base-components/Headless";
import Litepicker from "../base-components/Litepicker";

type Role = {
  id: number;
  name: string;
};


// Define props interface for the component
interface FilterModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  handleFilterChange: (type: string, value: string) => void;

  locations: any[];
  industries: any[];
  roles: Role[],
  clientTypes: any[];
  statuses: any[];
  orientations: any[];
  billboardTypes: any[];
  selectedIndustry: string,
  selectedRole: string,
  selectedLocation: string,
  selectedClientType: string,
  selectedStatus: string,
  selectedOrientation: string,
  selectedBillboardType: string,

  setSelectedStatus: (status: string) => void,
  setSelectedOrientation: (orientation: string) => void,
  setSelectedBillboardType: (billboardType: string) => void,
  setSelectedRole:  (role: string) => void,

  setSelectedClientType: (clientType: string) => void;
  setSelectedLocation: (location: string) => void;
  setSelectedIndustry:  (industry: string) => void;

  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  activeFilter: "Date" | "Location" | "Industry" | "ClientType" | "Orientation" | "BillboardType" | "Status" | "Role"; 
  setActiveFilter: (filter: "Date" | "Location" | "Industry" | "ClientType" | "Orientation" | "BillboardType" | "Status") => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  setOpen,
  handleFilterChange,
 
  selectedIndustry,
  selectedLocation,
  selectedClientType,
  selectedRole,

  selectedStatus,
  selectedOrientation,
  selectedBillboardType,
  roles,
  locations,
  industries,
  clientTypes,
  statuses,
  orientations,
  billboardTypes,
  
  setSelectedRole,
  setSelectedStatus,
  setSelectedOrientation,
  setSelectedBillboardType,

  setSelectedClientType,
  setSelectedLocation,
  setSelectedIndustry,
  
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  activeFilter,
  
}) => {
  // Temporary states for selections
  const [tempSelectedLocation, setTempSelectedLocation] = useState(selectedLocation);
  const [tempSelectedIndustry, setTempSelectedIndustry] =
    useState(selectedIndustry);
    const [tempSelectedStatus, setTempSelectedStatus] =
    useState(selectedStatus);
    const [tempSelectedRole, setTempSelectedRole] =
    useState(selectedRole);
    
    const [tempSelectedOrientation, setTempSelectedOrientation] =
    useState(selectedOrientation);
    const [tempSelectedBillboardType, setTempSelectedBillboardType] =
    useState(selectedBillboardType);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [  tempSelectedClientType, setTempSelectedClientType] = useState(selectedClientType);

  const [tempEndDate, setTempEndDate] = useState(endDate);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  // Handle LGA filter apply
  const applyClientTypesFilter = () => {
    setSelectedClientType(tempSelectedClientType);
    handleFilterChange("ClientType", tempSelectedClientType);
    setOpen(false);
  };

  // Handle Car Park filter apply
  const applyLocationFilter = () => {
    setSelectedLocation(tempSelectedLocation);
    handleFilterChange("Location", tempSelectedLocation);
    setOpen(false);
  };

  // Handle Date filter apply
  const applyDateFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    handleFilterChange("Date", `${tempStartDate} - ${tempEndDate}`);
    setOpen(false);
  };

    // Handle Industry filter apply
    const applyIndustryFilter = () => {
      setSelectedIndustry(tempSelectedIndustry);
      handleFilterChange("Industry", tempSelectedIndustry);
      setOpen(false);
    };

    const applyStatusFilter = () => {
      setSelectedStatus(tempSelectedStatus);
      handleFilterChange("Status", tempSelectedStatus);
      setOpen(false);
    };

    const applyOrientationFilter = () => {
      setSelectedOrientation(tempSelectedOrientation);
      handleFilterChange("Orientation", tempSelectedOrientation);
      setOpen(false);
    };

    const applyBillboardTypeFilter = () => {
      setSelectedBillboardType(tempSelectedBillboardType);
      handleFilterChange("BillboardType", tempSelectedBillboardType);
      setOpen(false);
    };
    
    const applyRoleFilter = () => {
      setSelectedRole(tempSelectedRole);
      handleFilterChange("Role", tempSelectedRole);
      setOpen(false);
    };
    

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      initialFocus={sendButtonRef}
      className="flex place-self-center lg:items-center lg:justify-center"
    >
      <Dialog.Panel className="">
        <Dialog.Title>
          <div className="flex justify-center items-center">
            <div className="bg-customColor/20 fill-customColor text-customColor mr-2 rounded-lg p-2">
              <Lucide
                icon={
                activeFilter === "Date" 
                  ? "Calendar" 
                    : activeFilter === "Location"
                    ? "Accessibility"
                    : activeFilter === "Industry" 
                    ? "InstagramIcon" 
                    : activeFilter === "ClientType"
                    ? "Users" 
                    : activeFilter === "Status"
                    ? "Users" 
                    : activeFilter === "Orientation"
                    ? "Users" 
                    : activeFilter === "BillboardType"
                    ? "Users" 
                    : activeFilter === "Role"
                    ? "User" :
                    "User"
                }
                className="w-5 h-5"
              />
             
            </div>
            <div className="">
              <h2 className="mr-auto text-slate-600 font-bold">
                {activeFilter === "Date"
                  ? "Date Range"
                  : activeFilter === "Location"
                  ? "All Location"
                  : activeFilter === "Industry" 
                  ? "All Industries" 
                  : activeFilter === "ClientType"
                  
                  ? "Client Types" 
                  : activeFilter === "Status"
                  ? "Status" 
                  : activeFilter === "Orientation"
                  ? "Orientations" 
                  : activeFilter === "BillboardType"
                  ? "All Billboard " 
                  : activeFilter === "Role"
                  ? "Roles " 
                
                  : ""}
              </h2>
              <p className="text-xs text-slate-500">
                {activeFilter === "Date"
                  ? "Select a date range"
                  : activeFilter === "Location"
                  ? "Select a location"
                  : activeFilter === "Industry" 
                  ? "Select an Industries" 
                  : activeFilter === "ClientType"
                  ? "Choose a client type" 
                  : activeFilter === "Status"
                  ? "Select s status to filter" 
                  : activeFilter === "Orientation"
                  ? "Select an orientation type" 
                  : activeFilter === "BillboardType"
                  ? "Choose a billboard type to filter " 
                  : activeFilter === "Role"
                  ? "Select a role to filter "
                  : ""}
              </p>
            </div>
          </div>
        </Dialog.Title>

        <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
          {activeFilter === "Date" ? (
            <>
              <div className="col-span-12 relative">
                <FormLabel htmlFor="modal-datepicker-1">Start Date</FormLabel>
                <Litepicker
                  id="modal-datepicker-1"
                  value={tempStartDate}
                  onChange={setTempStartDate}
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
                <div className="absolute flex items-center justify-center w-8 h-8 right-0 bottom-1 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                  <Lucide icon="Calendar" className="w-4 h-4" />
                </div>
              </div>
              <div className="col-span-12 relative ">
                <FormLabel htmlFor="modal-datepicker-2">End Date</FormLabel>
                <Litepicker
                  id="modal-datepicker-2"
                  value={tempEndDate}
                  onChange={setTempEndDate}
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
                <div className="absolute flex items-center justify-center w-8 h-8 right-0 bottom-1 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                  <Lucide icon="Calendar" className="w-4 h-4" />
                </div>
              </div>
            </>
          ) : activeFilter === "Location" ? (
            <div className="col-span-12 ">
              <FormLabel htmlFor="location">Select Location</FormLabel>
              <FormSelect
                id="location"
                className=""
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSelectedLocation(value); // Store the selected value temporarily
                }}
                value={tempSelectedLocation}
              >
                <option value="" disabled>
                  All Locations
                </option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </FormSelect>
            </div>
          ) : activeFilter === "Industry" ? (
            <div className="col-span-12 ">
              <FormLabel htmlFor="industry">Select Industry</FormLabel>
              <FormSelect
                id="industry"
                className=""
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSelectedIndustry(value); // Store the selected value temporarily
                }}
                value={tempSelectedLocation}
              >
                <option value="" disabled>
                  All Industries
                </option>
                {industries.map((industry, index) => (
                  <option key={index} value={industry}>
                    {industry}
                  </option>
                ))}
              </FormSelect>
            </div>
          ) :  activeFilter === "ClientType" ? (
            <div className="col-span-12 ">
              <FormLabel htmlFor="clientType">Select Client Type</FormLabel>
              <FormSelect
                id="clientType"
                className=""
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSelectedClientType(value); // Store the selected value temporarily
                }}
                value={tempSelectedClientType}
              >
                <option value="" disabled>
                  All Client Types
                </option>
                {clientTypes.map((clientType, index) => (
                  <option key={index} value={clientType}>
                    {clientType}
                  </option>
                ))}
              </FormSelect>
            </div>
          ) : activeFilter === "Status" ? (
            <div className="col-span-12 ">
              <FormLabel htmlFor="Status">Select Status</FormLabel>
              <FormSelect
                id="Status"
                className=""
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSelectedStatus(value); // Store the selected value temporarily
                }}
                value={tempSelectedStatus}
              >
                <option value="" disabled>
                  All Status
                </option>
                {statuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </FormSelect>
            </div>
          ) : activeFilter === "BillboardType" ? (
            <div className="col-span-12 ">
              <FormLabel htmlFor="BillboardType">Select Billboard Type</FormLabel>
              <FormSelect
                id="BillboardType"
                className=""
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSelectedBillboardType(value); // Store the selected value temporarily
                }}
                value={tempSelectedBillboardType}
              >
                <option value="" disabled>
                  All Billboard Types
                </option>
                {billboardTypes.map((billbaordType, index) => (
                  <option key={index} value={billbaordType}>
                    {billbaordType}
                  </option>
                ))}
              </FormSelect>
            </div>
          ) : activeFilter === "Orientation" ? (
            <div className="col-span-12 ">
              <FormLabel htmlFor="Orientation">Select Orientation</FormLabel>
              <FormSelect
                id="Orientation"
                className=""
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSelectedOrientation(value); // Store the selected value temporarily
                }}
                value={tempSelectedOrientation}
              >
                <option value="" disabled>
                  All Orientations
                </option>
                {orientations.map((orientation, index) => (
                  <option key={index} value={orientation}>
                    {orientation}
                  </option>
                ))}
              </FormSelect>
            </div>
          ) : activeFilter === "Role" ? (
            <div className="col-span-12 ">
              <FormLabel htmlFor="industry">Select Role</FormLabel>
              <FormSelect
                id="industry"
                className=""
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSelectedRole(value); // Store the selected value temporarily
                }}
                value={tempSelectedRole}
              >
                <option value="" disabled>
                  All Roles
                </option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </FormSelect>
            </div>
          ) : (
            <>
             
            </>
          )}
        </Dialog.Description>

        <Dialog.Footer className="text-right">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={handleClose}
            className="w-20 mr-1 border-customColor text-customColor"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            className="lg:w-25 bg-customColor"
            ref={sendButtonRef}
            onClick={
              activeFilter === "Date"
              ? applyDateFilter
              : activeFilter === "Location"
              ? applyLocationFilter
              : activeFilter === "Industry" 
              ? applyIndustryFilter 
              : activeFilter === "ClientType"
              ? applyClientTypesFilter
              : activeFilter === "Orientation"
              ? applyOrientationFilter
              : activeFilter === "Status"
              ? applyStatusFilter
              : activeFilter === "BillboardType"
              ? applyBillboardTypeFilter
              : activeFilter === "Role"
              ? applyRoleFilter
             
              : () => {}
            }
          >
            Apply Filter
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default FilterModal;
