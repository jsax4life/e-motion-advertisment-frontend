import React from "react";
import Pagination from "../../base-components/Pagination";
import { FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { formatCurrency, formatDate } from "../../utils/utils";


interface BillboardFace {
  face_number: number;
  description: string | null; // or `string` if description is always required
}

interface Billboard {
  slot_available: any;
  face_available: any;
  id: string;
  serialNumber: string;
  internalCode: string;
  billboardName: string;
  billboardType: "static" | "digital" | "bespoke";
  numberOfSlotsOrFaces: number;
  numberOfFaces: number;
  pricePerDay: number;
  state: string;
  lga: string;
  lng: string;
  lat: string;
  address: string;
  geolocation: object;
  dimension: string; // Default dimension
  height: string;
  width: string;
  available_slots: number[];
  available_faces: BillboardFace[]; // <- updated structure

  pricePerMonth: string;
  status: string;
  activeStatus: string;
  images: [];
  orientation: string;
}

interface DisplaySectionProps {
  loading: boolean;
  billboard: Billboard;
}

const DisplaySection: React.FC<DisplaySectionProps> = ({
  loading,
  billboard,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(billboard);

  const availableFaceNumbers = billboard?.available_faces.map(face => face.face_number);


  return (
    // <div className="col-span-7 bg-blue-500 flex space-x-4 border rounded-2xl px-5 sm:px-6 intro-y">
    <div className="grid grid-cols-12 gap-6 text-slate-600  ">
      <div className=" flex flex-col gap-y-8 p-5  rounded-2xl text-xs bg-white col-span-12 lg:col-span-8 overflow-auto intro-y 2xl:overflow-visible">
        {/* <div className="text-xl font-medium text-slate-600">Billboard Details</div> */}

        <div className="grid grid-cols-2 gap-4 uppercase ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-1 ">
              Billboard Number
            </div>
            <div className="  lg:text-[16px] font-bold  text-slate-800">
              {billboard?.serialNumber}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" lg:text-[12px] text-slate-500 font-bold mb-1">
              Billboard internal Code
            </div>
            <div className=" font-bold lg:text-[16px] text-slate-800">
              {billboard?.internalCode}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase ">
          {/* <div className="col-span-1 ">
                    <div className="text-sm md:text-[12px] text-slate-400 font-bold mb-1 ">Billboard Name</div>
                    <div className="text-lg font-bold  text-slate-800">{billboard?.billboardName}</div>
                  </div> */}
          <div className="col-span-2  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-1">
              Billboard Address
            </div>
            <div className=" font-bold   text-slate-800">
              {billboard?.address}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-1 ">
              State
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-800">
              {billboard?.state}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-1">
              Local government
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-800">
              {billboard?.lga}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase pb-4  border-b border-slate-200 ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-1 ">
              Longitude
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-800">
              {billboard?.lng}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-1">
              Latitude
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-800">
              {billboard?.lat}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 uppercase ">
          <div className="col-span-1 ">
            <div className=" md:text-[12px] text-slate-400 font-bold mb-1 ">
              oriientation
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-800">
              {billboard?.orientation}
            </div>
          </div>
          <div className="col-span-1  ">
            <div className=" md:text-[12px] text-slate-500 font-bold mb-1">
              dimensions
            </div>
            <div className=" font-bold  lg:text-[16px] text-slate-800">
              {billboard?.dimension}
            </div>
          </div>
        </div>

        {billboard?.dimension === "Custom" && (
          <div className="grid grid-cols-2 gap-4 uppercase ">
            <div className="col-span-1 ">
              <div className=" md:text-[12px] text-slate-500 fo4t-bold mb-1 ">
                width(meter)
              </div>
              <div className=" font-bold  lg:text-[16px] text-slate-800">
                {billboard?.width}
              </div>
            </div>
            <div className="col-span-1  ">
              <div className=" md:text-[12px] text-slate-500 font-bold mb-1">
                height(meter)
              </div>
              <div className=" font-bold  lg:text-[16px] text-slate-800">
                {billboard?.height}
              </div>
            </div>
          </div>
        )}

        {/* Price Section */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-bold text-black">Pricing Information</div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('editPrice', { detail: billboard }))}
              className="flex items-center justify-center font-medium shadow-sm bg-customColor rounded-lg px-3 py-2 text-white text-sm hover:bg-customColor/90 transition-colors"
            >
              <Lucide icon="Edit" className="w-4 h-4 mr-2" />
              Edit Price
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-1">
              <div className="md:text-[12px] text-slate-500 font-bold mb-2">
                Price Per Month
              </div>
              <div className="font-bold lg:text-[18px] text-slate-800">
                ₦{formatCurrency(Number(billboard?.pricePerMonth) || 0)}
              </div>
            </div>
            <div className="col-span-1">
              <div className="md:text-[12px] text-slate-500 font-bold mb-2">
                Price Per Day
              </div>
              <div className="font-bold lg:text-[18px] text-slate-800">
                ₦{formatCurrency(Number(billboard?.pricePerDay) || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="flex flex-col  gap-6  col-span-12 lg:col-span-4 ">
     {/* <div className=" p-5  flex flex-col gap-y-4 rounded-2xl  bg-white col-span-12 lg:col-span-4 overflow-auto intro-y 2xl:overflow-visible capitalize ">
        <div className="border-b border-slate-200 pb-4 text-lg font-bold text-black">
         {billboard?.billboardType === "digital" ? "Slots Available" : "Face Available"}
        </div>

        <div className="flex gap-2  ">
          {billboard.billboardType === "digital"? billboard.available_slots.map((slot, index) => ( 
            <div key={index} className="flex justify-center items-center rounded-lg bg-orange-100 text-orange-500 p-2 w-7 h-7">
              <div className=" font-semibold text-xs">{slot}</div>
            </div>
            

            
          ) ) : billboard.available_faces.map((face, index) => ( 
            <div key={index} className="flex justify-center items-center rounded-lg bg-orange-100 text-orange-500 p-2 w-7 h-7">
            <div className=" font-semibold text-xs">{face}</div>
          </div>
          ) ) }
          </div>

         
      </div> */}
      <div className="p-5 flex flex-col gap-y-4 rounded-2xl bg-white col-span-12 lg:col-span-4 overflow-auto intro-y 2xl:overflow-visible capitalize">
  <div className="border-b border-slate-200 pb-4 text-lg font-bold text-black">
    {billboard?.billboardType === "digital" ? "Slots Status" : "Face Status"}
  </div>

  <div className="flex flex-wrap gap-2">
       {/* Booked Slots/Faces */}
       {billboard?.billboardType === "digital"
      ? Array.from({ length: billboard?.numberOfSlotsOrFaces }, (_, i) => i + 1)
          .filter((slot) => !billboard?.available_slots.includes(slot)) // Filter out available slots
          .map((slot, index) => (
            <div key={index} className="flex justify-center items-center rounded-lg bg-red-100 text-red-500 p-2 w-7 h-7">
              <div className="font-semibold text-xs">{slot}</div>
            </div>
          ))
      :  Array.from({ length: billboard?.numberOfSlotsOrFaces }, (_, i) => i + 1)
          .filter(face => !availableFaceNumbers.includes(face)) // Filter out available faces
          .map((face, index) => (
            <div
              key={index}
              className="flex justify-center items-center rounded-lg bg-red-100 text-red-500 p-2 w-7 h-7"
            >
              <div className="font-semibold text-xs">{face}</div>
            </div>
          ))

          }

    {/* Available Slots/Faces */}
    {billboard?.billboardType === "digital"
      ? billboard?.available_slots.map((slot, index) => (
          <div key={index} className="flex justify-center items-center rounded-lg bg-green-100 text-green-500 p-2 w-7 h-7">
            <div className="font-semibold text-xs">{slot}</div>
          </div>
        ))
      : billboard?.available_faces.map((face, index) => (
          <div key={index} className="flex justify-center items-center rounded-lg bg-green-100 text-green-500 p-2 w-7 h-7">
            <div className="font-semibold text-xs">{face.face_number}</div>
            {/* <strong>Face {face.face_number}:</strong> {face.description} */}
          </div>
        ))}

 
  </div>
</div>



      <div className=" p-5  flex flex-col gap-y-4 rounded-2xl  bg-white col-span-12 lg:col-span-4 overflow-auto intro-y 2xl:overflow-visible">
        <div className="border-b border-slate-200 pb-4 text-lg font-bold text-black">
          Billboard Images
        </div>
        <div className="grid grid-cols-3 gap-4 uppercase lg:mb-8 ">
          {billboard?.images.map((image, index) => (
            <div
              key={index}
              className="col-span-1 rounded-2xl border max-w-1/3 "
            >
              <img src={image} alt="images" />
            </div>
          ))}
        </div>


        
      </div>
      </div>



    </div>
  );
};

export default DisplaySection;
