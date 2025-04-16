import React from 'react'
import { Menu } from '../../../base-components/Headless'
import Lucide from '../../../base-components/Lucide'
import Avatar from "../../../assets/images/Avatar.png"
import ClientItem from '../AnalyticsItem'
import AnalyticsItem from './AnalyticsItem'

type items = {
  title: String,
  item1Name: String,
  item2Name: String,
  item3Name: String,
  item1Data: String,
  item2Data: String,
  item3Data: String,
  iconBgColor1: String,
  iconBgColor2: String,

  iconBgColor3: String,

}

const Analytics = ({title, item1Name, item2Name, item3Name, item1Data, item2Data, item3Data, iconBgColor1, iconBgColor2, iconBgColor3}: items) => {


  return (
    <div
    key={"rt"}
    className="col-span-12 intro-y md:col-span-6 xl:col-span-4 box"
  >
     <div className="flex items-center px-5 py-4 border-b border-slate-200/60 dark:border-darkmode-400">
      <div className="  mr-auto  text-lg font-bold">
      {title}
      </div>
    
     
    </div>


  
    <div className="p-5 flex flex-col gap-y-4">
  
    < AnalyticsItem itemName={item1Name}  itemData={item1Data} iconBgColor ={iconBgColor1} />
    < AnalyticsItem itemName={item2Name}  itemData={item2Data} iconBgColor = {iconBgColor2} />

    < AnalyticsItem itemName={item3Name}  itemData={item3Data} iconBgColor= {iconBgColor3} />

    
    </div> 
    
  </div>
  )
}

export default Analytics
