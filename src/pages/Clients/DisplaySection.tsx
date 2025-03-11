import React from "react";
import Pagination from "../../base-components/Pagination";
import { FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { formatCurrency } from "../../utils/utils";
import { formatDate } from "../../utils/helper";

interface Client {
  id: number;
  company_name: string,
  company_email: string,
  company_phone: string,
  contact_person_name: string,
  contact_person_email: string,
  contact_person_phone: string,
  client_type: string, 
  state: string,
  lga: string,
  company_address: string,
  birthday: string,
  brand_industry: string,
}

interface DisplaySectionProps {
  loading: boolean;
  client: Client;
}

const DisplaySection: React.FC<DisplaySectionProps> = ({
  loading,
  client,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    // <div className="col-span-7 bg-blue-500 flex space-x-4 border rounded-2xl px-5 sm:px-6 intro-y">
    <div className="grid grid-cols-12 gap-6 text-slate-600  ">
      <div className=" flex flex-col gap-y-8 p-5  rounded-2xl text-xs bg-white col-span-12  overflow-auto intro-y 2xl:overflow-visible">
        {/* <div className="text-xl font-medium text-slate-600">Billboard Details</div> */}

        <div className="grid grid-cols-2 gap-4 uppercase lg:pb-8 border-b">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2 ">Company Phone Number </div>
            
            <div className="  lg:text-[16px] font-bold  text-slate-700">
              {client?.company_phone}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" lg:text-[12px] text-slate-500 font-bold mb-2">
              company email
            </div>
            <div className=" font-bold lg:text-[16px] text-slate-700">
              {client?.company_email}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase lg:pb-8 border-b ">
          {/* <div className="col-span-1 ">
                    <div className="text-sm md:text-[12px] text-slate-400 font-bold mb-1 ">Billboard Name</div>
                    <div className="text-lg font-bold  text-slate-800">{billboard?.billboardName}</div>
                  </div> */}
          <div className="col-span-2  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-2">
                  client address
            </div>
            <div className=" font-bold   text-slate-700">
              {client?.company_address}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase lg:pb-8 border-b ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2 ">
              contact person name
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {client?.contact_person_name}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2">
              contact person email
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {client?.contact_person_email}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2">
              contact person number
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {client?.contact_person_phone}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2">
              contact person date of birth 
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {formatDate(client?.birthday, "DD/MM/YYYY")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase pb-4 lg:pb-8  border-b border-slate-200 ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2 ">
              client type
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {client?.client_type}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-2">
              brand industry
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {client?.brand_industry}
            </div>
          </div>
      
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase pb-4 lg:pb-8 border-b border-slate-200 ">
        <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-2">
              local government area
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {client?.lga}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-2">
              state
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {client?.state}
            </div>
          </div>
        </div>

     
      </div>
      {/* <div className=" p-5  flex flex-col gap-y-4 rounded-2xl  bg-white col-span-12 lg:col-span-4 overflow-auto intro-y 2xl:overflow-visible">
        <div className="border-b border-slate-200 pb-4 text-lg font-bold text-black">
          client Images
        </div>
        <div className="grid grid-cols-3 gap-4 uppercase lg:mb-8 ">
          {client.images.map((image, index) => (
            <div
              key={index}
              className="col-span-1 rounded-2xl border max-w-1/3 "
            >
              <img src={image} alt="images" />
            </div>
          ))}
          <div>test</div>
        </div>
      </div> */}
    </div>
  );
};

export default DisplaySection;
