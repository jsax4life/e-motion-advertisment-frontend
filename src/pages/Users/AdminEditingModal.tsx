import React, { useEffect, useContext, useState } from "react";
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
import API from "../../utils/API";
import { UserContext } from "../../stores/UserContext";

interface BillboardCreationModalProps {
  isOpen: boolean;
  admin: Admin;

  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}
type Role = {
  id: number;
  name: string;
};

interface Admin {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  role: [{'name': string}];
  date_created: string;
  active: any;
  profile_image_url: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob:string;
  industry: string;
  password: string;
  address: string;
  created_at: string;

}


// const roles = [
//   { name: "Admin", value: "admin" },
//   { name: "Client", value: "client" },
//   { name: "Agency", value: "agency" },
//   { name: "Super Admin", value: "super_admin" },
//   { name: "CTO", value: "cto"},
//   { name: "Account Manager", value: "account_manager" },
//   { name: "CEO", value: "ceo" },
//   { name: "Finance", value: "finance" },

// ]

const BillboardEditingModal: React.FC<BillboardCreationModalProps> = ({
  isOpen,
  isLoading,
  admin,
  onClose,
  onSubmit,
}) => {
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());
  const [updatedFields, setUpdatedFields] = useState({});
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState<any>(admin);
  const { states, loading, error } = useFetchStates();
  const [lgas, setLGA] = useState<string[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState<string>(admin?.dob);
  const [roles, setRoles] = useState<Role[]>([]);

  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const validationSchema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_number: yup.string().required("Phone number is required"),
    address: yup.string().required("Address is required"),
    role: yup.string().required("Role is required"),
    status: yup.string().required("Status is required"),
    password: yup.string().required("Password is required"),
    
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
        admin,
        watchedData as FormData
      );

      // Merge the new changes with the existing `updatedFields`
      setUpdatedFields(changes); // Store only changed fields


      setFormData(watchedData); // Update the formData state
    }
  }, [ watchedData]);


  useEffect(() => {
    fetchRole(); // Will also initialize rolePrivileges
  }, []);

  const fetchRole = () => {
    setIsLoadingRoles(true);

    API(
      "get",
      "get-roles",
      {},
      (response: any) => {
        // Build Role objects directly from the API
        const fetchedRoles: Role[] = response.map((r: any) => ({
          id: r.id,
          name: r.name,
        }));

        setRoles(fetchedRoles);
       
        setIsLoadingRoles(false);
      },
      (error: any) => {
        console.error("Error fetching roles:", error);
        setIsLoadingRoles(false);
      },
      user?.token
    );
  };

  console.log(admin);
  

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
              <div>Edit Admin</div>
            </div>
          </Dialog.Title>

          <Dialog.Description className="g max-h-[90vh] overflow-y-auto ">
            <form
              onSubmit={handleSubmit(handleEditClient)}
              className=" grid grid-cols-12 items-center lg:space-x-4 rounded-lg w-full max-w-2xl  md:p-4 gap-y-8 "
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



              <div className="lg:col-span-6 col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="internalCode "
                >
                  First Name
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="lastName"
                  defaultValue={admin?.firstName}

                  type="text"
                  placeholder="Type here"
                  {...register("lastName", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500">
                    {errors.lastName.message?.toString()}
                  </p>
                )}
              </div>

              <div className="lg:col-span-6 col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="lastName"
                >
                 Last Name
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="lastName"
                  defaultValue={admin?.lastName}

                  type="email"
                  placeholder="Type here"
                  {...register("lastName", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500">
                    {errors.lastName.message?.toString()}
                  </p>
                )}
              </div>

              {/* <div className="lg:col-span-6 col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="role"
                >
                  Role
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="role"
                  defaultValue={admin?.name}

                  type="text"
                  placeholder="Type here"
                  {...register("role", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />

                {errors.role && (
                  <p className="text-red-500">
                    {errors.role.message?.toString()}
                  </p>
                )}
              </div> */}

              <div className=" lg:col-span-6 col-span-12">
                    <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="client_type">Role</FormLabel>
                    <FormSelect
                      id = "role"
                      defaultValue={admin.name}
                    formSelectSize="lg"
                     
                   {...register("role", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                    className="w-full"
                    >
                                          <option disabled value="">--Select--</option>

                      {roles.map((role, index) => (
                        <option key={index} value={role.name}>
                          {role.name}
                        </option>
                      ))}

                    </FormSelect>
                    {errors.role && ( <p className="text-red-500">{errors.role.message?.toString()}</p>)}
                </div>
            

              <div className="lg:col-span-6 col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="status"
                >
                  status
                </FormLabel>
                <FormSelect
                  formSelectSize="lg"
                  // name="status"
                  defaultValue={admin?.name}

                  // value={formData.status}
                  {...register("status", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full "
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
                {errors.status && (
                  <p className="text-red-500">
                    {errors.status.message?.toString()}
                  </p>
                )}
              </div>

              <div className="lg:col-span-6 col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="email"
                >
                  Email
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="email"
                  defaultValue={admin?.email}
                  type="email"
                  placeholder="Type here"
                  {...register("email", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500">
                    {errors.email.message?.toString()}
                  </p>
                )}
              </div>

              <div className="lg:col-span-6 col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="phone_number"
                >
                 Phone Number
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="phoneNumber"
                  defaultValue={admin?.phoneNumber}
                  type="text"
                  placeholder="Type here"
                  {...register("phoneNumber", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500">
                    {errors.phoneNumber.message?.toString()}
                  </p>
                )}
              </div>

              <div className="lg:col-span-6 col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="gender"
                >
                  Gender
                </FormLabel>
                <FormSelect
                  id="gender"
                  defaultValue={admin?.gender}
                  formSelectSize="lg"
                  {...register("gender", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full"
                >
                  <option disabled value="">
                    --Select--
                  </option>

                  <option value="malr">Male</option>
                  <option value="female">Female</option>
                </FormSelect>
                {errors.gender && (
                  <p className="text-red-500">
                    {errors.gender.message?.toString()}
                  </p>
                )}
              </div>


              <div className="lg:col-span-6 col-span-12 relative">
                <FormLabel
                  className="lg:text-[16px]"
                  htmlFor="dob"
                >
                  Date of Birth
                </FormLabel>
                <Litepicker
                  id="dob"
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
                  htmlFor="address"
                >
                  Address
                </FormLabel>
                <FormTextarea
                  // formTextareaSize="md"
                  id="address"
                  defaultValue={admin?.address}
                  placeholder="Type here"
                  {...register("address", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.address && (
                  <p className="text-red-500">
                    {errors.address.message?.toString()}
                  </p>
                )}
              </div>
          

              <div className=" col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="password"
                >
                 Password
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="password"
                  defaultValue={admin?.password}

                  type="password"
                  placeholder="Type here"
                  {...register("password", {
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
