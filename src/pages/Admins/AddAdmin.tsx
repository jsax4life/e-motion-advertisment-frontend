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
  firstName: yup.string().required("first is required"),
  lastName: yup.string().required("last name is required"),

  email: yup.string().required("email is required"),

  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  gender: yup.string().required("Gender is required"),
  role: yup.string().required("role is required"),
  password: yup.string().required('Password is Required').min(6),

});



export default function AddNewAdmiin() {
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
      `register`, 
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
              Admin Information
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
                              --Select--
                            </option>
                            <option value="super_admin">Super Admin</option>
                            <option value="administrator">Administrator</option>
                            <option value="operation_manager">Operation Manager</option>
                            <option value="support_admin">Support Administrator</option>
                          


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
                 

                  <div className="py-5">
                    <div className="grid grid-cols-12 gap-x-5">
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                        <div>
                          <FormLabel htmlFor="firstName">
                            Full Name 
                          </FormLabel>
                          <FormInput
                            id="firstName"
                            type="text"
                            placeholder="First Name"
                            {...register("firstName")}
                            //   value={rider?.name}
                          />
                          {errors.firrst_name && (
                            <p className="text-red-500">
                              {errors?.firstName?.message?.toString()}
                            </p>
                          )}
                        </div>


                        <div className="mt-3 ">
                          <FormLabel htmlFor="phone">
                            Phone Number *
                          </FormLabel>
                          <FormInput
                            id="phone"
                            type="text"
                            placeholder="0807********"
                            {...register("phoneNumber")}
                            maxLength={11}
                          />
                          {errors?.phoneNumber && (
                            <p className="text-red-500">
                              {errors?.phoneNumber?.message?.toString()}
                            </p>
                          )}
                        </div>

                        
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                       
                      <div>
                          <FormLabel htmlFor="lastName">
                            Last Name 
                          </FormLabel>
                          <FormInput
                            id="lastName"
                            type="text"
                            placeholder="Last Name"
                            {...register("lastName")}
                            //   value={rider?.name}
                          />
                          {errors.firrst_name && (
                            <p className="text-red-500">
                              {errors?.lastName?.message?.toString()}
                            </p>
                          )}
                        </div>

                      

                        <div className="mt-3">
                          <FormLabel htmlFor="gender">
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
              

                {/* <div className="mt-5 lg:mt-0 intro-y text-slate-600  border-b border-slate-200">
        

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
                    
                  
                    </div>
                  </div>
                </div> */}

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
                    

                    </div>
                    <div className=" mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2 lg:space-y-4 ">

                      <div className=" capitalize">
                        {formData?.role}
                      </div>


                    </div>
                  </div>
                </div>
           
                <div className="col-span-12 intro-y  text-md ">
                  
                  <div className=" flex justify-start items-center py-5 gap-x-6  border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
                    <div className=" lg:w-1/5 flex flex-col no-wrap items-start  space-y-2 lg:space-y-4 mb-5 lg:mb-0 ">
                      <div className="font-semibold ">First Name:</div>
                      <div className="font-semibold ">Last Name:</div>

                      <div className="font-semibold ">Gender:</div>
                      <div className="font-semibold ">Phone Number:</div>
                      <div className="font-semibold ">Email:</div>

                    </div>
                    <div className=" mb-5 lg:mb-0 flex flex-col no-wrap items-start justify-start space-y-2 lg:space-y-4 ">
                      <div className="">
                        {formData?.firstName}
                      </div>
                      <div className="">
                        {formData?.lastName}
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
    "Create Admin"
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
                    Admin Created Successfully 
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
