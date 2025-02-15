/* This example requires Tailwind CSS v2.0+ */
import { Fragment, Key, useContext, useEffect } from "react";
// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import _ from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import LoadingIcon from "../../../base-components/LoadingIcon";
import TomSelect from "../../../base-components/TomSelect";

interface RiderProps {
   riderData: any;
  }
// Define the validation schema
const validationSchema = yup.object().shape({
  // first_name: yup.string().required('First name is required'),
  religion: yup.string().required("Religiom is required"),
  parkzone: yup.string().required("Parkzone is required"),
  home_address: yup.string().required("Home address is required"),
  tribe: yup.string().required("tribe is required"),
  gender: yup.string().required("gender is required"),
  lga: yup.string().required("LGA is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  // profilePicture: yup.mixed().required('Profile picture is required'),
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

  const NOKForm:  React.FC<RiderProps> = ({riderData  }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { user } = useContext(UserContext);

  const { id } = useParams<{ id: string }>();
  //   const { id } = useParams<{ id: string }>();

  const [vehicleDetails, setVehicleDetails] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [select, setSelect] = useState("1");

  const navigate = useNavigate();





  return (
    <>
     

          
                  {/* riderData Information */}
                  <div className="mt-5 intro-y text-slate-600 ">
                    <div className="flex items-center py-4">
                      <h3 className="intro-y box  font-semibold mr-4 text-sm text-primary">
                        NEXT OF KIN DETAILS
                      </h3>
                      <hr className="flex-grow border-t border-primary/50" />
                    </div>

                    <div className="py-5">
                      <div className="grid grid-cols-12 gap-x-5">
                        <div className="col-span-12 md:col-span-6 lg:col-span-4">
                          <div>
                            <FormLabel htmlFor="first_name">
                              First Name *
                            </FormLabel>
                            <FormInput
                              id="first_name"
                              type="text"
                              placeholder="First Name"
                              {...register("first_name")}
                              value={riderData?.next_of_kin.first_name}
                            />
                            {errors.first_name && (
                              <p className="text-red-500">
                                {errors.first_name.message?.toString()}
                              </p>
                            )}
                          </div>
                          <div className="mt-3">
                            <FormLabel htmlFor="last_name">
                              Phone Number *
                            </FormLabel>
                            <FormInput
                              id="phone"
                              type="number"
                              value={riderData?.next_of_kin?.phone}
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
                          <div className="mt-3 xl:mt-0">
                            <FormLabel htmlFor="last_name">
                              Last Name *
                            </FormLabel>
                            <FormInput
                              id="last_name"
                              type="text"
                              placeholder="Last Name"
                              {...register("last_name")}
                              value={riderData?.next_of_kin.last_name}
                            />
                            {errors.last_name && (
                              <p className="text-red-500">
                                {errors.last_name.message?.toString()}
                              </p>
                            )}
                          </div>
                          <div className="mt-3">
                            <FormLabel htmlFor="address">Address</FormLabel>
                            <textarea
            id="home_address"
            placeholder="Home Address"
            {...register('home_address')}
            value={riderData?.next_of_kin?.home_address}
            rows={4}
            className="form-textarea w-full border-gray-300 rounded-lg"
          />
          {errors.home_address && <p className="text-red-500">{errors.home_address.message?.toString()}</p>}
                          </div>
                       
                        </div>
                        <div className="col-span-12 md:col-span-6 lg:col-span-4">
                          <div className="mt-3 xl:mt-0">
                            <FormLabel htmlFor="update-profile-form-8">
                              Relationship
                            </FormLabel>
                            <FormSelect id="update-profile-form-8">
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
                  {/* end ridwer info */}
       
    </>
  );
}

export default NOKForm;