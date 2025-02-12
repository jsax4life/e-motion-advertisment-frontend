import React from 'react';
import Lucide from "../../base-components/Lucide";
import LoadingIcon from '../../base-components/LoadingIcon';

interface DashboardCardProps {
  count: number | undefined;
  label: string;
  bgColor: string;
  iconFill: string;
  iconText: string;
  laadingCount: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ count, label, bgColor, iconFill, iconText, laadingCount }) => {
  return (
    <div className="col-span-12  p-4     cursor-pointer sm:col-span-4  bg-white  shadow-lg rounded-xl zoom-in ">
      
    <div className='flex justify-start items-center space-x-4 mb-2'>
      <div className={`flex items-center justify-center rounded-md ${bgColor} w-8 h-8`}>
        {/* <Lucide icon='Trash' fill={iconFill} className={`p-1 w-[32px] h-[32px] ${iconText}`} /> */}
        <Lucide
                        icon="Trash"
                        className={`w-[24px] h-[24px] ${iconText}`} 
                      />
      </div>
     
      <div className="text-slate-400 text-xs">{label}</div>
    </div>

        <div className="text-2xl font-medium text-end ">{laadingCount? 
        
        (
          <div className="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2">
          <LoadingIcon icon="three-dots" className="w-6 h-6" />
        </div>
  ) : count! + 123000000
   
        
        }</div>
    </div>
  );
};

export default DashboardCard;
