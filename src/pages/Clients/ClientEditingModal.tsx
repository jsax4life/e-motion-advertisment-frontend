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
import { formatCurrency } from "../../utils/utils";
import Litepicker from "../../base-components/Litepicker";
import { useFetchStates } from "../../lib/Hook";

interface BillboardCreationModalProps {
  isOpen: boolean;
  client: Client;

  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface Client {
  id: string;
  company_name: string,
  company_email: string,
  company_phone: string,
  contact_person_name: string,
  contact_person_email: string,
  contact_person_phone: string,
  client_type: string, 
  state: string,
  lga: string,
  company_address: string,
  birthday: string,
  brand_industry: string,
}

const BillboardEditingModal: React.FC<BillboardCreationModalProps> = ({
  isOpen,
  isLoading,
  client,
  onClose,
  onSubmit,
}) => {
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());
  const [updatedFields, setUpdatedFields] = useState({});

  const [formData, setFormData] = useState<any>(client);
  const { states, loading, error } = useFetchStates();
  const [lgas, setLGA] = useState<string[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState<string>(client?.birthday);


  const validationSchema = yup.object().shape({
    company_name: yup.string().required("Company Name is required"),
    company_email: yup.string().email("Invalid email address"),
    company_phone: yup.string().required("Company Phone Number is required"),
    contact_person_name: yup.string().required("Contact Person Name is required"),
    contact_person_email: yup.string().email("Invalid email address"),
    contact_person_phone: yup.string().required("Contact Person Phone Number is required"),
    client_type: yup.string().required("Client Type is required"),
    company_address: yup.string().required("Company Address is required"),
    birthday: yup.string().required("Date of Birth is required"),
    brand_industry: yup.string().required("Brand Industry is required"),
    state: yup.string().required("State is required"),
    lga: yup.string().required("LGA is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });
  // Watch for changes in the form
  const watchedData = watch();

  //   useEffect(() => {
  //     setFormData(watchedData); // Update local state on change
  //   }, [watchedData]);
  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(watchedData)) {
      // Function to get only the updated fields
     

      const getUpdatedFields = (original: any, updated: any): Partial<any> => {
        let changes: Partial<any> = {};
      
        Object.keys(updated).forEach((key) => {
          if (original[key] !== updated[key]) {
            changes[key] = updated[key]; // Store only changed fields
          }
        });
      
        return changes;
      };
      

      const changes = getUpdatedFields(
        client,
        watchedData as FormData
      );

      // Merge the new changes with the existing `updatedFields`
      setUpdatedFields(changes); // Store only changed fields


      setFormData(watchedData); // Update the formData state
    }
  }, [ watchedData]);



  console.log(client);
  

  const handleStateChange = (stateName: string) => {
    const selectedState = states.find((state) => state.name === stateName);
    setLGA(selectedState?.lgas || []);
    setValue("state", stateName, { shouldValidate: true });
    setValue("lga", "", { shouldValidate: true }); // Reset LGA selection
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setValue(name, value); // Ensure React Hook Form tracks this change

 
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [name]: value,
      }));



  };



  const handleEditClient = async (data: any) => {

   

    console.log(data);
    if (!updatedFields) {
      alert("No changes made");
    }

    console.log(updatedFields);
    onSubmit(updatedFields);
    // onClose();s
  };

  //   console.log(billboard);

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
          <Dialog.Title className="border-slate-200 ">
            <div className="flex justify-center items-center lg:text-xl font-bold ">
              <div>Edit Client</div>
            </div>
          </Dialog.Title>

          <Dialog.Description className="grid grid-cols-12  gap-y-3 max-h-[90vh] overflow-y-auto ">
            <form
              onSubmit={handleSubmit(handleEditClient)}
              className="col-span-12 rounded-lg w-full max-w-2xl  md:p-4 space-y-8 "
            >
              {/* image */}
              {/* <div className="col-span-12">
              <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="images">Images</FormLabel>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div> */}



              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="internalCode "
                >
                  Company Name
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="company_name"
                  defaultValue={client?.company_name}

                  type="text"
                  placeholder="Type here"
                  {...register("company_name", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.company_name && (
                  <p className="text-red-500">
                    {errors.company_name.message?.toString()}
                  </p>
                )}
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="company_email"
                >
                  Company Email (Optional)
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="company_email"
                  defaultValue={client?.company_email}

                  type="email"
                  placeholder="Type here"
                  {...register("company_email", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.company_email && (
                  <p className="text-red-500">
                    {errors.company_email.message?.toString()}
                  </p>
                )}
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="company_phone"
                >
                  Company Phone Number (Optional)
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="company_phone"
                  defaultValue={client?.company_phone}

                  type="text"
                  placeholder="Type here"
                  {...register("company_phone", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />

                {errors.company_phone && (
                  <p className="text-red-500">
                    {errors.company_phone.message?.toString()}
                  </p>
                )}
              </div>

            

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="contact_person_name"
                >
                  Contact Person Name
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="contact_person_name"
                  defaultValue={client?.contact_person_name}

                  type="text"
                  placeholder="Type here"
                  {...register("contact_person_name", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.contact_person_name && (
                  <p className="text-red-500">
                    {errors.contact_person_name.message?.toString()}
                  </p>
                )}
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="contact_person_name"
                >
                  Contact Person Email
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="contact_person_email"
                  defaultValue={client?.contact_person_email}
                  type="email"
                  placeholder="Type here"
                  {...register("contact_person_email", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.contact_person_email && (
                  <p className="text-red-500">
                    {errors.contact_person_email.message?.toString()}
                  </p>
                )}
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="contact_person_name"
                >
                  Contact Person Number
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="contact_person_phone"
                  defaultValue={client?.contact_person_phone}
                  type="text"
                  placeholder="Type here"
                  {...register("contact_person_phone", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.contact_person_phone && (
                  <p className="text-red-500">
                    {errors.contact_person_phone.message?.toString()}
                  </p>
                )}
              </div>

              <div className="col-span-12 relative">
                <FormLabel
                  className="lg:text-[16px]"
                  htmlFor="modal-datepicker-1"
                >
                  Date of Birth
                </FormLabel>
                <Litepicker
                  id="modal-datepicker-1"
                  value={dateOfBirth}
                  // onChange={setDateOfBirth}

                  onChange={(e: any) => {
                    console.log(e);
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
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="client_type"
                >
                  Client Type
                </FormLabel>
                <FormSelect
                  id="client_type"
                  defaultValue={client?.client_type}
                  formSelectSize="lg"
                  {...register("client_type", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full"
                >
                  <option disabled value="">
                    --Select--
                  </option>

                  <option value="Direct">Direct</option>
                  <option value="Agency">Agency</option>
                </FormSelect>
                {errors.client_type && (
                  <p className="text-red-500">
                    {errors.client_type.message?.toString()}
                  </p>
                )}
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="contact_person_name"
                >
                  Address
                </FormLabel>
                <FormTextarea
                  // formTextareaSize="md"
                  id="company_address"
                  defaultValue={client?.company_address}
                  placeholder="Type here"
                  {...register("company_address", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.company_address && (
                  <p className="text-red-500">
                    {errors.company_address.message?.toString()}
                  </p>
                )}
              </div>
              {/* dimension */}

              {/* specifications */}

              <div className=" col-span-12 flex space-x-4">
                <div className=" w-1/2 relative intro-y">
                  <FormLabel
                    className="font-medium lg:text-[16px] text-black"
                    htmlFor="state"
                  >
                    State
                  </FormLabel>

                  <FormSelect
                    id="state"
                    formSelectSize="lg"
                    defaultValue={client?.state}
                    {...register("state", {
                      onChange: (e) => {
                        handleChange(e);
                      },                    
                    })}
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
                    <p className="text-red-500">
                      {errors.state.message?.toString()}
                    </p>
                  )}
                </div>

                {/* LGA of Origin */}
                <div className="w-1/2 relative intro-y">
                  <FormLabel
                    className="hidden md:block font-medium lg:text-[16px] text-black"
                    htmlFor="lga"
                  >
                    Local Government Area
                  </FormLabel>
                  <FormLabel
                    className="md:hidden font-medium lg:text-[16px] text-black"
                    htmlFor="lga"
                  >
                    LGA
                  </FormLabel>

                  <FormSelect
                    id="lga"
                    formSelectSize="lg"
                    defaultValue={client?.lga}

                    {...register("lga", { 
                      onChange: (e) => {
                        handleChange(e);
                      },
                    })}
                    
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

                  {errors?.lga && (
                    <p className="text-red-500">
                      {errors.lga.message?.toString()}
                    </p>
                  )}
                </div>
              </div>

              {/* brand_industry */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="brand_industry"
                >
                  brand_industry
                </FormLabel>
                <FormSelect
                  formSelectSize="lg"
                  // name="brand_industry"
                  defaultValue={client?.brand_industry}

                  // value={formData.brand_industry}
                  {...register("brand_industry", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full "
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="under_maintenance">Under Maintenance</option>
                </FormSelect>
                {errors.brand_industry && (
                  <p className="text-red-500">
                    {errors.brand_industry.message?.toString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 lg:text-lg text-sm">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={onClose}
                  className="w-auto  border-red-500 text-red-500"
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

export default BillboardEditingModal;
