import { Fragment, Key, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";

import Button from "../../base-components/Button";
import {
  FormInput,
  FormSelect,
  FormLabel,
  FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import LoadingIcon from "../../base-components/LoadingIcon";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import Litepicker from "../../base-components/Litepicker";
import Toastify from "toastify-js";
import Notification from "../../base-components/Notification";



const validationSchema = yup.object().shape({
  name: yup.string().required("name is required"),
  email: yup.string().required("email is required"),

  lga: yup.string().required("LGA is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  zone: yup.string().required("Zone is required"),
  gender: yup.string().required("Gender is required"),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  role: yup.string().required("role is required"),
  password: yup.string().required('Password is Required').min(6),

});

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

export default function AddNewUser() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
    watch
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { user } = useContext(UserContext);

  const { id } = useParams<{ id: string }>();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false); // New state for summary view
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPasswd = () => setShowPassword(!showPassword);


    // Watch form fields
    const formData = watch();

    const handleContinue = () => {
      setShowSummary(true);
    };

    
  console.log(loading);


 

  const onSubmit = async (data: any) => {
    
    setLoading(true);

  console.log(data)

    API(
      "post",
      `new-users`, 
      { ...data },
      function (responseData: any) {
        setShowSummary(false);

        console.log(responseData)
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
        console.log(error)
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

  
  };



  return (
    <>
      <div className="max-w-7xl mx-auto pb-12 lg:pb-0  lg:px-0">
        <div className="bg-white   px-5 py-6 sm:px-6 sm:py-4">

          <div className="flex items-center intro-y gap-x-2 border-b border-slate-300 pb-6">
            <Lucide icon="User" className="w-6 h-6 text-slate-500 " />
            <h2 className="mr-auto text-lg text-slate-500 font-medium">
              User Information
            </h2>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="  col-span-12 ">

            {!showSummary ? (


              <form  onSubmit={handleSubmit(handleContinue)} className=" ">
              <div className="mt-5 intro-y text-slate-600 border-b border-slate-200">
                

                  <div className="py-5 ">
                    <div className="grid grid-cols-12 gap-x-5">
                    
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                      

                        <div className="mt-3">
                          <FormLabel htmlFor="role">
                            Roles
                          </FormLabel>
                          <FormSelect
                            id="role"
                            {...register("role")}
                            className=""
                            // value={userRole}
                            onChange={(e) => 
                              setValue("role", e.target.value, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <option value="" selected disabled>
                              --Selects Role--
                            </option>
                            <option value="registration_officer">Registration Officer</option>
                            <option value="attachment_officer">Attachment Officer</option>
                            <option value="operation_officer">Operation Officer</option>

                          </FormSelect>

                          {errors.role && (
                            <p className="text-red-500">
                              {errors?.role?.message?.toString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 lg:mt-0 intro-y text-slate-600  border-b border-slate-200">
                  

                  <div className="py-5 ">
                    <div className="grid grid-cols-12 gap-x-5">
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="mt-3">
                          <FormLabel htmlFor="state">
                            State
                          </FormLabel>
                          <FormSelect id="state" {...register("state")}
                           onChange={(e) => 
                            setValue("state", e.target.value, {
                              shouldValidate: true,
                            })
                          }
                          >
                            <option value="" selected disabled>
                              --Select State--
                            </option>
                            <option value="lagos">Lagos</option>
                          </FormSelect>

                          {errors.state && (
                            <p className="text-red-500">
                              {errors.state.message?.toString()}
                            </p>
                          )}
                        </div>
                       
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="mt-3">
                          <FormLabel htmlFor="update-profile-form-12">
                            LGA
                          </FormLabel>

                          <select
                            id="lga"
                            {...register("lga")}
                            defaultValue=""
                            className="bg-gray-50 border border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="" disabled>
                              --Select LGA--
                            </option>
                            {lagosLGAs.map((lga, index) => (
                              <option key={index} value={lga}>
                                {lga}
                              </option>
                            ))}
                          </select>
                          {errors?.lga && (
                            <p className="text-red-500">
                              {errors?.lga?.message?.toString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="mt-3">
                          <FormLabel htmlFor="zone">
                            Park/Zone
                          </FormLabel>
                          <FormSelect id="zone" {...register("zone")}
                            onChange={(e) => 
                                setValue("zone", e.target.value, {
                                  shouldValidate: true,
                                })}
                          >
                            <option value="" selected disabled>
                              --Select Zone--
                            </option>
                            <option value="zone1">Zone1</option>
                            <option value="zone2">Zone2</option>
                          </FormSelect>

                          {errors.zone && (
                            <p className="text-red-500">
                              {errors.zone.message?.toString()}
                            </p>
                          )}
                        </div>

                      
                      </div>
                    </div>
                  </div>
                </div>
          

                <div className="mt-5 lg:mt-0 intro-y text-slate-600  border-b border-slate-200">
                 

                  <div className="py-5">
                    <div className="grid grid-cols-12 gap-x-5">
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div>
                          <FormLabel htmlFor="name">
                            Full Name 
                          </FormLabel>
                          <FormInput
                            id="name"
                            type="text"
                            placeholder="Full Name"
                            {...register("name")}
                            //   value={rider?.name}
                          />
                          {errors.name && (
                            <p className="text-red-500">
                              {errors?.name?.message?.toString()}
                            </p>
                          )}
                        </div>

                        <div className="mt-3">
                          <FormLabel htmlFor="update-profile-form-8">
                            Gender
                          </FormLabel>
                          <FormSelect
                            id="update-profile-form-8"
                            {...register("gender")}
                            className=""
                            onChange={(e) =>
                              setValue("gender", e.target.value, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <option value="" selected disabled>
                              --Gender--
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </FormSelect>

                          {errors.gender && (
                            <p className="text-red-500">
                              {errors?.gender?.message?.toString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                       
                        <div className="mt-3 lg:mt-0">
                          <FormLabel htmlFor="nok_phone">
                            Phone Number *
                          </FormLabel>
                          <FormInput
                            id="phone"
                            type="number"
                            placeholder="0807********"
                            {...register("phone")}
                          />
                          {errors.phone && (
                            <p className="text-red-500">
                              {errors.phone.message?.toString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="mt-3 lg:mt-0">
                          <FormLabel htmlFor="email">
                            Email *
                          </FormLabel>
                          <FormInput
                            id="email"
                            type="text"
                            placeholder="Email"
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-red-500">
                              {errors?.email?.message?.toString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              

                <div className="mt-5 lg:mt-0 intro-y text-slate-600  border-b border-slate-200">
        

                  <div className="py-5">
                    <div className="grid grid-cols-12 gap-x-5">
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                      <div className="mt-3 lg:mt-0">
                              <FormLabel htmlFor="address">
                                Address
                              </FormLabel>
                              <textarea
                                id="address"
                                placeholder=" Address"
                                {...register("address")}
                                // value={rider?.next_of_kin?.address}
                                rows={4}
                                className="form-textarea w-full border-gray-300 rounded-lg"
                              />
                              {errors.address && (
                                <p className="text-red-500">
                                  {errors.address.message?.toString()}
                                </p>
                              )}
                            </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="mt-3 xl:mt-0">
                          <FormLabel htmlFor="city">City</FormLabel>
                          <FormInput
                            id="city"
                            type="text"
                            placeholder="City"
                            {...register("city")}
                          />
                          {errors.city && (
                            <p className="text-red-500">
                              {errors.city.message?.toString()}
                            </p>
                          )}
                        </div>
                      </div>
                  
                    </div>
                  </div>
                </div>

               < div className="mt-5 lg:mt-0 intro-y text-slate-600  border-b border-slate-200">
        

                  <div className="py-5">
                    <div className="grid grid-cols-12 gap-x-5">
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div className="relative">
                          <FormLabel htmlFor="street">
                            Password
                          </FormLabel>
                          <FormInput
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
                      
                      
                    </div>
                  </div>
                </div>
                {/* end Next Of Kin Section */}

                <div className="flex justify-start mt-4">
                  <Button
                    type="submit"
                    className="bg-customColor text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2 justify-end">
                        <LoadingIcon
                          icon="spinning-circles"
                          className="w-6 h-6"
                        />
                        <div className=" text-xs text-center">Updating</div>
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </form>
            ) : (

                <>
                <div className="grid grid-cols-12 gap-4 lg:gap-6 text-slate-600">
                {/* BEGIN: Rider Details */}
                <div className="col-span-12 intro-y  ">
                  <div className=" flex justify-start items-center py-5 gap-x-6  border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400 text-md">
                    <div className=" lg:w-1/5 mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2 lg:space-y-4">
                      <div className="font-semibold ">Role:</div>
                      <div className="font-semibold ">State:</div>
                      <div className="font-semibold ">LGA:</div>
                      <div className="font-semibold ">Park/Zone:</div>

                    </div>
                    <div className=" mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2 lg:space-y-4 ">

                      <div className=" capitalize">
                        {formData?.role}
                      </div>

                      <div className="">{formData?.state}</div>
                      <div className="">{formData?.lga}</div>
                      <div className="">{formData?.zone}</div>

                    </div>
                  </div>
                </div>
           
                <div className="col-span-12 intro-y  text-md ">
                  
                  <div className=" flex justify-start items-center py-5 gap-x-6  border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                    <div className=" lg:w-1/5 flex flex-col no-wrap items-start  space-y-2 lg:space-y-4 mb-5 lg:mb-0 ">
                      <div className="font-semibold ">Name:</div>
                      <div className="font-semibold ">Gender:</div>
                      <div className="font-semibold ">Phone Number:</div>
                      <div className="font-semibold ">Email:</div>

                    </div>
                    <div className=" mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2 lg:space-y-4 ">
                      <div className="">
                        {formData?.name}
                      </div>

                      <div className="">
                        {formData?.gender}
                      </div>
                      <div className="">
                        {formData?.phone}
                      </div>
                      <div className="">
                        {formData?.email}
                      </div>
                    </div>
                  </div>
                </div>
            

                <div className="col-span-12 intro-y text-base ">
                 
                  <div className=" flex justify-start items-center py-5 gap-x-6  border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400 text-sm">
                    <div className=" lg:w-1/5 mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2 lg:space-y-4">
                      <div className="font-semibold ">
                        Address:
                      </div>
                      <div className="font-semibold ">
                        City:
                      </div>
                      <div className="font-semibold ">
                        State:
                      </div>
                      
                    </div>
                    <div className="  mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2 lg:space-y-4">
                      <div className="">{formData?.address}</div>

                      <div className="">{formData?.city}</div>
                      <div className="">{formData?.state}</div>

                    </div>
                  </div>
                </div>

                <div className="col-span-12 intro-y text-base ">
                 
                  <div className=" flex justify-start items-center py-5 gap-x-6  border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400 text-sm">
                    <div className="lg:w-1/5 mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2">
                      <div className="font-semibold ">
                        Password:
                      </div>
                      
                    </div>
                    <div className="  mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2">
                      <div className="">{formData?.password}</div>
                    </div>
                  </div>
                </div>
             
               

              </div>

<div className="flex justify-start mt-4 ">
<Button
  onClick={() => setShowSummary(false)}
  className=" bg-white  text-customColor w-auto"
>
  Edit Details
</Button>
<Button
  onClick={handleSubmit(onSubmit)}
  className="bg-customColor text-white ml-4 w-auto"
  disabled={loading}
>
  {loading ? (
    <div className="flex items-center space-x-2 justify-end">
      <LoadingIcon
        icon="spinning-circles"
        className="w-6 h-6"
      />
      <div className="text-xs text-center">Submitting</div>
    </div>
  ) : (
    "Create User"
  )}
</Button>
</div>
</>

            )}
              <Notification id="success-notification-content" className="flex">
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                  <div className="font-medium">Created Successful</div>
                  <div className="mt-1 text-slate-500">
                    User Created Successfully 
                  </div>
                </div>
              </Notification>
              {/* END: Success Notification Content */}
              {/* BEGIN: Failed Notification Content */}
              <Notification id="failed-notification-content" className="flex">
                <Lucide icon="XCircle" className="text-danger" />
                <div className="ml-4 mr-4">
                  <div className="font-medium"> Failed!</div>
                  <div className="mt-1 text-slate-500">{errorMessage}</div>
                </div>
              </Notification>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
