import React from 'react'
import { Menu } from '../../base-components/Headless'
import Lucide from '../../base-components/Lucide'
import AnalyticsItem from './AnalyticsItem'

type AnalyticsItem = {
  id: string | number;
  name: string;
  image?: string;
  value: number | string;
  secondaryValue?: number | string;
  // Add any other optional fields that might be needed
}

type Props = {
  title: string;
  itemData: AnalyticsItem[];
  valueLabel?: string;
  secondaryValueLabel?: string;
}

const AnalyticsCard = ({ title, itemData, valueLabel, secondaryValueLabel }: Props) => {
  return (
    <div className="col-span-12 intro-y md:col-span-6 xl:col-span-4 box">
      <div className="flex items-center px-5 py-4 border-b border-slate-200/60 dark:border-darkmode-400">
        <div className="mr-auto">
          {title}
        </div>
        
        <Menu className="ml-3">
          <Menu.Button className="w-5 h-5 text-slate-500">
            <Lucide icon="MoreVertical" className="w-5 h-5" />
          </Menu.Button>
          <Menu.Items className="w-40">
            <Menu.Item>
              <Lucide icon="Edit2" className="w-4 h-4 mr-2" /> Edit
            </Menu.Item>
            <Menu.Item>
              <Lucide icon="Trash" className="w-4 h-4 mr-2" /> Delete
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      <div className="p-5 flex flex-col gap-y-4">
        {itemData?.map((item) => (
          <AnalyticsItem 
            key={item.id}
            name={item.name}
            image={item.image}
            value={item.value}
            valueLabel={valueLabel}
            secondaryValue={item.secondaryValue}
            secondaryValueLabel={secondaryValueLabel}
          />
        ))}
      </div> 
    </div>
  )
}

export default AnalyticsCard