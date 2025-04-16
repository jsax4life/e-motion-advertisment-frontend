import React from 'react'
import Lucide from '../../../base-components/Lucide'

const AnalyticsItem = ({itemName, iconBgColor, itemData}: any) => {
  return (
    <div key="test" className="">
            <div className='flex justify-between items-center'>
            <div className="flex justify-center items-center  space-x-2   ">
                    <div className={`flex justify-center items-center p-1.5 w-7 h-7 overflow-hidden rounded-md ${iconBgColor}`}>
                        <Lucide icon='Archive' color='white'/>
                    </div>
                      <div className="uppercase text-slate-700  font-medium text-sm ">
                      {itemName}
                      </div>
                   
                  </div>

                  <div className='text-end'>
                    <h2 className='text-sm font-bold'>{itemData}</h2>
                      </div>
            </div>
                </div>
  )
}

export default AnalyticsItem
