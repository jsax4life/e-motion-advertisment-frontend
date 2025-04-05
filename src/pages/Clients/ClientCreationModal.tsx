import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog } from "../../base-components/Headless";
import { FormInput, FormLabel, FormSelect, FormTextarea } from "../../base-components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import Litepicker from "../../base-components/Litepicker";


interface BillboardCreationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface StateData {
  name: string;
  lgas: string[];
}

const BillboardCreationModal: React.FC<BillboardCreationModalProps> = ({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const [states, setStates] = useState<StateData[]>([]);
  const [lgas, setLGA] = useState<string[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  

const convertImagesToBase64 = (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      })
    );
  };


//   console.log(uploadedImages);

  const validationSchema = yup.object().shape({
    company_name: yup.string().required("Company Name is required"), 
    company_email: yup.string().email("Invalid email format"),
    company_phone: yup.string().required("Company Phone Number is required"), 
    contact_person_name: yup.string().required("Contact Person Name is required"),
    contact_person_email: yup.string().email("Invalid email format"),
    contact_person_phone: yup.string().required("Contact Person Phone Number is required"),
    client_type: yup.string().required("Client Type is required"),
    state: yup.string().required("State is required"),
    lga: yup.string().required("LGA is required"),
    company_address: yup.string().required("Company Address is required"),
    // birthday: yup.string().required("Birthday is required"),
    brand_industry: yup.string().required("Brand Industry is required"),

      
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    company_phone: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
    client_type: "", 
    state: "",
    lga: "",
    company_address: "Static",
    birthday: "",
    brand_industry: "",
   
  });

     // Fetch states and LGAs from API
     useEffect(() => {
      const fetchStates = async () => {
        try {
          const response = await fetch("https://nigerian-states-and-lga.vercel.app/");
          const data: StateData[] = await response.json();
          setStates(data);
        } catch (error) {
          console.error("Failed to fetch states and LGAs:", error);
        }
      };
      fetchStates();
    }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "pricePerDay") {
      const pricePerDay = parseFloat(value);
      const pricePerMonth = pricePerDay * 30; // Assuming 30 days in a month

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        pricePerMonth: pricePerMonth.toFixed(2), // Round to 2 decimal places
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const files = Array.from(e.target.files).slice(0, 10); // Limit to 10 files
  //     setFormData((prev) => ({ ...prev, images: files }));
  //   }
  // };

   // Handle state selection
   const handleStateChange = (stateName: string) => {
    const selectedState = states.find((state) => state.name === stateName);
    setLGA(selectedState?.lgas || []);
    setValue("state", stateName, { shouldValidate: true });
    setValue("lga", "", { shouldValidate: true }); // Reset LGA selection
  };

  const handleAddBillboard = async  (data: any) => {

       // Prepare the payload
   console.log(data);

    // console.log(payload);
    onSubmit(data);
    // onClose();
  };


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
          <Dialog.Title className="border-slate-200 ">
            <div className="flex justify-center items-center lg:text-xl font-bold ">
              <div>Create New Client</div>
            </div>
          </Dialog.Title>

          <Dialog.Description className="grid grid-cols-12  gap-y-3 max-h-[90vh] overflow-y-auto ">
            <form onSubmit={ handleSubmit(handleAddBillboard)} className="col-span-12 rounded-lg w-full max-w-2xl  p-4 space-y-8 ">



          

          
             
             <div className="col-span-12">
              <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="internalCode ">Company Name</FormLabel>
              <FormInput
              formInputSize="lg"
                id="company_name"
                type="text"
                placeholder="Type here"
                {...register("company_name")}
              />
              {errors.company_name && (
                <p className="text-red-500">
                  {errors.company_name.message?.toString()}
                </p>
              )}
            </div>

              <div className="col-span-12">
                <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="company_email">Company Email (Optional)</FormLabel>
                <FormInput
                formInputSize="lg"
                  id="company_email"
                  type="email"
                  placeholder="Type here"
                  {...register("company_email")}
                />
                              {errors.company_email && ( <p className="text-red-500">{errors.company_email.message?.toString()}</p>)}

              </div>

            
              <div className="col-span-12">
                <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="company_phone">Company Phone Number (Optional)</FormLabel>
                <FormInput
                formInputSize="lg"
                  id="company_phone"
                  type="text"
                  placeholder="Type here"
                  {...register("company_phone")}
                />

                {errors.company_phone && ( <p className="text-red-500">{errors.company_phone.message?.toString()}</p>)}
              </div>


              {/* <div className="col-span-12">
                <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="phone">Lo</FormLabel>
                <FormInput
                formInputSize="lg"
                  id="phone"
                  type="text"
                  placeholder="Type here"
                  {...register("phone")}
                />
                {errors.phone && ( <p className="text-red-500">{errors.phone.message?.toString()}</p>)}
              </div> */}

              <div className="col-span-12">
                <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="contact_person_name">Contact Person Name</FormLabel>
                <FormInput
                formInputSize="lg"
                  id="contact_person_name"
                  type="text"
                  placeholder="Type here"
                  {...register("contact_person_name")}
                />
                {errors.contact_person_name && ( <p className="text-red-500">{errors.contact_person_name.message?.toString()}</p>)}
              </div>

              <div className="col-span-12">
                <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="contact_person_name">Contact Person Email</FormLabel>
                <FormInput
                formInputSize="lg"
                  id="contact_person_email"
                  type="email"
                  placeholder="Type here"
                  {...register("contact_person_email")}
                />
                {errors.contact_person_email && ( <p className="text-red-500">{errors.contact_person_email.message?.toString()}</p>)}
              </div>

              <div className="col-span-12">
                <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="contact_person_name">Contact Person Number</FormLabel>
                <FormInput
                formInputSize="lg"
                  id="contact_person_phone"
                  type="text"
                  placeholder="Type here"
                  {...register("contact_person_phone")}
                />
                {errors.contact_person_phone && ( <p className="text-red-500">{errors.contact_person_phone.message?.toString()}</p>)}
              </div>

              <div className="col-span-12 relative">
                <FormLabel className="lg:text-[16px]" htmlFor="dob">Date of Birth</FormLabel>
                <Litepicker
                  id="dob"
                  value={dateOfBirth}
                 
                  // onChange={setDateOfBirth}

                  onChange={(e:any) => {
                    const newValue = e;

                  
                    // Call your custom function
                    setDateOfBirth(newValue);                  
                    // Update state with validation
                    setValue("birthday", newValue, {
                      shouldValidate: true,
                    });
                  }}
                  
                  
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

              <div className="col-span-12">
                    <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="client_type">Client Type</FormLabel>
                    <FormSelect
                      id = "client_type"
                    formSelectSize="lg"
                     
                   {...register("client_type", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                    className="w-full"
                    >
                                          <option disabled value="">--Select--</option>

                    <option value="direct">Direct</option>
                    <option value="agency">Agency</option>
                    </FormSelect>
                    {errors.client_type && ( <p className="text-red-500">{errors.client_type.message?.toString()}</p>)}
                </div>

 


                <div className="col-span-12">
                <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="contact_person_name">Address</FormLabel>
                <FormTextarea
                formTextareaSize="lg"
                  id="company_address"

                  placeholder="Type here"
                  {...register("company_address")}
                />
                {errors.company_address && ( <p className="text-red-500">{errors.company_address.message?.toString()}</p>)}
              </div>
                {/* dimension */}

              
                    

              {/* specifications */}


     <div className=" col-span-12 flex space-x-4">

     <div className=" w-1/2 relative intro-y">
     <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="state">State</FormLabel>

        <FormSelect
          id="state"
          formSelectSize="lg"

          {...register("state", { required: "State of Origin is required" })}
          // className="bg-gray-50 px-2.5 pb-1 pt-5  text-sm   peer"
          onChange={(e) => handleStateChange(e.target.value)}
        >
          <option value="" disabled>
            --Select--
          </option>
          {states.map((state) => (
            <option key={state.name} value={state.name}>
              {state.name}
            </option>
          ))}
        </FormSelect>
      
        {errors?.state && (
          <p className="text-red-500">{errors.state.message?.toString()}</p>
        )}
      </div>


      {/* LGA of Origin */}
      <div className="w-1/2 relative intro-y">
      <FormLabel className="hidden md:block font-medium lg:text-[16px] text-black" htmlFor="lga">Local Government Area</FormLabel>
      <FormLabel className="md:hidden font-medium lg:text-[16px] text-black" htmlFor="lga">LGA</FormLabel>

        <FormSelect
          id="lga"
          formSelectSize="lg"

          {...register("lga", { required: "LGA is required" })}
          defaultValue=""
          onChange={(e) =>
            setValue("lga", e.target.value, {
              shouldValidate: true,
            })
          }
        >
          <option value="" disabled>
            --Select LGA--
          </option>
          {lgas.map((lga) => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
        </FormSelect>
       
        {errors?.lga && <p className="text-red-500">{errors.lga.message?.toString()}</p>}
      </div>

    
   </div>
             

        

   

              {/* brand_industry */}
                <div className="col-span-12">
                    <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="brand_industry">brand_industry</FormLabel>
                    <FormSelect
                    formSelectSize="lg"

                    // name="brand_industry"
                    value={formData.brand_industry}
                    {...register("brand_industry", {
                      onChange: (e) => {
                        handleChange(e);
                      },})}
                    
                    className="w-full "
                    >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="under_maintenance">Under Maintenance</option>
                    </FormSelect>
                    {errors.brand_industry && ( <p className="text-red-500">{errors.brand_industry.message?.toString()}</p>)}
                </div>

                <div className="flex space-x-2 lg:text-lg text-sm">
                <Button
              type="button"
              variant="outline-secondary"
              onClick={onClose}
              className="w-auto  border-red-500 text-red-500"
            >
              <Lucide icon="X" className="w-4 h-4 mr-1 " />
              <div  className=""> Cancel</div>
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
                            <div className=" text-xs text-center">Creating...</div>
                          </div>
                        ) : (
                          "Create"
                        )}
            </Button>
                </div>

            </form>
        
          </Dialog.Description>

          <Dialog.Footer className="text-right">
            {/* <Button
              type="button"
              variant="outline-secondary"
              onClick={onClose}
              className="w-20 mr-1 border-customColor text-customColor"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="button"
              className="lg:w-25 bg-customColor"
              ref={sendButtonRef}
              onClick={handleSubmit((data) => {
                onSubmit(data);
                onClose();
              })}
            >
              Apply Filter
            </Button> */}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default BillboardCreationModal;
