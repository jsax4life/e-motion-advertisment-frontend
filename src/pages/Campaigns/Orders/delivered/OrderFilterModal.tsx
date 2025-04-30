import _ from "lodash";
import { useState, useRef, useEffect, useContext, Key } from "react";
import Button from "../../../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../../base-components/Form";
import Lucide from "../../../../base-components/Lucide";
import { Menu, Tab, Dialog } from "../../../../base-components/Headless";
import Litepicker from "../../../../base-components/Litepicker";

// Define props interface for the component
interface FilterModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  handleFilterChange: (type: string, value: string) => void;


  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  activeFilter: "Date" ;
  setActiveFilter: (filter: "Date") => void;
}

const OrderFilterModal: React.FC<FilterModalProps> = ({
  open,
  setOpen,
  handleFilterChange,
 

  startDate,
  setStartDate,
  endDate,
  setEndDate,
  activeFilter,

}) => {
  
  const [tempStartDate, setTempStartDate] = useState(startDate);

  const [tempEndDate, setTempEndDate] = useState(endDate);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  
  // Handle Date filter apply
  const applyDateFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    handleFilterChange("Date", `${tempStartDate} - ${tempEndDate}`);
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
      size="lg"
      >
      <Dialog.Panel className="">
        <Dialog.Title>
          <div className="flex justify-center items-center">
            <div className="bg-customColor/20 fill-customColor text-customColor mr-2 rounded-lg p-4">
              <Lucide
                icon="Calendar" 
                className="w-7 h-7"
              />
             
            </div>
            <div className="text-xl">
              <h2 className="mr-auto text-slate-600 font-bold">
              Date Range
              </h2>
              <p className="text-xs text-slate-500">
              Choose a date range to filter
              </p>
            </div>
          </div>
        </Dialog.Title>

        <Dialog.Description className="grid grid-cols-12 gap-x-4 gap-y-6">
        
            <>
              <div className="col-span-12 relative text-lg">
                <FormLabel htmlFor="modal-datepicker-1">Start Date</FormLabel>
                <Litepicker
                  id="modal-datepicker-1"
                  className="p-4"
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
                <div className="absolute flex items-center justify-center w-8 h-8 right-2 bottom-2 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                  <Lucide icon="Calendar" className="w-5 h-5" />
                </div>
              </div>
              <div className="col-span-12 relative text-lg">
                <FormLabel htmlFor="end-date">End Date</FormLabel>
                <Litepicker
                className="p-4"
                  id="end-date"
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
                <div className="absolute flex items-center justify-center w-8 h-8 right-2 bottom-2 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                  <Lucide icon="Calendar" className="w-5 h-5" />
                </div>
              </div>
            </>
    
        </Dialog.Description>

        <Dialog.Footer className="flex  mt-6 lg:text-lg">
          <div className="mr-auto">
          
          <Button
            type="button"
            className="lg:w-25 border border-customColor text-customColor"
            ref={sendButtonRef}
            onClick={
                applyDateFilter
            }
          >
            This Month
          </Button>
          </div>
          <div className="text-right">
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
                applyDateFilter
            }
          >
            This Month
          </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default OrderFilterModal;
