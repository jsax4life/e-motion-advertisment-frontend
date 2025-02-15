/* This example requires Tailwind CSS v2.0+ */
import {
  Fragment,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
} from "react";

// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import _ from "lodash";
import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image";

import { Dialog, Menu, Tab } from "../../base-components/Headless";

import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import Tippy from "../../base-components/Tippy";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { formatDate } from "../../utils/utils";
import logo from "../../assets/images/logo.png";
import logoBig from "../../assets/images/Lagos-Seal.png";

const tagStyle = [
  "bg-orange-100 text-orange-600",
  "bg-green-100 text-green-600",
];

type UserRoleKey =
  | "registration_officer"
  | "attachment_officer"
  | "operation_officer";


  interface Activity {
    id: any;
    user_id: number;
    user_role: UserRoleKey;
    vehicle_id: number;
    action: string;
    type: string;
    details: string | null;
    created_at: string;
    user: {
      id: any;
      name: string;
      email: string;
      phone: string;
      role: string;
      lga: string;
    };
  }

  interface ActivityLogProps {
  logs: Activity[];
}

interface ActivityItem {
  user_role: UserRoleKey;
  // other fields...
}

const userRole: Record<UserRoleKey, any> = {
  registration_officer: "Registration Officer",
  attachment_officer: "Attachment Officer",
  operation_officer: "Operation Officer",
};

const activityItem: ActivityItem = {
  user_role: "registration_officer",
  // other fields...
};

type DisplaySectionProps = {
  title: string;
  data: Record<string, any>;
  keys: {
    label: string;
    valueKey: string;
    formatter?: (value: any) => string; // For formatting values
    render?: (value: any) => React.ReactNode; // For custom rendering
  }[];
};

// const activity = [
//     {
//       id: 1,
//       type: 'assignment',
//       person: { name: 'Eduardo Benz', href: '#' },
//       // imageUrl:
//       //   'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
//       comment:
//         'Lorem ipsum dolor sit amet, ',
//       date: '6d ago',
//     },
//     {
//       id: 2,
//       type: 'assignment',
//       person: { name: 'Hilary Mahy', href: '#' },
//       assigned: { name: 'Kristin Watson', href: '#' },
//       date: '2d ago',
//     },
//     {
//       id: 3,
//       type: 'tags',
//       person: { name: 'Hilary Mahy', href: '#' },
//       tags: [
//         { name: 'Bug', href: '#', color: 'bg-rose-500' },
//         { name: 'Accessibility', href: '#', color: 'bg-indigo-500' },
//       ],
//       date: '6h ago',
//     },
//     {
//       id: 4,
//       type: 'assignment',
//       person: { name: 'Jason Meyers', href: '#' },
//       // imageUrl:
//       //   'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
//       comment:
//         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
//       date: '2h ago',
//     },
//   ]

const DisplaySection: React.FC<DisplaySectionProps> = ({ title, data, keys }) => (
  <div className="col-span-12 intro-y text-md">
    {title && (
      <div className="flex items-center py-4">
        <h3 className="intro-y font-semibold mr-4 text-md text-primary uppercase">{title}</h3>
        <hr className="flex-grow border-t border-slate-200/" />
      </div>
    )}
    <div className="flex justify-start items-center py-5 gap-x-6 sm:py-3 dark:border-darkmode-400">
      <div className="flex flex-col no-wrap items-start space-y-3 mb-2">
        {keys.map(({ label }) => (
          <div key={label} className="font-semibold">
            {label}
          </div>
        ))}
      </div>
      {/* <div className="flex flex-col no-wrap items-start space-y-3 mb-2">
        {keys.map(({ valueKey, formatter }) => (
          <div key={valueKey} className="capitalize">
            {formatter ? formatter(data[valueKey]) : data[valueKey] || "---"}
          </div>
        ))}
      </div> */}
      <div className="flex flex-col no-wrap items-start space-y-3 mb-2">
        {keys.map(({ valueKey, formatter, render }) => {
          const value = data[valueKey];
          return (
            <div key={valueKey} className="capitalize">
              {render ? render(value) : formatter ? formatter(value) : value || "---"}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default function ProfileDetails() {
  const { user } = useContext(UserContext);

  const { id } = useParams<{ id: string }>();
  const [vehicleDetails, setVehicleDetails] = useState<any>(null);
  const [surveyResponse, setSurveyResponse] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const isInitialMount = useRef(true);

  const navigate = useNavigate();

  const driverTagRef = useRef<HTMLDivElement>(null);

  const bodyTagRef = useRef<HTMLDivElement>(null);


  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for modal visibility
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [isBodyTagModalOpen, setIsBodyTagModalOpen] = useState(false);

  // Function to toggle the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  console.log(vehicleDetails);

  useEffect(() => {
    if (user?.token) {
      fetchVehicleData();
      fetchRiderSurveyResponseData();
    }
  }, [user?.token]);

  const { rider, owner, user_activity_logs, images } = vehicleDetails ?? {};

  // const user_activity_logs: any[] =[];

  console.log(user_activity_logs);
  console.log(`rider: ${rider}`);


  const fetchVehicleData = () => {
    setError("");

    API(
      "get",

      `vehicle-details/${id}`, // Make sure your backend API endpoint is correct
      {},

      // {lga: 'Alimosho'},
      function (vehicleData: any) {
        setVehicleDetails(vehicleData);
        setLoading(false);
        // console.log(vehicleData)
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);
        setShowErrorModal(true);
        setError(error);
      },
      user?.token && user.token
    );
  };


  const fetchRiderSurveyResponseData = () => {
    setError("");

    API(
      "get",

      `survey-response/${id}`, // Make sure your backend API endpoint is correct
      {},

      // {lga: 'Alimosho'},
      function (surveyResponseData: any) {
        setSurveyResponse(surveyResponseData?.responses);
        console.log(surveyResponseData)
        setLoading(false);
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        // setShowErrorModal(true);
        // setError(error)
        setLoading(false);
      },
      user?.token && user.token
    );
  };

  console.log(surveyResponse)

 

  // console.log(vehicleDetails)

  const handleRiderDownload = () => {
    // console.log("Download button clicked"); // Log when the button is clicked

    if (driverTagRef.current) {
      // console.log("driverTagRef is not null"); // Log if the ref is valid

      // Directly call htmlToImage.toPng without the Promise check
      htmlToImage
        .toJpeg(driverTagRef.current)
        .then((dataUrl) => {
          // console.log("Conversion successful, preparing to download"); // Log if conversion is successful

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${rider?.first_name}_Driver_Tag.jpeg`; // Customize the download file name
          link.click();
        })
        .catch((error) => {
          console.error("Oops, something went wrong!", error); // Log if there's an error
        });
    } else {
      console.error("Driver tag reference is null"); // Log if ref is null
    }
  };


  // Function to parse and display activity details
const renderDetails = (details: string) => {
  try {
    const parsedDetails = JSON.parse(details);

    return Object.keys(parsedDetails).map((section) => (
      <div key={section} className="mb-2">
        <strong className="text-blue-600">{section.toUpperCase()}</strong>
        <ul className="ml-4 list-disc text-sm">
          {Object.entries(parsedDetails[section]).map(([field, values]) => (
            <li key={field}>
              <span className="font-medium">{field}:</span>{" "}
              <span className="text-red-500 line-through">{(values as any).old}</span> →
              <span className="text-green-600"> {(values as any).new}</span>
            </li>
          ))}
        </ul>
      </div>
    ));
  } catch (error) {
    return <p className="text-red-500">Error parsing details.</p>;
  }
};

  // Function to handle preview
  const handleRiderPreview = () => {
    setIsRiderModalOpen(true);
  };

  // Function to close modal
  const closeRiderModal = () => {
    setIsRiderModalOpen(false);
  };

  // Function to handle preview
  const handleBodyTagPreview = () => {
    setIsBodyTagModalOpen(true);
  };

    // Function to handle body tag download
  const handleBodyTagDownload = () => {
    console.log("Download button clicked"); // Log when the button is clicked

    if (bodyTagRef.current) {
      console.log("driverTagRef is not null"); // Log if the ref is valid

      // Directly call htmlToImage.toPng without the Promise check
      htmlToImage
        .toJpeg(bodyTagRef.current)
        .then((dataUrl) => {
          console.log("Conversion successful, preparing to download"); // Log if conversion is successful

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${rider?.first_name}_Body_Tag.jpeg`; // Customize the download file name
          link.click();
        })
        .catch((error) => {
          console.error("Oops, something went wrong!", error); // Log if there's an error
        });
    } else {
      console.error("Driver tag reference is null"); // Log if ref is null
    }
  };

  // Function to close modal
  const closeBodyTagModal = () => {
    setIsBodyTagModalOpen(false);
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const getDisplayValue = (value: any) => {
    return value || "---";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* <div className="bg-gradient-to-r from-primary via-purple-800 to-primary pb-32">
          <header className="py-5"></header>
        </div> */}

      {isRiderModalOpen && (
        <Dialog
          open={isRiderModalOpen}
          onClose={closeRiderModal}
          className="lg:flex place-self-center lg:items-center lg:justify-center hidden  "
          size="cs"
        >
          <Dialog.Panel className="border rounded-3xl">
            {/* <Dialog.Title>
    <div className="flex justify-center items-center">
      <div className="bg-customColor/20 fill-customColor text-customColor mr-2 rounded-lg p-2">
      
       
      </div>
    
    </div>
  </Dialog.Title> */}

            <Dialog.Description className="grid  p-2 ">
              <div  className=" col-span-12 w-full flex flex-col gap-y-4 ">
                <div
                  
                  className=""
                >
                  <div className="flex leading-[2.15rem] w-full text-white text-xl bg-green-700  font-bold items-center justify-center gap-x-8 py-4 border rounded-xl">
                    <div>
                      <img
                        className="w-20 h-20    sm:block"
                        alt="lagos logo"
                        src={logoBig}
                      />
                    </div>

                    <div className="text-center">
                      <h3 className="uppercase text-2xl tracking-widest">
                        LAGOS STATE GOVERNMENT
                      </h3>
                      <p className="uppercase font-normal text-lg  tracking-widest dark:text-slate-500 ">
                        ministry of transportation
                      </p>
                    </div>
                  </div>

                  <div className="flex mt-6 w-full items-start leading-relaxed  text-white/70 dark:text-slate-500 gap-x-4 ">
                    <div className=" border rounded-xl">
                      <img
                        className="  h-44 w-40 rounded-xl "
                        alt="lagos logo"
                        src={rider?.profile_picture_base64}
                      />
                    </div>

                    <div className="flex-col  text-xs">
                      <div className="mb-2 text-slate-700 text-xs">
                        <span className="capitalize text-sm text-slate-700 dark:text-slate-500 mr-2">
                          Name:
                        </span>
                        <span className="mb-2 text-slate-600 text-sm font-bold">
                          {rider?.first_name} {rider?.middle_name}{" "}
                          {rider?.last_name}
                        </span>
                      </div>
                      <div className="mb-2 text-slate-700 text-xs">
                        <span className="capitalize text-sm text-slate-700 dark:text-slate-500 mr-2">
                          License Number:
                        </span>
                        <span className="text-slate-600 text-sm font-bold">
                          {rider?.ndl ? rider?.ndl : "nill"}
                        </span>
                      </div>
                      <div className="mb-2 text-slate-700 text-xs">
                        <span className="capitalize text-sm text-slate-700 dark:text-slate-500 mr-2">
                          LASDRI Number:
                        </span>
                        <span className="text-slate-600 text-sm font-bold">
                          {rider?.lasdri ? rider?.lasdri : "nill"}
                        </span>
                      </div>
                      <div className=" flex gap-x-6 items-end mt-5 ">
                        <img
                          alt="QRCode"
                          className=" w-20 h-20"
                          src={vehicleDetails?.qr_code_base64}
                        />
                        <div className="uppercase text-white px-6  text-xl bg-green-700">
                          conductor's badge
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Description>
          </Dialog.Panel>
        </Dialog>
      )}

      {isBodyTagModalOpen && (
        <Dialog
          open={isBodyTagModalOpen}
          onClose={closeBodyTagModal}
          className="lg:flex place-self-center lg:items-center lg:justify-center hidden  "
          size="cs"
        >
          <Dialog.Panel className="border ">
            {/* <Dialog.Title>
    <div className="flex justify-center items-center">
      <div className="bg-customColor/20 fill-customColor text-customColor mr-2 rounded-lg p-2">
      
       
      </div>
    
    </div>
  </Dialog.Title> */}

            <Dialog.Description  className="flex  gap-x-12  justify-center col-span-12 py-8 bg-slate-50 items-center ">
                  <div className="p-1   w-1/2 bg-slate-100">
                  <div className="  col-span-12 flex flex-col box items-center justify-start px-6  py-2 space-y-2 ">
                    <h3 className="uppercase text-red-600 font-bold text-md ">
                      lekki - epe route
                    </h3>
                    <div>
                      <img alt="logo" className=" w-20 h-20" src={logoBig} />
                    </div>
                    <h3 className="uppercase  font-bold text-lg ">
                      {vehicleDetails?.plate_number}
                    </h3>
                    <div className="text-white uppercase bg-blue-500 w-full text-center px-8 text-2xl font-semibold">
                      {vehicleDetails?.plate_number}
                    </div>

                    <p className="uppercase   text-xs">exp date dec 2024 </p>
                  </div>
                  </div>
                  
                    <div className="justify-center gap-x-2 items-center text-slate-800 text-xs border border-black">
                     <div className="flex items-center border-b border-black">
                     <div className="border-r border-black p-1">
                        <img alt="logo" className=" w-12 h-12" src={logo} />
                      </div>
                      <div>
                        <h3 className="uppercase  tracking-wider text-lg px-4 ">
                          {vehicleDetails?.plate_number}
                        </h3>
                      </div>
                     </div>

                      <div className="p-2">
                        <img
                          alt="QRCode"
                          className=" w-28 h-28 mx-auto"
                          src={vehicleDetails?.qr_code_base64}
                        />
                      </div>
                    </div>
                  
            </Dialog.Description>
          </Dialog.Panel>
        </Dialog>
      )}

      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onClose={toggleModal}
          className="flex place-self-center lg:items-center lg:justify-center"
        >
          <Dialog.Panel className="">
            {/* <Dialog.Title>
    <div className="flex justify-center items-center">
      <div className="bg-customColor/20 fill-customColor text-customColor mr-2 rounded-lg p-2">
      
       
      </div>
    
    </div>
  </Dialog.Title> */}

            <Dialog.Description className="grid grid-cols-12 gap-y-3 p-0">
              <div className="col-span-12 ">
                <img
                  src={owner?.profile_picture_base64}
                  alt="Owner"
                  className=" max-h-96 w-full"
                />
              </div>
            </Dialog.Description>
          </Dialog.Panel>
        </Dialog>
      )}

      {showErrorModal && (
        <Dialog
          staticBackdrop
          open={showErrorModal}
          onClose={() => {
            setShowErrorModal(true);
          }}
        >
          <Dialog.Panel>
            <div className="p-5 text-center">
              <Lucide
                icon="XCircle"
                className="w-16 h-16 mx-auto mt-3 text-warning"
              />
              <div className="mt-5 text-3xl">Oops...</div>
              <div className="mt-2 text-slate-500">{error}!</div>
            </div>
            <div className="px-5 pb-8 text-center">
              <Button
                type="button"
                variant="primary"
                className="bg-customColor"
                onClick={() => {
                  setShowErrorModal(false);
                  navigate("/dashboard");
                }}
              >
                Ok
              </Button>
            </div>
            {/* <div className="p-5 text-center border-t border-slate-200/60 dark:border-darkmode-400">
    <a href="" className="text-primary">
      Why do I have this issue?
    </a>
  </div> */}
          </Dialog.Panel>
        </Dialog>
      )}




{/* downloadble */}

<div className="  p-2  hidden">
              <div className=" col-span-12 w-full flex flex-col gap-y-4 ">
                <div
                  
                  className=""
                >
                  <div className="flex leading-[2.15rem] w-full text-white text-xl bg-green-700  font-bold items-center justify-center gap-x-8 py-4 border rounded-xl">
                    <div>
                      <img
                        className="w-20 h-20    sm:block"
                        alt="lagos logo"
                        src={logoBig}
                      />
                    </div>

                    <div className="text-center">
                      <h3 className="uppercase text-2xl tracking-widest">
                        LAGOS STATE GOVERNMENT
                      </h3>
                      <p className="uppercase font-normal text-lg  tracking-widest dark:text-slate-500 ">
                        ministry of transportation
                      </p>
                    </div>
                  </div>

                  <div className="flex mt-6 w-full items-start leading-relaxed  text-white/70 dark:text-slate-500 gap-x-4 ">
                    <div className=" border rounded-xl">
                      <img
                        className="  h-44 w-40 rounded-xl "
                        alt="lagos logo"
                        src={rider?.profile_picture_base64}
                      />
                    </div>

                    <div className="flex-col  text-xs">
                      <div className="mb-2 text-slate-700 text-xs">
                        <span className="capitalize text-sm text-slate-700 dark:text-slate-500 mr-2">
                          Name:
                        </span>
                        <span className="mb-2 text-slate-600 text-sm font-bold">
                          {rider?.first_name} {rider?.middle_name}{" "}
                          {rider?.last_name}
                        </span>
                      </div>
                      <div className="mb-2 text-slate-700 text-xs">
                        <span className="capitalize text-sm text-slate-700 dark:text-slate-500 mr-2">
                          License Number:
                        </span>
                        <span className="text-slate-600 text-sm font-bold">
                          {rider?.ndl ? rider?.ndl : "nill"}
                        </span>
                      </div>
                      <div className="mb-2 text-slate-700 text-xs">
                        <span className="capitalize text-sm text-slate-700 dark:text-slate-500 mr-2">
                          LASDRI Number:
                        </span>
                        <span className="text-slate-600 text-sm font-bold">
                          {rider?.lasdri ? rider?.lasdri : "nill"}
                        </span>
                      </div>
                      <div className=" flex gap-x-6 items-end mt-5 ">
                        <img
                          alt="QRCode"
                          className=" w-20 h-20"
                          src={vehicleDetails?.qr_code_base64}
                        />
                        <div className="uppercase text-white px-6  text-xl bg-green-700">
                          conductor's badge
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            


{/* end */}

      <div className=" mx-auto pb-12 lg:pb-0  lg:px-0 ">
        {/* Replace with your content */}

        <div className="bg-white   px-2 py-6 sm:px-6 sm:py-2">
          {/* content */}

          <Tab.Group>
            {/* BEGIN: Profile Info */}
            <div className=" pt-5 lg:pt-2  intro-y ">
              <div className="flex flex-col pb-5 -mx-5  lg:flex-row border-slate-200/60 dark:border-darkmode-400">
                <div className="flex justify-center items-center lg:hidden mb-4">
                  <Button
                    variant="primary"
                    className="mr-2 shadow-sm px-2 bg-customColor"
                    onClick={() => {
                      navigate(`/update-profile/${id}`);
                    }}
                  >
                    Edit
                  </Button>

                  <Button variant="secondary" className="mr-2 shadow-sm">
                    <Lucide icon="Download" className="w-4 h-4 mr-2" /> Export
                    As Excel Document
                  </Button>
                </div>
                <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
                  <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-36 lg:h-36 image-fit">
                    <img
                      alt="Profile pix"
                      className="rounded-xl"
                      src={rider?.profile_picture_base64}
                    />
                    <button
                      className="bg-customColor w-full h-4 absolute bottom-0 cursor-pointer rounded-b-xl flex justify-center align-center"
                      onClick={toggleModal}
                    >
                      <Lucide
                        icon="Eye"
                        className="w-4 h-4 mr-2 "
                        color="white"
                      />
                    </button>
                  </div>
                  <div className="ml-5 mr-auto">
                    <div
                      className={`w-1/2 text-center px-2 lg:py-1 py-0.5 mb-2 rounded-full text-xs font-medium capitalize ${
                        tagStyle[vehicleDetails?.tagged]
                      }`}
                    >
                      {vehicleDetails?.tagged ? "tagged" : "Registered"}
                    </div>
                    <div className="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
                      {rider?.first_name} {rider?.last_name}
                    </div>
                    <div className="text-slate-500">
                      <span className={`font-semibold text-md capitalize `}>
                        {" "}
                        accreditation:
                      </span>{" "}
                      <span
                        className={`uppercase ${
                          vehicleDetails?.verification_status
                            ? "text-green-600"
                            : "text-danger"
                        }`}
                      >
                        {vehicleDetails?.verification_status
                          ? "approved"
                          : "decline"}
                      </span>
                    </div>
                  </div>
                  <div className="lg:flex hidden ">
                    <Button
                      variant="primary"
                      className="mr-2  px-4 bg-customColor"
                      onClick={() => {
                        navigate(`/update-profile/${id}`);
                      }}
                    >
                      Edit
                    </Button>

                    <Button variant="secondary" className="mr-2 shadow-sm">
                      <Lucide icon="Download" className="w-4 h-4 mr-2" /> Export
                      As Excel Document
                    </Button>
                  </div>
                </div>
              </div>
              <Tab.List
                variant="link-tabs"
                className="flex-col justify-center text-center sm:flex-row lg:justify-start border-b  border-slate-200/60"
              >
                <Tab fullWidth={false}>
                  <Tab.Button className="flex items-center cursor-pointer ">
                    {/* <Lucide icon="User" className="w-4 h-4 mr-2" />  */}
                    Driver Overview
                  </Tab.Button>
                </Tab>
                <Tab fullWidth={false}>
                  <Tab.Button className="flex items-center  cursor-pointer">
                    {/* <Lucide icon="Shield" className="w-4 h-4 mr-2" /> */}
                    Vehicle Details
                  </Tab.Button>
                </Tab>
                <Tab fullWidth={false}>
                  <Tab.Button className="flex items-center  cursor-pointer">
                    {/* <Lucide icon="Shield" className="w-4 h-4 mr-2" /> */}
                    Owner Details
                  </Tab.Button>
                </Tab>
                <Tab fullWidth={false}>
                  <Tab.Button className="flex items-center  cursor-pointer">
                    {/* <Lucide icon="Shield" className="w-4 h-4 mr-2" /> */}
                    Vehicle Tags
                  </Tab.Button>
                </Tab>
                <Tab fullWidth={false}>
                  <Tab.Button className="flex items-center  cursor-pointer">
                    {/* <Lucide icon="Lock" className="w-4 h-4 mr-2" />  */}
                    Vehicle Activity
                  </Tab.Button>
                </Tab>
                <Tab fullWidth={false}>
                  <Tab.Button className="flex items-center  cursor-pointer">
                    {/* <Lucide icon="Lock" className="w-4 h-4 mr-2" />  */}
                    Survey Feedback
                  </Tab.Button>
                </Tab>
              </Tab.List>
            </div>
            {/* END: Profile Info */}
            <Tab.Panels className="mt-5">
 


              <Tab.Panel>
              <div className="grid grid-cols-12 text-slate-600">
                {/* Rider Details */}
                <DisplaySection
                  title="Rider Details"
                  data={rider || {}}
                  keys={[
                    { label: "NIN", valueKey: "nin" },
                    { label: "Phone Number", valueKey: "phone" },
                    { label: "Email Address", valueKey: "email" },
                    { label: "Home Address", valueKey: "home_address" },
                    { label: "Gender", valueKey: "gender", formatter: (value) => (value === "f" ? "Female" : "Male") },
                    { label: "Blood Group", valueKey: "blood_group" },
                    { label: "Marital Status", valueKey: "marital_status" },
                    { label: "Blood Group", valueKey: "blood_group" },
                    { label: "No. of Children", valueKey: "number_of_children" },
                    { label: "State of Origin", valueKey: "state_of_origin" },
                    { label: "LGA of Origin", valueKey: "lga_of_origin" },
                    { label: "Town/Village", valueKey: "town" },
                    { label: "Place of Birth", valueKey: "place_of_birth" },
                    { label: "Tribe", valueKey: "tribe" },
                    { label: "Age", valueKey: "age" },
                    { label: "Religion", valueKey: "religion" },
                    { label: "LGA of Operation", valueKey: "lga" },
                    { label: "LASDRI Card Available", valueKey: "lasdri_available" },
                    { label: "LASDRI Card Number", valueKey: "lasdri" },
                    { label: "Driver License", valueKey: "ndl_available" },
                    { label: "Driver License Number", valueKey: "ndl" },
                  ]}
                />

                {/* Next of Kin Details */}
                <DisplaySection
                  title="Next of Kin Details"
                  data={rider?.next_of_kin || {}}
                  keys={[
                    { label: "First Name", valueKey: "first_name" },
                    { label: "Last Name", valueKey: "last_name" },
                    { label: "Relationship", valueKey: "relationship" },
                    { label: "Phone Number", valueKey: "phone" },
                    { label: "Home Address", valueKey: "home_address" },
                  ]}
                />

              </div>
            </Tab.Panel>


              <Tab.Panel>
                <div className="grid grid-cols-12 gap-6 text-slate-600">
                  {/* BEGIN: Vehicle Details */}
                  <DisplaySection
                  title=""
                  data={vehicleDetails || {}}
                  keys={[
                    { label: "Registration Fee", valueKey: "5000" },
                    { label: "Accreditation Code ", valueKey: "tagNumber" },
                    { label: "RFID Tag Number", valueKey: "rfid_tag" },
                    { label: "Vehicle Type", valueKey: "vehicle_type" },
                    { label: "Plate Number", valueKey: "plate_number" },
                    { label: "Vehicle Registration Number", valueKey: "vrn" },
                    { label: "Vehicle Identification Number", valueKey: "vin" },
                    { label: "Road Worthiness Number", valueKey: "rwn" },
                    { label: "Zone ", valueKey: "zone" },
                    { label: "Park ", valueKey: "parkDesc" },
                    { label: "Route ", valueKey: "routeDesc" },

                    { label: "Vehicle Color ", valueKey: "vehicle_color" },

                    { label: "Vehicle Manufacture", valueKey: "manufacturer" },
                    { label: "Date Purchased", valueKey: "date" },
                  ]}
                />
                  {/* END: Vehicle Details */}

                  {/* BEGIN: Vehicle attachment */}
                  <div className="col-span-12 intro-y box text-base ">
                    <div className="flex items-center py-4">
                      <h3 className="intro-y box  font-semibold mr-4 text-sm">
                        VEHICLE ATTACHMENTS
                      </h3>
                      <hr className="flex-grow border-t border-slate-200/" />
                    </div>

                    <div className="flex justify-start items-center gap-x-6">
                      <div className="border rounded-md flex-none w-24 h-24 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
                        <h3>Qr Code</h3>
                        <img
                          alt="QRCode"
                          className="rounded-lg"
                          src={vehicleDetails?.qr_code_base64}
                        />
                      </div>

                      {/* <div className="flex-1 gap-y-4 lg:px-5 pt-5 mt-2 border-t-2 lg:mt-0 lg:border-0 border-slate-200/60 dark:border-darkmode-400 lg:pt-0"> */}
                      <div className="flex justify-start items-center space-x-4 text-sm lg:font-medium text-center ">
                        {images?.map(
                          (
                            image: { public_image_base64: string | undefined },
                            index: any
                          ) => (
                            <div key={index}>
                              <img
                                alt="Attachment"
                                className="h-32 w-32"
                                src={image?.public_image_base64}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    {/* </div> */}
                  </div>
                  {/* END: Next of Kin  */}
                </div>
              </Tab.Panel>

              {/* Owner Tab */}
              <Tab.Panel>

                <div className="grid grid-cols-12 text-slate-600">



<DisplaySection
  title=""
  data={owner || {}}
  keys={[
    { label: "Owner Category", valueKey: "owner_category" },
    {
      label: "Owner's Image",
      valueKey: "profilePicture",
      render: (value) =>
        value ? (
          <>
            {value}
            <span
              className="ml-1 text-customColor cursor-pointer"
              onClick={toggleModal}
            >
              View Image
            </span>
          </>
        ) : (
          "No Image Available"
        ),
    },
    { label: "First Name", valueKey: "first_name" },
    { label: "Middle Name", valueKey: "middle_name" },
    { label: "Last Name", valueKey: "last_name" },
    {
      label: "Gender",
      valueKey: "gender",
      render: (value) => (value === "m" ? "Male" : "Female"),
    },
    { label: "Marital Status", valueKey: "marital_status" },
    { label: "Phone Number", valueKey: "phone" },
    { label: "Home Address", valueKey: "home_address" },
  ]}
/>


                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className="grid grid-cols-12 text-slate-600">
                  <div className="col-span-12 intro-y text-base">
                    <div className="md:flex  justify-start items-center py-5 gap-x-6 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400 text-sm">
                      <div className="col-span-12 mt-6 lg:col-span-6 flex flex-col gap-y-4 ">
                        <h3 className="font-semibold text-sm ">Driver's Tag</h3>
                        <div
                         
                           className="relative   overflow-hidden   intro-y "
                        >
                         
                         <div  ref={driverTagRef} className="border-b border-black rounded-xl bg-white">

                          <div className="flex leading-[2.15rem] w-full text-white text-xl bg-green-800 items-center justify-center gap-x-4 py-4">
                            <div>
                              <img
                                className="w-10 h-10    sm:block"
                                alt="lagos logo"
                                src={logo}
                              />
                            </div>

                            <div className="text-center">
                              <h3 className="uppercase text-sm tracking-wider">
                                LAGOS STATE GOVERNMENT
                              </h3>
                              <p className="uppercase text-[10px] text-white/70 dark:text-slate-500 text-xs">
                                ministry of transportation
                              </p>
                            </div>
                          </div>

                          <div className="flex mt-3 w-full items-start leading-relaxed sm:w-72 text-white/70 dark:text-slate-500 gap-x-4">
                            <div>
                              <img
                                className=" rounded-r-md h-20 w-20   "
                                alt="lagos logo"
                                src={rider?.profile_picture_base64}
                              />
                            </div>

                            <div className="flex-col  text-xs">
                              <div className="text-slate-700 text-xs">
                                <span className="capitalize text-[10px] text-slate-700 dark:text-slate-500 text-xs mr-2">
                                  Name:
                                </span>
                                <span className="text-slate-600 text-[10px] font-bold">
                                  {rider?.first_name} {rider?.middle_name}{" "}
                                  {rider?.last_name}
                                </span>
                              </div>
                              <div className="text-slate-700 text-xs">
                                <span className="capitalize text-[10px] text-slate-700 dark:text-slate-500 text-xs mr-2">
                                  License Number:
                                </span>
                                <span className="text-slate-600 text-[10px] font-bold">
                                  {rider?.ndl ? rider?.ndl : "nill"}
                                </span>
                              </div>
                              <div className="text-slate-700 text-xs">
                                <span className="capitalize text-[10px] text-slate-700 dark:text-slate-500 text-xs mr-2">
                                  LASDRI Number:
                                </span>
                                <span className="text-slate-600 text-[10px] font-bold">
                                  {rider?.lasdri ? rider?.lasdri : "nill"}
                                </span>
                              </div>
                              <div className="mt-1">
                                <img
                                  alt="QRCode"
                                  className=" w-12 h-12"
                                  src={vehicleDetails?.qr_code_base64}
                                />
                              </div>
                            </div>
                          </div>
                         </div>

                          <div className="flex justify-between fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2  border-black z-50 border-b rounded-b-lg">
                            <div className="flex gap-x-2 justify-center items-center">
                              <div>
                                <Lucide
                                  icon="Eye"
                                  className="w-3 h-3 text-white"
                                />
                              </div>
                              <button
                                onClick={handleRiderPreview}
                                className="text-white text-xs"
                              >
                                Preview
                              </button>
                            </div>

                            <div className="flex gap-x-2 justify-center items-center">
                              <div>
                                <Lucide
                                  icon="Download"
                                  className="w-3 h-3 text-white"
                                />
                              </div>
                              <button
                                onClick={handleRiderDownload}
                                className="text-white text-xs"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 mt-6 lg:col-span-6 flex flex-col gap-y-4  ">
                        <h3 className="font-semibold text-sm ">
                          Vehicle Body Tag
                        </h3>
                        <div className="relative  overflow-hidden   intro-y bg-slate-50 ">
                          {/* <div className="flex leading-[2.15rem] w-full text-white text-xl bg-green-800  p-4">
                            <img
                              className="w-12  mr-2 -mt-3 sm:block"
                              alt="lagos logo"
                              src={logo}
                            />

                            <div className="text-center">
                              <h3 className="uppercase text-sm tracking-wider">
                                LAGOS STATE GOVERNMENT
                              </h3>
                              <p className="uppercase text-[12px] text-white/70 dark:text-slate-500 text-xs">
                                ministry of transportation
                              </p>
                            </div>
                          </div> */}

                          <div ref={bodyTagRef} className="flex gap-x-4 w-full items-center bg-slate-100 p-4 justify-between leading-relaxed sm:w-72 text-slate-700 dark:text-slate-500 overflow-y-scroll" >
                            <div className=" flex flex-col box items-center justify-start px-4  py-2 space-y-2">
                              <h3 className="uppercase text-red-600 font-bold text-[8px] ">
                                lekki - epe route
                              </h3>
                              <div>
                                <img
                                  alt="logo"
                                  className=" w-12 h-12"
                                  src={logoBig}
                                />
                              </div>
                              <h3 className="uppercase  font-bold text-[8px] ">
                                {vehicleDetails?.plate_number}
                              </h3>
                              <div className="text-white uppercase bg-blue-500 w-full text-center px-8 text-xs">
                                {vehicleDetails?.plate_number}
                              </div>

                              <p className="uppercase   text-[6px]">
                                exp date dec 2024{" "}
                              </p>
                            </div>

                            <div className="flex-col text-xs box rounded-none items-center justify-center space-y-2 border pb-1 border-black">
                              <div className="flex justify-center  items-center text-slate-700 text-xs border-b border-black">
                                <div className="border-r border-black px-1">
                                  <img
                                    alt="logo"
                                    className=" "
                                    src={logo}
                                  />
                                </div>
                                <div>
                                  <h3 className="uppercase  font-bold text-xs ">
                                    {vehicleDetails?.plate_number}
                                  </h3>
                                </div>
                              </div>
                              
                              <div className="">
                                <img
                                  alt="QRCode"
                                  className=" w-12 h-12 mx-auto"
                                  src={vehicleDetails?.qr_code_base64}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2  border-black z-50 border-b rounded-b-lg">
                            <div className="flex gap-x-2 justify-center items-center">
                              <div>
                                <Lucide
                                  icon="Eye"
                                  className="w-3 h-3 text-white"
                                />
                              </div>
                              <button
                                onClick={handleBodyTagPreview}
                                className="text-white text-xs"
                              >
                                Preview
                              </button>
                            </div>

                            <div className="flex gap-x-2 justify-center items-center">
                              <div>
                                <Lucide
                                  icon="Download"
                                  className="w-3 h-3 text-white"
                                />
                              </div>
                              <button className="text-white text-xs"  onClick={handleBodyTagDownload}>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className="grid grid-cols-12 gap-6 text-slate-600">
                  <div className="flow-root col-span-12 intro-y overflow-y-auto h-72">
                    <h2 className="text-lg mb-4">Activity Logs</h2>
                    {/* <div className="flex mb-4 items-center">   <Lucide icon="ArrowUp" className="h-5 w-5 text-green-600"  /> <p className="text-xs text-slate-500">15% this month</p> </div> */}
                    <ul role="list" className="-mb-8">
                      {user_activity_logs?.map(
                        (activityItem: Activity, activityItemIdx: number) => (
                          <li key={activityItem.id}>
                            <div className="relative pb-8">
                              {activityItemIdx !==
                              user_activity_logs.length - 1 ? (
                                <span
                                  className="absolute top-3 left-2 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex items-start space-x-3">
                                <>
                                  <div>
                                    <div className="relative px-1">
                                      <div className="h-2 w-2  bg-customColor rounded-full ring-4 ring-customColor/20 flex items-center justify-center">
                                        {/* <Lucide icon="Activity" className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="min-w-0 flex-1 py-0">
                                    <div className="text-sm  text-gray-500">
                                      <span className="mr-2">
                                        <Link
                                          to={activityItem.id}
                                          className="font-medium text-gray-900"
                                        >
                                          {activityItem.action}
                                        </Link>
                                      </span>

                                      <span className="whitespace-nowrap">
                                        {" "}
                                        {formatDate(activityItem.created_at)}
                                      </span>

                                      <div className="mr-0.5">
                                        <span className="">
                                          {" "}
                                          {activityItem.user.name}
                                        </span>

                                        <span
                                          className="bg-slate-400 h-1.5 w-1.5 rounded-full inline-block mx-2 "
                                          aria-hidden="true"
                                        />

                                        {/* <span className="ml-3  text-slate-500">{ formatChanges(activityItem.changes)}</span> */}
                                        <span className=" text-xs">
                                          {activityItem.type}
                                        </span>

                                        <span
                                          className="bg-slate-400 h-1.5 w-1.5 rounded-full inline-block  mx-2"
                                          aria-hidden="true"
                                        />

                                        <span className="mr-2 text-xs">
                                          {activityItem.user.lga}
                                        </span>
                                      </div>

                                    {/* If details exist, parse and display */}
            {activityItem.details && (
              <div className="mt-2 p-2 border-l-4 border-customColor/40 bg-gray-50 rounded">
                <strong className="block mb-1">Changes:</strong>
                {renderDetails(activityItem.details)}
              </div>
            )}

                                    </div>
                                  </div>
                                </>
                              </div>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </Tab.Panel>

              {/* surevy feedback */}

              <Tab.Panel>
                <div className="grid grid-cols-12 gap-6 text-slate-600">
                  <div className="flow-root col-span-12 intro-y overflow-y-auto h-72">
                    {/* <div className="flex mb-4 items-center">   <Lucide icon="ArrowUp" className="h-5 w-5 text-green-600"  /> <p className="text-xs text-slate-500">15% this month</p> </div> */}
                    <table className="table-auto w-full border-collapse bg-slate-50">
                      <thead>
                        <tr className="bg-customColor/5 text-left">
                          <th className=" px-4 py-2">S/N</th>
                          <th className=" px-4 py-2">Survey Question</th>
                          <th className=" px-4 py-2">Feedback/Response</th>
                        </tr>
                      </thead>
                      <tbody>
                        {surveyResponse?.length > 0 ? (
                          surveyResponse.map((response: any, index: any) => (
                            <tr key={index}>
                              <td className=" px-4 py-2">{index + 1}</td>
                              <td className=" px-4 py-2">{response.question}</td>
                              <td className=" px-4 py-2 capitalize">
                                {response.response}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className=" px-4 py-2 text-center">
                              No answers found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          {/* end content */}

          {/* <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" /> */}
        </div>
        {/* /End replace */}
      </div>
    </>
  );
}