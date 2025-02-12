import { Fragment, Key, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import clsx from "clsx";
import Button from "../../../base-components/Button";
import Pagination from "../../../base-components/Pagination";
import {
  FormInput,
  FormSelect,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Tippy from "../../../base-components/Tippy";
import { UserContext } from "../../../stores/UserContext";
import API from "../../../utils/API";
import LoadingIcon from "../../../base-components/LoadingIcon";
import TomSelect from "../../../base-components/TomSelect";
import Litepicker from "../../../base-components/Litepicker";
import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";
import ChangePassword from "./ChangePassword";


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

export default function UpdateAdminsProfile() {
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

 
  };

 

  return (
    <>
      

          <div className="max-w-7xl mx-auto pb-12 lg:pb-0  ">
            <div className="bg-white   px-5 lg:px-0 py-6 sm:px-6 sm:py-4">

           
<ChangePassword/>
             
            </div>
          </div>
       
    </>
  );
}
