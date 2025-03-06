import React from "react";
import Pagination from "../../../base-components/Pagination";
import { FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import { Menu, Tab } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { formatCurrency, formatDate } from "../../../utils/utils";
import ApprrovalProcess from "./ApprovalProcess";
import ContactDetails from "./ContactDetails";

interface Campaign {
  id: string;
  client_id: string;
  order_id: string;
  billboards: any[];
  status_logs: any[];
  client: any;
  campaign_name: string;
  campaign_duration: string;
  status: ['pending', 'approved', 'paiid', 'delivered']
  payment_option: string;
  media_purchase_order:string;
  total_order_amount: number;
  discount_order_amount: number;
  comment: string;
  
}

interface DisplaySectionProps {
  loading: boolean;
  campaign: Campaign;
}

const DisplayDetailsSection: React.FC<DisplaySectionProps> = ({
  loading,
  campaign,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    // <div className="col-span-7 bg-blue-500 flex space-x-4 border rounded-2xl px-5 sm:px-6 intro-y">
    <div className="grid grid-cols-12 gap-6 text-slate-600  ">
      <div className=" flex flex-col gap-y-8 p-5  rounded-2xl text-xs bg-white col-span-12 lg:col-span-8 overflow-auto intro-y 2xl:overflow-visible">
        {/* <div className="text-xl font-medium text-slate-600">Billboard Details</div> */}

        <div className="grid grid-cols-2 gap-4 uppercase ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-1 ">
              client
            </div>
            <div className="  lg:text-[16px] font-bold  text-slate-800">
              {campaign?.client?.company_name}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" lg:text-[12px] text-slate-500 font-bold mb-1">
              campaign name
            </div>
            <div className=" font-bold lg:text-[16px] text-slate-800">
              {campaign?.campaign_name}
            </div>
          </div>
        </div>

       

        <div className="grid grid-cols-2 gap-4 uppercase ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-1 ">
              campaign duration
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-800">
            {campaign?.campaign_duration}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-1">
            payment option
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-800">
            {campaign?.payment_option}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase border-y lg:py-8 ">
          {/* <div className="col-span-1 ">
                    <div className="text-sm md:text-[12px] text-slate-400 font-bold mb-1 ">Billboard Name</div>
                    <div className="text-lg font-bold  text-slate-800">{billboard?.billboardName}</div>
                  </div> */}
          <div className="col-span-2 mb-4">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-1">
              media purchase order document
            </div>
            <div className=" font-bold   text-customColor">
              {campaign?.media_purchase_order}
            </div>
          </div>

          <div className="col-span-2 ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-1">
              description
            </div>
            <div className=" text lowercase  text-black text-sm">
              {campaign?.comment}
            </div>
          </div>
        </div>

       
            


          {campaign?.billboards?.length > 0 && (
  <div className="grid grid-cols-2 gap-4 pb-4  border-b border-slate-200 ">
    {campaign?.billboards?.map((billboard, index) => (
      <div
        key={index}
        className="flex items-center col-span-2 lg:space-x-8 space-x-2  text-xs lg:text-sm p-2 lg:p-4 bg-primary text-customColor rounded-2xl "
      >
        <div className="mr-auto w-full lg:w-1/2 uppercase ">
          <div className="text-sm md:text-[16px] text-black font-semibold mb-2">
            {
            billboard?.billboard?.billboardName
            }
          </div>
          <div className="flex space-x-2 text-xs capitalize mb-2">
            <div className="bg-violet-200 text-violet-600 p-0.5">
              {
                billboard?.orientation
              }
            </div>
            <div className="bg-blue-100 text-blue-600 p-0.5">
              {
               billboard?.billboard_type
              }
            </div>
            <div className="bg-orange-100 text-orange-500 p-0.5">
              {billboard.slot
                ? `Slot ${billboard.slot}`
                : `Face ${billboard.face} `}
            </div>
          </div>
          <div className="text-xs  text-black mb-2 lowercase truncate">
            {
            billboard?.billboard?.address
            }
          </div>
        </div>

        <div className="flex lg:w-full w-1/3 justify-end items-center lg:space-x-4">
          <div className="lg:text-lg text-xs text-slate-400 font-semibold ">
            
          {/* <div className="text-slate-500 lg:text-sm text-xs">
              campaign cost
            </div> */}
            &#x20A6;{formatCurrency(billboard?.billboard?.pricePerDay)} /day
            
          </div>
          <div className="lg:text-lg text-xs text-customColor font-semibold">
            
            {/* <div className="text-slate-500 lg:text-sm text-xs">
                campaign cost
              </div> */}
              &#x20A6;{formatCurrency(billboard?.actual_amount)}

              
            </div>
          <button
            onClick={() => {
            //   setBillboards((prev) => prev.filter((_, i) => i !== index));
            //   setUsedSlotsFaces((prev) => ({
            //     ...prev,
            //     [billboard.billboardId]: prev[billboard.billboardId]?.filter(
            //       (slotOrFace) => slotOrFace !== billboard.slotOrFace
            //     ),
            //   }));
            }}
            className="  hover:bg-white text-customColor hover:text-white rounded-lg w-5 h-5 flex items-center justify-center"
          >
            {/* &times; */}
            <Lucide icon="MoreHorizontal" className="text-customColor" />
          </button>
        </div>


      </div>
    ))}
  </div>
)}


       

        <div className="grid grid-cols-2 gap-4 uppercase ">
          <div className="col-span-2 text-end ">
            <div className=" text-sm text-slate-600 font-bold lg:mb-4">
              Amount:  <span className="text-xl ml-4 text-slate-400">&#x20A6;{formatCurrency(campaign?.total_order_amount)}</span>
            </div>
            <div className=" font-bold  text-sm text-slate-800 capitalize">
              Amount after discount <span className="text-xl ml-4">&#x20A6;{formatCurrency(campaign?.discount_order_amount)}</span>
            </div>
          </div>
      
        </div>


      </div>


     <div className="flex flex-col  gap-6  col-span-12 lg:col-span-4 ">
     <div className=" p-5  flex flex-col gap-y-4 rounded-2xl  bg-white col-span-12 lg:col-span-4 overflow-auto intro-y 2xl:overflow-visible capitalize ">
        <div className="border-b border-slate-200 pb-4 text-lg font-bold text-black">
          approval process
        </div>

          <ApprrovalProcess statusLog = {campaign.status_logs}/>
         
      </div>

      <div className=" p-5  flex flex-col gap-y-4 rounded-2xl  bg-white col-span-12 lg:col-span-4  intro-y  capitalize">
        <div className="border-b border-slate-200 pb-4 text-lg font-bold text-black ">
          contact details
        </div>
            <ContactDetails campaign={campaign}/> 
      </div>

      <div className=" p-5  flex flex-col gap-y-4 rounded-2xl  bg-white col-span-12 lg:col-span-4 overflow-auto intro-y 2xl:overflow-visible capitalize">
        <div className="border-b border-slate-200 pb-4 text-lg font-bold text-black">
          preview
        </div>
        <div className="grid grid-cols-3 gap-4 uppercase lg:mb-8 ">
          {campaign?.status_logs.map((log, index) => (
            <div
              key={index}
              className="col-span-1 rounded-2xl border max-w-1/3 "
            >
              <p>{log?.new_status}</p>
            </div>
          ))}
        </div>
      </div>
     </div>
    </div>
  );
};

export default DisplayDetailsSection;
