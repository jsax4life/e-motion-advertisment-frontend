/* This example requires Tailwind CSS v2.0+ */
import { Fragment, JSXElementConstructor, ReactElement, ReactNode, useContext, useEffect } from "react";

// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import _ from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";

import { Dialog, Menu, Tab } from "../../base-components/Headless";

import { UserContext } from "../../stores/UserContext";
import API from "../../utils/API";
import Tippy from "../../base-components/Tippy";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { formatDate } from "../../utils/utils";
import profile from "../../assets/images/profile.png"

const tagStyle = [
  "bg-orange-100 text-orange-600",
  "bg-green-100 text-green-600",
];



type UserRoleKey = 'registration_officer' | 'attachment_officer' | 'operation_officer';

interface ActivityItem {
  user_role: UserRoleKey;
  // other fields...
}

const userRole: Record<UserRoleKey, any> = {
  registration_officer: 'Registration Officer',
  attachment_officer: 'Attachment Officer',
  operation_officer: 'Operation Officer',
};

const activityItem: ActivityItem = {
  user_role: 'registration_officer',
  // other fields...
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

export default function UserProfile() {
  const { user } = useContext(UserContext);

  const { id } = useParams<{ id: string }>();
  const [adminProfile, setAdminProfile] = useState<any>(null);

  

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isInitialMount = useRef(true);

  const navigate = useNavigate();

console.log(adminProfile);
  

  useEffect(() => {
    if (user?.token) {
        fetchVehicleData();
    }
  }, [user?.token]);

//   const { rider, owner, user_activity_logs } = vehicleDetails ?? {};

  // const user_activity_logs: any[] =[];

  const isNull = 'Unavailable';

  const fetchVehicleData = () => {

    setError("");


    API(
      "get",

      `admin/profile`, // Make sure your backend API endpoint is correct
      {},

      // {lga: 'Alimosho'},
      function (admiinData: any) {
        console.log(adminProfile)
        setAdminProfile(admiinData?.data);
        setLoading(false);
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setLoading(false);
      },
      user?.token && user.token
    );
  };



  
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
        {/* <div className="bg-gradient-to-r from-primary via-purple-800 to-primary pb-32">
          <header className="py-5"></header>
        </div> */}

          <div className=" mx-auto pb-12 lg:pb-0  lg:px-0 ">
            {/* Replace with your content */}

            <div className="bg-white   px-2 py-6 sm:px-6 sm:py-2">
              {/* content */}

              <Tab.Group>
                {/* BEGIN: Profile Info */}
                <div className=" pt-5 lg:pt-2  intro-y ">
                  <div className="flex flex-col pb-5 -mx-5  lg:flex-row border-slate-200/60 dark:border-darkmode-400">
                  <div className="flex justify-center items-center lg:hidden mb-4">

<Button variant="primary" className="mr-2 shadow-sm px-2 bg-customColor" onClick={() => {
              navigate(`/edit-admin-profile`);
            }}>Edit</Button>

                      <Button variant="secondary" className="mr-2 shadow-sm">
            <Lucide icon="Download" className="w-4 h-4 mr-2" /> Export As PDF
          </Button>
</div>
                    <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
         
                      <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
                        <img
                          alt="Profile pix"
                          className="rounded-lg"
                          src={adminProfile?.profile_picture_url? adminProfile?.profile_picture_url : profile}
                        />
                      </div>
                      <div className="ml-5 items-center ">
                        <div
                          className={`lg:w-1/4 w-1/2 text-center px-2 lg:py-1 py-0.5 mb-2 rounded-full text-xs font-medium capitalize ${
                            tagStyle[adminProfile?.active]
                          }`}
                        >
                          {adminProfile?.active ? "Active" : "Inactive"}
                        </div>
                        <div className="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
                          {adminProfile?.firstName} {adminProfile?.lastName}
                        </div>
                        <div className="text-slate-500 lg:mb-4">
                          <span className="font-semibold text-md mr-2">
                            Role:
                          </span>
                          <span>{adminProfile?.name}</span>
                        </div>

                        <div className="text-slate-500 hidden text-xs lg:flex">
                        <Button variant="primary" className="mr-2  px-4 py-1 bg-customColor" onClick={() => {
              navigate(`/edit-admin-profile`);
            }}>Edit</Button>

                      <Button className="mr-2 shadow-sm bg-white">
            <Lucide icon="Download" className="w-4 h-4 mr-2" /> Export As PDF
          </Button>
                        </div>
                      </div>

                    </div>
                  </div>
                  <Tab.List
                    variant="link-tabs"
                    className="flex-col justify-center text-center sm:flex-row lg:justify-start"
                  >
                    <Tab fullWidth={false}>
                      <Tab.Button className="flex items-center cursor-pointer ">
                        User Details
                      </Tab.Button>
                    </Tab>

                  </Tab.List>
                </div>
                {/* END: Profile Info */}
                <Tab.Panels className="mt-5">
                  <Tab.Panel>
                    <div className="grid grid-cols-12 gap-6 text-slate-600">
                      {/* BEGIN: Rider Details */}
                      <div className="col-span-12 intro-y  ">
                        <div className=" flex justify-start items-center py-5 gap-x-6  border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400 text-md">
                          <div className=" mb-5 flex flex-col no-wrap items-start justify-start space-y-2">
                            <div className="font-semibold ">Gender:</div>
                            <div className="font-semibold ">Phone Number:</div>
                            <div className="font-semibold ">Email:</div>
                            
                            <div className="font-semibold ">
                              State:
                            </div>
                          </div>
                          <div className=" mb-5 flex flex-col no-wrap items-start justify-start space-y-2 ">

                            <div className="">
                              {adminProfile?.gender === "f" ? "Female" : "Male"}
                            </div>

                            <div className="">{adminProfile?.phoneNumber}</div>
                            <div className="">{adminProfile?.email}</div>
                            <div className="">{adminProfile?.state}Lagos</div>
                          </div>
                        </div>
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



