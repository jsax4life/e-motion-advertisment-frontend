import React from 'react'
import { Menu } from '../../base-components/Headless'
import Lucide from '../../base-components/Lucide'
import Avatar from "../../assets/images/Avatar.png"
import ClientItem from './ClientItem'

const TopClient = ({title}: any) => {
  return (
    <div
    key={"rt"}
    className="col-span-12 intro-y md:col-span-6 xl:col-span-4 box"
  >
     <div className="flex items-center px-5 py-4 border-b border-slate-200/60 dark:border-darkmode-400">
      <div className="  mr-auto ">
      {title}
      </div>
    
      <Menu className="ml-3">
        <Menu.Button
        //   tag="p"
          className="w-5 h-5 text-slate-500"
        >
          <Lucide icon="MoreVertical" className="w-5 h-5" />
        </Menu.Button>
        <Menu.Items className="w-40">
          <Menu.Item>
            <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> Edit Post
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="Trash" className="w-4 h-4 mr-2" /> Delete Post
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>


  
    <div className="p-5 flex flex-col gap-y-4">
  
    < ClientItem clientName="Maltina" clietImage={Avatar} clientAmount="#20,000,000" clientNumberOfCampaigns="127" />
    < ClientItem clientName="MTN" clietImage={Avatar} clientAmount="#7,000,000" clientNumberOfCampaigns="127" />

    < ClientItem clientName="Glo" clietImage={Avatar} clientAmount="#16,000,000" clientNumberOfCampaigns="127" />

    < ClientItem clientName="Pepsi" clietImage={Avatar} clientAmount="#70,000,000" clientNumberOfCampaigns="127" />
    < ClientItem clientName="Yale" clietImage={Avatar} clientAmount="8,000,000" clientNumberOfCampaigns="127" />


    </div> 
    
  </div>
  )
}

export default TopClient
