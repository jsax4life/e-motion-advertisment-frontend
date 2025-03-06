import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"
import Lucide from "../../../base-components/Lucide";
import { formatDate } from "../../../utils/helper";

/* This example requires Tailwind CSS v2.0+ */

  
  export default function ContactDetails({campaign}: any) {
    return (
        <div className="grid grid-cols-2 gap-4 capitalize ">

      <div className="col-span-2 flex flex-col gap-y-2">

            {/* display contact details of client */}
              
                    <div className="flex space-x-6  items-center">
                        <div className="uppercase">Name</div>
                        <div className="font-medium">{campaign?.client?.contact_person_name}</div>
                    </div>
                    <div className="flex space-x-6  items-center">
                            <div className="uppercase">Number</div>
                            <div className="font-medium">{campaign?.client?.contact_person_phone}</div>
                        </div>
                    <div className="flex space-x-6  items-center">
                        <div className="uppercase">Email</div>
                        <div className="font-medium">{campaign?.client?.contact_person_email}</div>
                        </div>
                     
                            



       
      </div>
      </div>
    )
  }
  