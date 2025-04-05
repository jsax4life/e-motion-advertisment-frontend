import React from "react";
import Pagination from "../../base-components/Pagination";
import { FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { formatCurrency } from "../../utils/utils";
import { formatDate } from "../../utils/helper";


interface Admin {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  role: [{'name': string}];
  date_created: string;
  active: any;
  profile_image_url: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob:string;
  industry: string;
  created_at: string;

}

interface DisplaySectionProps {
  loading: boolean;
  admin: Admin;
}

const DisplaySection: React.FC<DisplaySectionProps> = ({
  loading,
  admin,
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
            
            
              <img src={admin?.profile_image_url} alt="images" />
          
          
          </div>
          
        </div>


        <div className="grid grid-cols-2 gap-4 uppercase lg:pb-8 border-b ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2 ">
             first name
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {admin?.firstName} 
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2">
              last name
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {admin?.lastName}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2">
              role
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {admin?.name}
            </div>
          </div>
        
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase pb-4 lg:pb-8  border-b border-slate-200 ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-2 ">
              email
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {admin?.email}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-2">
              phone number
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {admin?.phoneNumber}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-2">
              gender
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {admin?.gender}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-2">
              date of birth
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {admin?.dob}
            </div>
          </div>
      
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase pb-4 lg:pb-8 border-b border-slate-200 ">
        <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-2">
              industry
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              {admin?.industry}
            </div>
          </div>
       
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase pb-4 lg:pb-8 border-b border-slate-200 ">
        <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-2">
              passwrd
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-700">
              **************
            </div>
          </div>
       
        </div>

     
      </div>
 
    </div>
  );
};

export default DisplaySection;
