import React from 'react'

const ClientItem = ({clientName, clietImage, clientAmount, clientNumberOfCampaigns}: any) => {
  return (
    <div key="test" className="">
            <div className='flex justify-between'>
            <div className="flex items-start  space-x-2   ">
                    <div className="flex-none w-10 h-10 overflow-hidden rounded-md ">
                      <img
                        alt="Avatasr"
                        src={clietImage}
                      />
                    </div>
                      <div className="text-slate-700 font-medium text-sm ">
                      {clientName}
                      </div>
                   
                  </div>

                  <div className='text-end'>
                    <h2 className='text-xl font-bold'>{clientAmount}</h2>
                      <div className="text-sm">{clientNumberOfCampaigns} campaigns</div>
                      </div>
            </div>
                </div>
  )
}

export default ClientItem
