import { Fragment, Key, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import clsx from "clsx";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
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
import Tippy from "../../base-components/Tippy";
import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import LoadingIcon from "../../base-components/LoadingIcon";
import TomSelect from "../../base-components/TomSelect";

import Litepicker from "../../base-components/Litepicker";
import Toastify from "toastify-js";
import Notification from "../../base-components/Notification";

interface VehicleDetails {
  rider: {
    first_name: string;
    middle_name: string;
    last_name: string;
    age: number;
    lga: string;
    religion: string;
    phone: string;
    tribe: string;
    parkzone: string;
    gender: string;
    home_address: string;
  };
  nok: {
    first_name: string;
    last_name: string;
    phone: string;
    relationship: string;
  };
  owner: {
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
  };
}

// Define the validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required("name is required"),
  email: yup.string().required("email is required"),

  lga: yup.string().required("LGA is required"),
  //   phone: yup.string().required("Phone number is required"),
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
//   password: yup.string().min(6),

  // date: yup.string().required('Vehicle Date is required'),
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

export default function UpdateUserProfile() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { user } = useContext(UserContext);

  const { id } = useParams<{ id: string }>();

  const [userDetails, setUserDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLga, setSelectedLga] = useState("");
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const [userRole, setUserRole] = useState(userDetails?.role);
  console.log(loading);

  useEffect(() => {
    if (user?.token) {
      fetchUserData();
    }
  }, [user?.token, id]);

  useEffect(() => {
    if (userDetails) {
      const { attached_vehicles, registered_vehicles } = userDetails;
      setValue("name", userDetails?.name || "");
    //   setValue("last_name", userDetails?.last_name || "");
      setValue("phone", userDetails?.phone || "");
      setValue("address", userDetails?.address || "");
      setValue("lga", userDetails?.lga || "");
      setValue("gender", userDetails?.gender || "");
      setValue("email", userDetails?.email || "");
      setValue("zone", userDetails?.zone || "");
      setValue("city", userDetails?.city || "");
      setValue("role", userDetails?.role || "");
      setValue("state", userDetails?.state || "");
      setValue("zone", userDetails?.zone || "");

    }
  }, [userDetails, setValue]);

  const fetchUserData = () => {
    setError("");
    setLoading(true);

    API(
      "get",

      `users/${id}/profile`,
      {},

      // {lga: 'Alimosho'},
      function (userData: any) {
        console.log(userData?.data.user);
        setUserDetails(userData?.data?.user);
        setLoading(false);
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);
      },
      user?.token && user.token
    );
  };

  const onSubmit = async (data: any) => {
    
    setLoading(true);

    // Conditionally create the vehicle_details object only if vehicleDetails.tagged is true
   

    // Transform the data into a nested object
  console.log(data)

    API(
      "put",
      `update-users/${id}`, // Ensure your backend API endpoint is correct
      { ...data },
      function (responseData: any) {
        //   setVehicleDetails(vehicleData);
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

    //   console.log("Structured Data:", structuredData);
    // Send structuredData to the backend here

    // console.log( data);
    //   setLoading(true);
    // Call API to update vehicle details with form data
    //   await API("put", `vehicle-details/${id}`, data, null, null, user?.token);

    //   navigate("/vehicle-list");
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <LoadingIcon className="w-8 h-8" />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="max-w-7xl mx-auto pb-12 lg:pb-0  lg:px-0">
        <div className="bg-white   px-5 py-6 sm:px-6 sm:py-4">
          {/* Content Section */}

          <div className="flex items-center intro-y gap-x-2">
            <Lucide icon="User" className="w-6 h-6 text-slate-500 " />
            <h2 className="mr-auto text-lg text-slate-500 font-medium">
              User Information
            </h2>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="  col-span-12 ">
              {/* Rider Information */}

              <form onSubmit={handleSubmit(onSubmit)} className=" ">
              <div className="mt-5 intro-y text-slate-600 border-b border-slate-200">
                

                  <div className="py-5 ">
                    <div className="grid grid-cols-12 gap-x-5">
                    
                      <div className="col-span-12 md:col-span-6 lg:col-span-4">
                      

                        <div className="mt-3">
                          <FormLabel htmlFor="role">
                            Role
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
                            <option value="" disabled>
                              --Select--
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
                          <FormLabel htmlFor="update-profile-form-8">
                            State
                          </FormLabel>
                          <FormSelect id="state" {...register("state")}>
                            <option value="" disabled>
                              --Select--
                            </option>
                            <option value="state">Lagos</option>
                          </FormSelect>

                          {errors.state && (
                            <p className="text-red-500">
                              {errors.state.message?.toString()}
                            </p>
                          )}
                        </div>
                        {/* <div>
                              <FormLabel htmlFor="first_name">
                                First Name
                              </FormLabel>

                              <div className="intro-y">
                                <FormInput
                                  id="first_name"
                                  type="text"
                                  placeholder="First Name"
                                  // value={rider?.first_name}
                                  {...register("first_name")}
                                  className=""
                                />
                                {errors?.first_name && (
                                  <p className="text-red-500">
                                    {errors?.first_name?.message?.toString()}
                                  </p>
                                )}
                              </div>
                            </div> */}
                        {/* <div className="mt-3">
                              <FormLabel htmlFor="update-profile-form-7">
                                Age
                              </FormLabel>

                              <FormInput
                                id="age"
                                type="number"
                                placeholder="Age"
                                {...register("age")}
                                className=""
                                //   value={rider?.age}
                              />
                              {errors.age && (
                                <p className="text-red-500">
                                  {errors.age.message?.toString()}
                                </p>
                              )}
                            </div> */}

                        {/* <div className="mt-3">
                              <FormLabel htmlFor="tribe">Tribe</FormLabel>
                              <FormSelect
                                id="tribe"
                                {...register("tribe")}
                                className="bg-gray-50 border border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              >
                                <option value="" disabled>
                                  --Tribe--
                                </option>
                                <option value="Yoruba">Yoruba</option>
                                <option value="Hausa">Hausa</option>
                                <option value="Igbo">Igbo</option>
                                <option value="⁠Awori">⁠Awori</option>
                                <option value="⁠Ijebu">⁠Ijebu</option>
                                <option value="⁠Egun">⁠Egun</option>
                                <option value="⁠Nupe">⁠Nupe</option>
                                <option value="⁠Fulani">⁠Fulani</option>
                                <option value="⁠Others">⁠Others</option>
                              </FormSelect>
                              {errors.tribe && (
                                <p className="text-red-500">
                                  {errors.tribe.message?.toString()}
                                </p>
                              )}
                            </div> */}
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
                          <FormLabel htmlFor="update-profile-form-8">
                            Park/Zone
                          </FormLabel>
                          <FormSelect id="zone" {...register("zone")}>
                            <option value="" disabled>
                              --Park Zone--
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
                            value={userDetails?.gender || ""}
                            onChange={(e) =>
                              setValue("gender", e.target.value, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <option value="" disabled>
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
                        {/* <div className="mt-3 xl:mt-0">
                          <FormLabel htmlFor="nok_last_name">
                            Last Name *
                          </FormLabel>
                          <FormInput
                            id="nok_last_name"
                            type="text"
                            placeholder="Last Name"
                            {...register("nok_last_name")}
                          />
                          {errors.nok_last_name && (
                            <p className="text-red-500">
                              {errors.nok_last_name.message?.toString()}
                            </p>
                          )}
                        </div> */}
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
                        <div>
                          <FormLabel htmlFor="street">
                            Street
                          </FormLabel>
                          <FormInput
                            id="street"
                            type="text"
                            placeholder="First Name"
                            {...register("street")}
                            //   value={ownerData?.street}
                          />
                          {errors.street && (
                            <p className="text-red-500">
                              {errors.street.message?.toString()}
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
                        <div>
                          <FormLabel htmlFor="street">
                            Password
                          </FormLabel>
                          <FormInput
                            id="password"
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                            //   value={ownerData?.password}
                          />
                          {errors.password && (
                            <p className="text-red-500">
                              {errors.password.message?.toString()}
                            </p>
                          )}
                        </div>
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
                      "Update Information"
                    )}
                  </Button>
                </div>
              </form>

              <Notification id="success-notification-content" className="flex">
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                  <div className="font-medium">Update Successful</div>
                  <div className="mt-1 text-slate-500">
                    Profile Successfully Updated
                  </div>
                </div>
              </Notification>
              {/* END: Success Notification Content */}
              {/* BEGIN: Failed Notification Content */}
              <Notification id="failed-notification-content" className="flex">
                <Lucide icon="XCircle" className="text-danger" />
                <div className="ml-4 mr-4">
                  <div className="font-medium">Update Failed!</div>
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
