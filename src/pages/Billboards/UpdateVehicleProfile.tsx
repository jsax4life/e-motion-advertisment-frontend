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
import RiderForm from "./FormSections/RiderForm";
import NOKForm from "./FormSections/NOKForm";
import OwnerForm from "./FormSections/OwnerForm";
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
  first_name: yup.string().required("First name is required"),
  middle_name: yup.string(),
  last_name: yup.string().required("Last name is required"),
  age: yup.number().positive().integer().required("Age is required"),
  lga: yup.string().required("LGA is required"),
  religion: yup.string().required("Religion is required"),
  //   phone: yup.string().required("Phone number is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  tribe: yup.string().required("Tribe is required"),
  parkzone: yup.string().required("Parkzone is required"),
  gender: yup.string().required("Gender is required"),
  home_address: yup.string().required("Home address is required"),
  nok_first_name: yup.string().required("NOK first name is required"),
  nok_last_name: yup.string().required("NOK last name is required"),
  nok_phone: yup.string().required("Phone number is required"),
  //   .matches(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  nok_relationship: yup.string().required("NOK relationship is required"),
  owner_first_name: yup.string().required("Owner first name is required"),
  owner_last_name: yup.string().required("Owner last name is required"),
  owner_phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{11}$/, "Owner number must be exactly 11 digits"),
  owner_home_address: yup.string().required("Owner address is required"),

  plate_number: yup.string().required('Plate Number is required'),
  vin: yup.string().required('VIN is required'),
  vehicle_type: yup.string().required('Vehicle type is required'),
  manufacturer: yup.string().required('Manufacturer is required'),
  vehicle_color: yup.string().required('Vehicle Color is required'),
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

export default function UpdateVehicleProfile() {
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

  const [vehicleDetails, setVehicleDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLga, setSelectedLga] = useState("");
  const navigate = useNavigate();
  const [date, setDate] = useState('');
const [errorMessage, setErrorMessage] = useState('');

  console.log(loading)

  useEffect(() => {
    if (user?.token) {
      fetchVehicleData();
    }
  }, [user?.token, id]);

  useEffect(() => {
    if (vehicleDetails) {
      // Set the form values when vehicle details are loaded
      const { rider, owner } = vehicleDetails;
      setValue("first_name", rider.first_name || "");
      setValue("middle_name", rider.middle_name || "");
      setValue("last_name", rider.last_name || "");
      setValue("age", rider.age || "");
      setValue("phone", rider.phone || "");
      setValue("home_address", rider.home_address || "");
      setValue("lga", rider.lga || "");
      setValue("tribe", rider.tribe || "");
      setValue("gender", rider.gender || "");
      setValue("religion", rider.religion || "");
      setValue("parkzone", rider.parkzone || "");

      setValue("nok_first_name", rider.next_of_kin.first_name || "");
      setValue("nok_last_name", rider.next_of_kin.last_name || "");
      setValue("nok_phone", rider.next_of_kin.phone || "");
      setValue("nok_home_address", rider.next_of_kin.home_address || "");
      setValue("nok_relationship", rider.next_of_kin.relationship || "");

      setValue("owner_first_name", rider.first_name || "");
      setValue("owner_last_name", rider.last_name || "");
      setValue("owner_phone", rider.phone || "");
      setValue("owner_home_address", rider.home_address || "");


      setValue("vehicle_type", vehicleDetails.vehicle_type || "");
      setValue("plate_number", vehicleDetails.plate_number || "");
      setValue("vin", vehicleDetails.vin || "");
      setValue("vehicle_color", vehicleDetails.vehicle_color || "");
      setValue("manufacturer", vehicleDetails.manufacturer || "");
      setValue("date", vehicleDetails.date || "");


    }
  }, [vehicleDetails, setValue]);

  const fetchVehicleData = () => {
    setError("");
    setLoading(true);

    API(
      "get",
      `vehicle-details/${id}`, // Ensure your backend API endpoint is correct
      {},
      function (vehicleData: any) {
        setVehicleDetails(vehicleData);
        setLoading(false);
        console.log(vehicleData);
      },
      function (error: any) {
        console.error("Error fetching vehicle data:", error);
        setLoading(false);
      },
      user?.token && user.token
    );
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

     // Conditionally create the vehicle_details object only if vehicleDetails.tagged is true
  const vehicleData = vehicleDetails?.tagged
  ? {
      vehicle_details: {
        vehicle_type: data.vehicle_type,
        plate_number: data.plate_number,
        vin: data.vin,
        vehicle_color: data.vehicle_color,
        manufacturer: data.manufacturer,
        date: date,
      },
    }
  : {};
 
    // Transform the data into a nested object
    const structuredData = {
      rider: {
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        lga: data.lga,
        religion: data.religion,
        phone: data.phone,
        tribe: data.tribe,
        middle_name: data.middle_name,
        parkzone: data.parkzone,
        home_address: data.home_address,
      },
      next_of_kin: {
        first_name: data.nok_first_name,
        last_name: data.nok_last_name,
        phone: data.nok_phone,
        home_address: data.nok_home_address,
        relationship: data.nok_relationship,
      },
      owner: {
        first_name: data.owner_first_name,
        last_name: data.owner_last_name,
        phone: data.owner_phone,
        home_address: data.owner_home_address,
      },

     

      ...vehicleData,
      
    };

    API(
      "put",
      `vehicle-profile-update/${id}`, // Ensure your backend API endpoint is correct
      { ...structuredData },
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
        console.error("Error fetching vehicle data:", error);
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
                  Edit Vehicle Details
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  {/* Rider Information */}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* start rider section */}
                    <div className="mt-5 intro-y text-slate-600">
                      <div className="flex items-center py-4 text-primary">
                        <h3 className="intro-y font-semibold mr-4 text-sm ">
                          RIDER DETAILS
                        </h3>
                        <hr className="flex-grow border-t border-primary/50" />
                      </div>

                      <div className="py-5 ">
                        <div className="grid grid-cols-12 gap-x-5">
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div>
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
                                {errors.first_name && (
                                  <p className="text-red-500">
                                    {errors.first_name.message?.toString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="mt-3">
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
                            </div>
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
                              {errors.lga && (
                                <p className="text-red-500">
                                  {errors.lga.message?.toString()}
                                </p>
                              )}
                            </div>

                            <div className="mt-3">
                              <FormLabel htmlFor="tribe">Tribe</FormLabel>
                              <FormSelect
                                id="tribe"
                                {...register("tribe")}
                                //   onChange={setSelect}
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
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="mt-3 xl:mt-0">
                              <FormLabel htmlFor="middle_name">
                                Middle Name
                              </FormLabel>

                              <FormInput
                                id="middle_name"
                                type="text"
                                placeholder="Middle Name"
                                {...register("middle_name")}
                                className=""
                              />
                              {errors.middle_name && (
                                <p className="text-red-500">
                                  {errors.middle_name.message?.toString()}
                                </p>
                              )}
                            </div>
                            <div className="mt-3">
                              <div className="mt-3">
                                <FormLabel htmlFor="phone">
                                  Phone Number
                                </FormLabel>

                                <FormInput
                                  id="phone"
                                  type="number"
                                  placeholder="0807********"
                                  {...register("phone")}
                                  className=""
                                  maxLength={11}
                                />
                                {errors.phone && (
                                  <p className="text-red-500">
                                    {errors.phone.message?.toString()}
                                  </p>
                                )}
                              </div>

                              <div className="mt-3">
                                <FormLabel htmlFor="update-profile-form-8">
                                  Park/Zone
                                </FormLabel>
                                <FormSelect
                                  id="parkzone"
                                  {...register("parkzone")}
                                >
                                  <option value="" disabled>
                                    --Park Zone--
                                  </option>
                                  <option value="zone1">Zone1</option>
                                  <option value="zone2">Zone2</option>
                                </FormSelect>

                                {errors.parkzone && (
                                  <p className="text-red-500">
                                    {errors.parkzone.message?.toString()}
                                  </p>
                                )}
                              </div>
                              <div className="mt-3">
                                <FormLabel htmlFor="home_address">
                                  Address
                                </FormLabel>
                                <FormInput
                                  {...register("home_address")}
                                  id="home_address"
                                  type="text"
                                  placeholder="Input text"
                                  // value="10 Anson Road, International Plaza, #10-11, 079903 Singapore, Singapore"
                                  onChange={() => {}}
                                />
                                {errors.home_address && (
                                  <p className="text-red-500">
                                    {errors.home_address.message?.toString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="mt-3 xl:mt-0">
                              <FormLabel htmlFor="update-profile-form-10">
                                Last Name
                              </FormLabel>

                              <FormInput
                                id="last_name"
                                type="text"
                                placeholder="Last Name"
                                {...register("last_name")}
                                className=""
                              />
                              {errors.last_name && (
                                <p className="text-red-500">
                                  {errors.last_name.message?.toString()}
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
                                value={vehicleDetails?.rider?.gender || ""}
                                onChange={(e) =>
                                  setValue("gender", e.target.value, {
                                    shouldValidate: true,
                                  })
                                }
                              >
                                <option value="" disabled>
                                  --Gender--
                                </option>
                                <option value="m">Male</option>
                                <option value="f">Female</option>
                              </FormSelect>

                              {errors.gender && (
                                <p className="text-red-500">
                                  {errors.gender.message?.toString()}
                                </p>
                              )}
                            </div>

                            <div className="mt-3">
                              <FormLabel htmlFor="gender">Religion</FormLabel>
                              <FormSelect
                                id="religion"
                                {...register("religion")}
                              >
                                <option value="" disabled>
                                  --Religon--
                                </option>
                                <option value="christian">Christian</option>
                                <option value="islam">Islam</option>
                                <option value="traditonal">Traditonal</option>
                                <option value="none">None</option>
                              </FormSelect>

                              {errors.parkzone && (
                                <p className="text-red-500">
                                  {errors.parkzone.message?.toString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end rider sectipn */}

                    {/* start Next Of Kin Section */}

                    <div className="mt-5 intro-y text-slate-600 ">
                      <div className="flex items-center py-4">
                        <h3 className="intro-y   font-semibold mr-4 text-sm text-primary">
                          NEXT OF KIN DETAILS
                        </h3>
                        <hr className="flex-grow border-t border-primary/50" />
                      </div>

                      <div className="py-5">
                        <div className="grid grid-cols-12 gap-x-5">
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div>
                              <FormLabel htmlFor="nok_first_name">
                                First Name *
                              </FormLabel>
                              <FormInput
                                id="nok_first_name"
                                type="text"
                                placeholder="First Name"
                                {...register("nok_first_name")}
                                //   value={rider?.nok_first_name}
                              />
                              {errors.nok_first_name && (
                                <p className="text-red-500">
                                  {errors.nok_first_name.message?.toString()}
                                </p>
                              )}
                            </div>
                            <div className="mt-3">
                              <FormLabel htmlFor="nok_phone">
                                Phone Number *
                              </FormLabel>
                              <FormInput
                                id="nok_phone"
                                type="number"
                                //   value={rider?.next_of_kin?.phone}
                                placeholder="0807********"
                                {...register("nok_phone")}
                              />
                              {errors.nok_phone && (
                                <p className="text-red-500">
                                  {errors.nok_phone.message?.toString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="mt-3 xl:mt-0">
                              <FormLabel htmlFor="nok_last_name">
                                Last Name *
                              </FormLabel>
                              <FormInput
                                id="nok_last_name"
                                type="text"
                                placeholder="Last Name"
                                {...register("nok_last_name")}
                                //   value={rider?.next_of_kin.last_name}
                              />
                              {errors.nok_last_name && (
                                <p className="text-red-500">
                                  {errors.nok_last_name.message?.toString()}
                                </p>
                              )}
                            </div>
                            <div className="mt-3">
                              <FormLabel htmlFor="nok_home_address">
                                Address
                              </FormLabel>
                              <textarea
                                id="nok_home_address"
                                placeholder="Home Address"
                                {...register("nok_home_address")}
                                // value={rider?.next_of_kin?.nok_home_address}
                                rows={4}
                                className="form-textarea w-full border-gray-300 rounded-lg"
                              />
                              {errors.nok_home_address && (
                                <p className="text-red-500">
                                  {errors.nok_home_address.message?.toString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="mt-3 xl:mt-0">
                              <FormLabel htmlFor="update-profile-form-8">
                                Relationship
                              </FormLabel>
                              <FormSelect
                                {...register("nok_relationship")}
                                id="update-profile-form-8"
                              >
                                <option value="">--Select--</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Wife">Wife</option>
                                <option value="Child">Child</option>
                                <option value="Siblin">Siblin</option>
                                <option value="Uncle">Uncle</option>
                                <option value="Aunty">Aunty</option>
                                <option value="Nephew">Nephew</option>
                                <option value="Cousin">Cousin</option>
                                <option value="Friend">Friend</option>
                              </FormSelect>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end Next Of Kin Section */}

                    {/* start Owner Of Kin Section */}

                    <div className="mt-5 intro-y text-slate-600 ">
                      <div className="flex items-center py-4">
                        <h3 className="intro-y   font-semibold mr-4 text-sm text-primary">
                          OWNER DETAILS
                        </h3>
                        <hr className="flex-grow border-t border-primary/50" />
                      </div>

                      <div className="py-5">
                        <div className="grid grid-cols-12 gap-x-5">
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div>
                              <FormLabel htmlFor="owner_first_name">
                                First Name *
                              </FormLabel>
                              <FormInput
                                id="owner_first_name"
                                type="text"
                                placeholder="First Name"
                                {...register("owner_first_name")}
                                //   value={ownerData?.owner_first_name}
                              />
                              {errors.owner_first_name && (
                                <p className="text-red-500">
                                  {errors.owner_first_name.message?.toString()}
                                </p>
                              )}
                            </div>

                            <div className="mt-3">
                              <FormLabel htmlFor="address">Address</FormLabel>
                              <textarea
                                id="owner_home_address"
                                placeholder="Home Address"
                                {...register("owner_home_address")}
                                // value={ownerData?.owner_home_address}
                                rows={4}
                                className="form-textarea w-full border-gray-300 rounded-lg"
                              />
                              {errors.owner_home_address && (
                                <p className="text-red-500">
                                  {errors.owner_home_address.message?.toString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="mt-3 xl:mt-0">
                              <FormLabel htmlFor="owner_last_name">
                                Last Name *
                              </FormLabel>
                              <FormInput
                                id="owner_last_name"
                                type="text"
                                placeholder="Last Name"
                                {...register("owner_last_name")}
                                //   value={ownerData?.owner_last_name}
                              />
                              {errors.owner_last_name && (
                                <p className="text-red-500">
                                  {errors.owner_last_name.message?.toString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="mt-3 xl:mt-0">
                              <FormLabel htmlFor="owner_phone">
                                Phone Number *
                              </FormLabel>
                              <FormInput
                                id="owner_phone"
                                type="number"
                                //   value={ownerData?.phone}
                                placeholder="0807********"
                                {...register("owner_phone")}
                              />
                              {errors.owner_phone && (
                                <p className="text-red-500">
                                  {errors.owner_phone.message?.toString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end Next Of Kin Section */}

                    {/* Vehicle Secxtio */}

                    <div className="mt-5 intro-y text-slate-600 ">
                      <div className="flex items-center py-4">
                        <h3 className="intro-y  font-semibold mr-4 text-sm text-primary">
                          VEHICLE DETAILS
                        </h3>
                        <hr className="flex-grow border-t border-primary/50" />
                      </div>

                      <div className="py-5">
                        <div className="grid grid-cols-12 gap-x-5">
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div>
                              <FormLabel htmlFor="owner_first_name">
                                Vehicle Type
                              </FormLabel>
                              <select
                                defaultValue=""
                                id="vehicle_type"
                                {...register("vehicle_type")}
                                className="bg-gray-50 border border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                              >
                                <option value="trycycle">
                                  Trycycle (keke)
                                </option>
                              </select>
                              {errors.vehicle_type && (
                                <p className="text-red-500">
                                  {errors.vehicle_type.message?.toString()}
                                </p>
                              )}
                            </div>

                            <div className="mt-3">
                              <FormLabel htmlFor="address">
                                Vehicle Color
                              </FormLabel>
                              <select
                                defaultValue=""
                                id="vehicle_color"
                                {...register("vehicle_color")}
                                className="bg-gray-50 border border-gray-300 text-gray-900 lg:mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                              >
                                <option value="">--Vehicle Color--</option>
                                <option value="yellow">Yellow</option>
                                <option value="red">Red</option>
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="black">Black</option>
                                <option value="white">White</option>
                              </select>
                              {errors.vehicle_color && (
                                <p className="text-red-500">
                                  {errors.vehicle_color.message?.toString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="mt-3 xl:mt-0">
                              <FormLabel htmlFor="owner_last_name">
                                Plate Number
                              </FormLabel>
                              <FormInput
                                id="plate_number"
                                type="text"
                                placeholder="Plate Number"
                                {...register("plate_number")}
                                className=""
                              />
                              {errors.plate_number && (
                                <p className="text-red-500">
                                  {errors.plate_number.message?.toString()}
                                </p>
                              )}
                            </div>

                            <div className="mt-3">
                            <FormLabel htmlFor="modal-datepicker-1">Year of Purchase</FormLabel>
            <Litepicker
              className=""
              value={date}
              onChange={setDate}
              id="modal-datepicker-1"
              options={{
                autoApply: true,
                showWeekNumbers: true,
                dropdowns: {
                  minYear: 1990,
                  maxYear: null,
                  months: true,
                  years: true,
                  
                },
              }}
            />
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <div className="mt-3 xl:mt-0">
                              <FormLabel htmlFor="owner_phone">VIN</FormLabel>
                              <FormInput
                                id="vin"
                                type="text"
                                placeholder="Vehicle Identification Number"
                                {...register("vin")}
                                className=""
                              />
                              {errors.vin && (
                                <p className="text-red-500">
                                  {errors.vin.message?.toString()}
                                </p>
                              )}
                            </div>

                            <div className="mt-3 ">
                              <FormLabel htmlFor="owner_phone">Manufacturer</FormLabel>
                              <select defaultValue="" id="manufacturer" {...register('manufacturer')} className="bg-gray-50 border border-gray-300 text-gray-900 lg:mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ">
              <option value="">--Manufacturer--</option>
              <option value="Bajaj">Bajaj</option>
              <option value="⁠TVS">⁠TVS</option>
              <option value="⁠Innoson">⁠Innoson</option>
              <option value="⁠Others">⁠Others</option>

            </select>
            {errors.manufacturer && <p className="text-red-500">{errors.manufacturer.message?.toString()}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* end vehicle section */}

                    <div className="flex justify-end mt-4">
                      <Button
                        type="submit"
                        className="btn-primary"
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
                          "Update Profile"
                        )}
                      </Button>
                    </div>
                  </form>


                <Notification
              id="success-notification-content"
              className="flex"
            >
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
            <Notification
              id="failed-notification-content"
              className="flex"
            >
              <Lucide icon="XCircle" className="text-danger" />
              <div className="ml-4 mr-4">
                <div className="font-medium">Update Failed!</div>
                <div className="mt-1 text-slate-500">
                  {errorMessage}
                </div>
              </div>
            </Notification>
                </div>
              </div>
            </div>
          </div>
       
    </>
  );
}
