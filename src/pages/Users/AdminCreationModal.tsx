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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import ImageUploadSection from "./ImageUpoadSection";


interface AdminCreationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface StateData {
  name: string;
  lgas: string[];
}

const roles = [
  { name: "Admin", value: "admin" },
  { name: "Client", value: "client" },
  { name: "Agency", value: "agency" },
  { name: "Super Admin", value: "super_admin" },
  { name: "CTO", value: "cto"},
  { name: "Account Manager", value: "account_manager" },
  { name: "CEO", value: "ceo" },
  { name: "Finance", value: "finance" },

]

const AdminCreationModal: React.FC<AdminCreationModalProps> = ({
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
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPasswd = () => setShowPassword(!showPassword);

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
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    address: yup.string().required("Address is required"),
    gender: yup.string().required("gender is required"),
    password: yup.string().required("Password is required"),
    role: yup.string().required("Role is required"),
    dob: yup.string().required("Birthday is required"),
    // images: yup.array().of(yup.string()).required("Images are required"),

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
    name: "",
    firstName: "",
    lastName: "",
    role: [],
    date_created: "",
    active: "",
    profilePicture: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob:"",
    industry: "",
    created_at: "",
   
  });



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

 
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    
  };
  


  const handleAddUser = async  (data: any) => {
    const base64Images = await convertImagesToBase64(uploadedImages);

       // Prepare the payload
    const payload = {
      ...data,
      profileImage: base64Images[0] || "", // Use the first image as the profile picture
    };
   
// console.log("Form Data:", payload);
    // console.log(base64Images);
    onSubmit(payload);
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
              <div>Create New User</div>
            </div>
          </Dialog.Title>

          <Dialog.Description   className=" g max-h-[90vh] overflow-y-auto ">
            <form onSubmit={ handleSubmit(handleAddUser)} className=" grid grid-cols-12 items-center lg:gap-x-4 rounded-lg w-full max-w-2xl  md:p-4 gap-y-8 ">


            <ImageUploadSection
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
              />

              <div className="lg:col-span-6 col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="fist_name "
                >
                  First Name
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="firstName"

                  type="text"
                  placeholder="Type here"
                  {...register("firstName", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-500">
                    {errors.firstName.message?.toString()}
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

        
              <div className=" col-span-12">
                    <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="client_type">Role</FormLabel>
                    <FormSelect
                      id = "role"
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
                        <option key={index} value={role.value}>
                          {role.name}
                        </option>
                      ))}

                    </FormSelect>
                    {errors.role && ( <p className="text-red-500">{errors.role.message?.toString()}</p>)}
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
                  type="email"
                  placeholder="Type here"
                  {...register("email", {
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

              <div className="lg:col-span-6 col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="phoneNumber"
                >
                 Phone Number
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="phoneNumber"
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

                  <option value="male">Male</option>
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
                    setValue("dob", newValue, {
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
                  htmlFor="addres"
                >
                  Address
                </FormLabel>
                <FormTextarea
                  // formTextareaSize="md"
                  id="address"
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
          

            
                      <div className="col-span-12 ">
                        <div className="relative">
                          <FormLabel htmlFor="street">
                            Password
                          </FormLabel>
                          <FormInput
                            formInputSize="lg"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...register("password")}
                            //   value={ownerData?.password}
                          />
                        

<div
                        className="absolute bottom-2  right-0 pr-3 flex items-center cursor-pointer"
                        onClick={toggleShowPasswd}
                      >
                        {showPassword ? (
                          <EyeSlashIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <EyeIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                     
                        </div>
                        {errors.password && (
                            <p className="text-red-500">
                              {errors.password.message?.toString()}
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

export default AdminCreationModal;
