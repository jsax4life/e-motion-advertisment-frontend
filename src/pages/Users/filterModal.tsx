import _ from "lodash";
import { useState, useRef, useEffect, useContext, Key } from "react";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog } from "../../base-components/Headless";
import Litepicker from "../../base-components/Litepicker";

// Define props interface for the component
interface FilterModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  handleFilterChange: (type: string, value: string) => void;
  roles: string[];
  selectedLGA: string;
  setSelectedLGA: (lga: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  activeFilter: "Role" | "LGA" | "Date" | "Status";
  setActiveFilter: (filter: "Role" | "LGA" | "Date" | "Status") => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  setOpen,
  handleFilterChange,
  roles,
  selectedLGA,
  setSelectedLGA,
  selectedRole,
  setSelectedRole,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedStatus,
  setSelectedStatus,
  activeFilter,
}) => {
  // Temporary states for selections
  const [tempSelectedLGA, setTempSelectedLGA] = useState(selectedLGA);
  const [tempSelectedRole, setTempSelectedRole] =
    useState(selectedRole);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
const [tempSelectedStatus, setTempSelectedStatus] = useState(selectedStatus)
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  // Handle LGA filter apply
  const applyLGAFilter = () => {
    setSelectedLGA(tempSelectedLGA);
    handleFilterChange("LGA", tempSelectedLGA);
    setOpen(false);
  };

  // Handle Car Park filter apply
  const applyCarParkFilter = () => {
    setSelectedRole(tempSelectedRole);
    handleFilterChange("Role", tempSelectedRole);
    setOpen(false);
  };

  // Handle Date filter apply
  const applyDateFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    handleFilterChange("Date", `${tempStartDate} - ${tempEndDate}`);
    setOpen(false);
  };

  // Handle Status filter apply
  const applyStatusFilter = () => {
    setSelectedStatus(tempSelectedStatus);
    handleFilterChange("Status", tempSelectedStatus);
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
                  activeFilter === "Role"
                    ? "User"
                    : activeFilter === "LGA"
                    ? "Home" 
                    : activeFilter === "Date"
                    ? "Calendar" : "Check"
                }
                className="w-5 h-5"
              />
             
            </div>
            <div className="">
              <h2 className="mr-auto text-slate-600 font-bold">
                {activeFilter === "Role"
                  ? "User's Role"
                  : activeFilter === "LGA"
                  ? "Filter By LGA" 
                  : activeFilter === "Date"
                  ? "Filter By date Range" : "Filter By Status"}
              </h2>
              <p className="text-xs text-slate-500">
                {activeFilter === "LGA"
                  ? "Choose an LGA to filter"
                  : activeFilter === "Role"
                  ? "Choose a User Role to filter"
                  : activeFilter === "Date"
                  ? "Choosed a Date range to filter" 
                  : "Choose a date range to filter"
                  }
              </p>
            </div>
          </div>
        </Dialog.Title>

        <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
          { activeFilter === "Role" ? (
            <div className="col-span-12 ">
              <FormLabel htmlFor="role">Select Role</FormLabel>
              <FormSelect
                id="role"
                className=""
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSelectedRole(value); // Store the selected value temporarily
                }}
                value={tempSelectedRole}
              >
                <option value="" disabled>
                  All Role
                </option>
                {roles.map((role, index) => (
                  <option key={index} value={role.toLowerCase().replace(/\s+/g, '_')}>
                    {role}
                  </option>
                ))}
              </FormSelect>
            </div>
          ) : activeFilter === "Date" ? (
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
          ) : (
            <div className="col-span-12 ">
              <FormLabel htmlFor="role">Select Status</FormLabel>
              <FormSelect
                id="status"
                className=""
                onChange={(e) => {
                  const value = e.target.value;
                  setTempSelectedStatus(value); // Store the selected value temporarily
                }}
                value={tempSelectedStatus}
              >
                <option value="" selected disabled>
                  All Status
                </option>
                <option  value='active'>
                    Active
                  </option>
                  <option  value='inactive'>
                    Inactive
                  </option>
                
              </FormSelect>
            </div>
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
              activeFilter === "LGA"
                ? applyLGAFilter
                : activeFilter === "Role"
                ? applyCarParkFilter
                : activeFilter === "Date"
                ? applyDateFilter :
                applyStatusFilter
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
