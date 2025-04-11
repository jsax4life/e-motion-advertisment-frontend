import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog } from "../../../../base-components/Headless";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../../base-components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../../../base-components/Button";
import Lucide from "../../../../base-components/Lucide";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import Litepicker from "../../../../base-components/Litepicker";
import { set } from "lodash";
import { freeze } from "@reduxjs/toolkit";
import { calculateNumberOfDays } from "../../../../utils/utils";

interface BillboardCreationModalProps {
  isOpen: boolean;
  campaign: any;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}



const ChangeDeliveryStatusModal: React.FC<BillboardCreationModalProps> = ({
  isOpen,
  isLoading,
  campaign,
  onClose,
  onSubmit,
}) => {
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());

  const [formData, setFormData] = useState<any>();
  const [freezeStartDate, setFreezeStartDate] = useState<any>();
  // const [freezeEndDate, setFreezeEndDate] = useState<any>();
const [numberOfDays, setNumberOfDays] = useState<any>();
const [isNumberOfDaysNegative, setIsNumberOfDaysNegative] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    status: yup.string().required("Status Code is required"),
    remarks: yup.string().required("Comment is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
   const calcNumberOfDays =  calculateNumberOfDays(freezeStartDate, campaign?.campaign_end_date);
    setNumberOfDays(calcNumberOfDays);
    calcNumberOfDays < 0 ? setIsNumberOfDaysNegative(true) : setIsNumberOfDaysNegative(false);
  
  } , [freezeStartDate, campaign?.campaign_end_date]);
  //   console.log(uploadedImages);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setValue(name, value); // Ensure React Hook Form tracks this change

    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
// check  if number of days is negative 
  // numberOfDays < 0 ? setIsNumberOfDaysNegative(true) : setIsNumberOfDaysNegative(false);

  const handleChangeStatus = async (data: any) => {
    // Prepare the payload
   const payload = {
      // Other form fields...
      ...data,
   
      campaign_freeze_start_date: freezeStartDate,
      // campaign_freeze_end_date: freezeEndDate,
      // end_date: data.end_date,
    };

    console.log(payload);

    // console.log(formData);
    onSubmit(payload);
    // onClose();
  };

    // console.log(campaign);

  //   console.log(formData);

  if (!isOpen) return null;

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        initialFocus={sendButtonRef}
        className="flex place-self-center lg:items-center lg:justify-center  "
        size="lg"
      >
        <Dialog.Panel className=" max-h-[95vh] overflow-y-auto ">
          <Dialog.Title>
            <div className="flex justify-center items-center">
              <div className="bg-customColor/20 fill-customColor text-customColor mr-4 rounded-2xl p-3">
                <Lucide icon="Home" className="w-10 h-10" />
              </div>
              <div className="text-2xl">
                <h2 className="mr-auto text-xl text-slate-800 font-bold">
                  Status Change
                </h2>
                <p className=" text-sm text-slate-500">
                  Choose a state to update
                </p>
              </div>
            </div>
          </Dialog.Title>

          <Dialog.Description className="grid grid-cols-12  gap-y-3 max-h-[90vh] overflow-y-auto ">
            <form
              onSubmit={handleSubmit(handleChangeStatus)}
              className="col-span-12 rounded-lg w-full max-w-2xl  md:p-4 space-y-8 "
            >
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="status"
                >
                  Status
                </FormLabel>
                <FormSelect
                  formSelectSize="lg"
                  // name="status"
                  defaultValue={campaign.status}
                  {...register("status", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full p-2 border rounded-lg py-3.5"
                >
                  <option value="end">End</option>
                  <option value="frozen">Freeze</option>
                  {/* <option value="paid">Paid</option>
                  <option value="delivered">Delivered</option> */}

                </FormSelect>
                {errors.status && (
                  <p className="text-red-500">
                    {errors.status.message?.toString()}
                  </p>
                )}
              </div>

              {/* set freezing duration (sstart and end) if uption is freeze */}
              {formData?.status === "frozen" && (
                <>
                  {/* <div className="col-span-12">
                    <FormLabel
                      className="font-medium lg:text-[16px] text-black"
                      htmlFor="start_date"
                    >
                      Start Date
                    </FormLabel>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg py-3.5"
                      {...register("start_date")}
                    />
                  </div>
                  <div className="col-span-12">
                    <FormLabel
                      className="font-medium lg:text-[16px] text-black"
                      htmlFor="end_date"
                    >
                      End Date
                    </FormLabel>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg py-3.5"
                      {...register("end_date")}
                    />
                  </div> */}
                   <div className="col-span-12   ">
                <div className="col-span-12  flex justify-center items-center lg:space-x-8 space-x-2">
                  <div className="w-full relative">
                    <FormLabel
                      className="text-xs font-medium lg:text-[16px] text-black"
                      htmlFor="duration"
                    >
                      Freeze  Date
                    </FormLabel>

                    <Litepicker
                      id="campaign-duration"
                      // value={`${orderToEdit?.campaign_start_date} - ${orderToEdit?.campaign_end_date}`}
                      // onChange={setDaterange}
                      value={freezeStartDate}
                      onChange={setFreezeStartDate}
                      options={{
                        autoApply: false,
                        showWeekNumbers: true,
                        dropdowns: {
                          minYear: new Date().getFullYear() , //set to current year
                          maxYear: null,
                          months: true,
                          years: true,
                        },
                      }}
                      className="block py-3 pl-8 mx-auto"


                                    // onChange={setDateOfBirth}

                  // onChange={(e:any) => {
                  //   const newValue = e;
                  //   // Call your custom function
                  //   setDateOfBirth(newValue);                  
                  //   setValue("birthday", newValue, {
                  //     shouldValidate: true,
                  //   });
                  // }}
                  
            
                    />
                    <div className="absolute flex items-center justify-center  bottom-4 left-2  text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="w-full relative">
                    <FormLabel
                      className="text-xs font-medium lg:text-[16px] text-black"
                      htmlFor="duration"
                    >
                      Campaign End Date 
                    </FormLabel>

                    <Litepicker
                      id="campaign-duration"
                      // value={`${orderToEdit?.campaign_start_date} - ${orderToEdit?.campaign_end_date}`}
                      // onChange={setDaterange}
                      value={campaign?.campaign_end_date}
                      disabled
                      onChange={(e:any) => {}}
                      options={{
                        autoApply: false,
                        showWeekNumbers: true,
                        dropdowns: {
                          minYear: new Date().getFullYear() , //set to current year
                          maxYear: null,
                          months: true,
                          years: true,
                          
                        },
                      }}
                      
                      className="block py-3 pl-8 mx-auto "
                    />
                    <div className="absolute flex items-center justify-center  bottom-4 left-2  text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                  </div>
                
                </div>
              </div>
              <div className="col-span-6 lg:w-1/2">
                    <FormLabel
                      className="font-medium text-xs lg:text-[16px] text-black"
                      htmlFor="duration"
                    >
                      Number of Days
                    </FormLabel>
                    <FormInput
                      formInputSize="lg"
                      type="text"
                      name="numberOfDays"
                      value={ `${numberOfDays} Days`}
                      readOnly
                      className="w-full text-sm  border rounded bg-gray-100 cursor-not-allowed"
                    />

                    
                    {isNumberOfDaysNegative && (
                <div className="col-span-12">
                  <p className="text-red-500">
                    Number of days cannot be negative
                  </p>  
                </div>
              )}
                  </div>
              {/* display error if number of days is negative */}
            
                </>
              )
              } 


              

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="remarks"
                >
                  Comment
                </FormLabel>
                <FormTextarea
                  formTextareaSize="lg"
                  id="remarks"
                  rows={5}
                  cols={5}
                  name="remarks"
                  onChange={handleChange}
                  placeholder="Add comment..."
                />
              </div>

              <div className="flex justify-end space-x-2 lg:text-lg text-sm">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={onClose}
                  className="w-auto  border-customColor text-customColor"
                >
                  <Lucide icon="X" className="w-4 h-4 mr-1 " />
                  <div className=""> Cancel</div>
                </Button>
                <Button
                  disabled={isLoading}
                  variant="primary"
                  type="submit"
                  className="w-auto bg-customColor"
                  ref={sendButtonRef}
                  // onClick={handleSubmit((data) => {
                  //   onSubmit(data);
                  //   onClose();
                  // })}
                >
                  <Lucide icon="Plus" className="w-4 h-4 mr-1 " />

                  {isLoading ? (
                    <div className="flex items-center space-x-2 justify-end">
                      <LoadingIcon
                        icon="spinning-circles"
                        className="w-6 h-6"
                      />
                      <div className=" text-xs text-center">Editing...</div>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Dialog.Description>

          <Dialog.Footer className="text-right">
        
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default ChangeDeliveryStatusModal;
