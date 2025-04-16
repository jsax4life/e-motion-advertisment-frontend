import React from 'react'

const ClientItem = ({name, image, value, secondaryValue, secondaryValueLabel}: any) => {
  return (
    <div key="test" className="">
            <div className='flex justify-between'>
            <div className="flex items-start  w-1/2  space-x-2   ">
                    {
                      image && (
                        <div className=" flex-none w-10 h-10 overflow-hidden rounded-lg ">
                      <img
                        alt="Avatasr"
                        src={image}
                      />
                    </div>
                      )
                    }
                      <div className="text-slate-700 font-medium text-sm truncate ">
                      {name}
                      </div>
                   
                  </div>

                  <div className='text-end'>
                    <h2 className='text-sm font-bold'>{value}</h2>
                      <div className="text-xs text-slate-400">{secondaryValue} {secondaryValueLabel}</div>
                      </div>
            </div>
                </div>
  )
}

export default ClientItem
