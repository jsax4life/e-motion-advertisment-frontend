import React, { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog } from "../../../base-components/Headless";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Litepicker from "../../../base-components/Litepicker";
import API from "../../../utils/API";
import { UserContext } from "../../../stores/UserContext";
import { formatCurrency, formatDate } from "../../../utils/utils";
import { useFetchStates } from "../../../lib/Hook";
import PdfUploadSection from "./PdfUploadSection";
import { DateTime } from "litepicker/dist/types/datetime";
import { useAvailableBillboards } from "../../../hooks/useBillboards";

interface BillboardCreationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  clients: Client[];
  onClose: () => void;
  onSubmit: (data: any, fileForm: any) => void;
}

interface StateData {
  name: string;
  lgas: string[];
}

interface Client {
  id: string;
  company_name: string;
}

// interface BillboardOrder {
//   id: string;
//   name: string;
//   type: "Static" | "Digital" | "Bespoke";
//   slotsAvailable: number;
//   facesAvailable: number;
//   price: number;
// }

type OrderDetails = {
  client_id: string;
  campaign_name: string;
  campaign_duration: number;
  campaign_start_date: string;
  campaign_end_date: string;
  payment_due_date: string;
  payment_option: string;
  media_purchase_order: File | null;
  total_order_amount: number;
  discount_order_amount: number;
  description: string;
};

interface BillboardFace {
  face_number: number;
  description: string | null; // or `string` if description is always required
}

interface AvailableBillboard {
  id: string;
  serialNumber: string;
  internalCode: string;
  billboardName: string;
  billboardType: "static" | "digital" | "bespoke";
  // numberOfSlots: number;
  // numberOfFaces: number;
  numberOfSlotsOrFaces: number;
  pricePerDay: number;
  state: string;
  lga: string;
  address: string;
  geolocation: object;
  dimension: string; // Default dimension
  height: string;
  width: string;
  available_slots: number[];
  available_faces: BillboardFace[];

  pricePerMonth: string;
  status: string;
  activeStatus: string;
  images: [];
  orientation: string;
}

const OrderCreationModal: React.FC<BillboardCreationModalProps> = ({
  isOpen,
  isLoading,
  clients,
  onClose,
  onSubmit,
}) => {
  // Use our custom hook to fetch all available billboards
  const { availableBillboards, loading: billboardsLoading, error: billboardsError } = useAvailableBillboards();
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());

  // Billboard search and dropdown state
  const [billboardSearchTerm, setBillboardSearchTerm] = useState("");
  const [isBillboardDropdownOpen, setIsBillboardDropdownOpen] = useState(false);

  // Filtered billboards based on search term
  const filteredBillboards = availableBillboards?.filter((billboard) => {
    if (!billboardSearchTerm) return true;
    
    const searchLower = billboardSearchTerm.toLowerCase();
    return (
      billboard.billboardName.toLowerCase().includes(searchLower) ||
      billboard.address.toLowerCase().includes(searchLower) ||
      billboard.state.toLowerCase().includes(searchLower) ||
      billboard.internalCode.toLowerCase().includes(searchLower) ||
      billboard.serialNumber.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.billboard-dropdown')) {
        setIsBillboardDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [duration, setDuration] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("");
  const [paymentPeriod, setPaymentPeriod] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { user } = useContext(UserContext);
  const [selectedBillboard, setSelectedBillboard] = useState<AvailableBillboard>();
  // const [duration, setDuration] = useState<string>("")
  const [orders, setOrders] = useState<any[]>([]);
 
  const [file, setFile] = useState<File | null>(null);

  const validationSchema = yup.object().shape({
    // company_name: yup.string().required("Company Name is required"),
    // company_email: yup.string().email("Invalid email format"),
    // company_phone: yup.string().required("Company Phone Number is required"),
    // contact_person_name: yup
    //   .string()
    //   .required("Contact Person Name is required"),
    // contact_person_email: yup.string().email("Invalid email format"),
    // contact_person_phone: yup
    //   .string()
    //   .required("Contact Person Phone Number is required"),
    // client_type: yup.string().required("Client Type is required"),
    // state: yup.string().required("State is required"),
    // lga: yup.string().required("LGA is required"),
    // company_address: yup.string().required("Company Address is required"),
    // brand_industry: yup.string().required("Brand Industry is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const [formData, setFormData] = useState({
    billboard_id: "",
    billboard_type: "",
    orientation: "",
    slotOrFace: "",
    // slot: "",
    // face: "",
    start_date: "",
    end_date: "",
    actual_amount: 0,
    billboard_price_per_day: 0,
 
  });

  


  // State for order-level details
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    client_id: "",
    campaign_name: "",
    campaign_duration: 0,
    campaign_start_date: "",
    campaign_end_date: "",
    payment_due_date: "",
    payment_option: "",
    media_purchase_order: null,
    total_order_amount: 0,
    discount_order_amount: 0,
    description: "",
  });

  const [billboards, setBillboards] = useState<any[]>([]); // List of billboards in the order
  const [usedSlotsFaces, setUsedSlotsFaces] = useState<Record<string, string[]>>({});
  const [mediaPurchaseOrder, setMediaPurchaseOrder] = useState<File | null>(null);


  useEffect(() => {
    // Split the date range when it updates
    if (dateRange) {
      const [start, end] = dateRange.split(" - ");
      setStartDate(start);
      setEndDate(end);
    }
  }, [dateRange]);

  useEffect(() => {
    if (startDate && endDate ) {
    

      const numberOfDays = calculateNumberOfDays(startDate, endDate);

      const campaignDuration = numberOfDays;
      const campaignStartDate = startDate;
      const campaignEndDate = endDate;

      setOrderDetails((prev) => ({...prev, 
        campaign_duration: campaignDuration,

        campaign_start_date: campaignStartDate,
        campaign_end_date: campaignEndDate,
    
      }));

      if ( formData.billboard_id ){
        const selectedBillboard = availableBillboards.find(
          (b) => b.id == formData.billboard_id
        );

        if (selectedBillboard) {
          // const numberOfDays = calculateNumberOfDays(startDate, endDate);
          const actualAmount =  numberOfDays * selectedBillboard.pricePerDay
         
          setFormData((prev) => ({
            ...prev,
            actual_amount: actualAmount,
            start_date: startDate,
            end_date: endDate,
          }));
          // setDuration(campaignDuration);       
  
        }
      }


   
    }
  }, [startDate, endDate, formData.billboard_id, availableBillboards]);


  useEffect(() => {
    if (orderDetails?.payment_option === "prepaid" && paymentPeriod) {
    
      setOrderDetails((prev) => ({...prev, 
        payment_due_date: paymentPeriod,
    
      }));
   
    }
  }, [paymentPeriod]);


  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  };



const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setFile(e.target.files[0]);
  }
};

  
   // Handle order-level field changes
   const handleOrderDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

   // Get available slots/faces for the selected billboard
   const availableSlotsFaces = (billboardId: string, type: string) => {
    const billboard = availableBillboards.find((b) => b.id === billboardId);
    if (!billboard) return [];

    const used = usedSlotsFaces[billboardId] || [];
    const total = type === "digital" ? billboard.available_slots : billboard.available_faces;

    return Array.from({ length: Number(total) }, (_, i) => {
      const slotOrFace = type === "Digital" ? `Slot ${i + 1}` : `Face ${i + 1}`;
      return {
        value: slotOrFace,
        isUsed: used.includes(slotOrFace),
      };
    });
  };

  const handleAddBilboard = () => {
    // Validate required fields
    if (
      !formData.billboard_id ||
      !formData.billboard_type ||
      !formData.orientation ||
      !formData.start_date ||
      !formData.end_date  ||
      !formData.slotOrFace
      
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Add the current form data to the billboard list
    // setOrders((prev) => [...prev, formData]);
    setBillboards((prev) => [...prev, formData]);

    // Reset the form (optional)
    setFormData({
      billboard_id: "",
      billboard_type: "",
      orientation: "",
      slotOrFace: "",
      // slot: "",
      // face: "",
      start_date: "",
      end_date: "",
      billboard_price_per_day: 0,
      actual_amount: 0,
    });

    // // Mark the selected slot/face as used
    // setUsedSlotsFaces((prev) => ({
    //   ...prev,
    //   [formData.billboard_id]: [...(prev[formData.billboard_id] || []), formData.slotOrFace],
    // }));
console.log(formData);
      // Update the used slots and faces
    setUsedSlotsFaces((prev) => {
      const updated = { ...prev };
      if (formData.billboard_type === "digital") {
        updated[formData.billboard_id] = [...(updated[formData.billboard_id] || []), formData.slotOrFace];
      } else {
        updated[formData.billboard_id] = [...(updated[formData.billboard_id] || []), formData.slotOrFace];
      }
      return updated;
    });

    console.log(formData);


    // Clear the selected billboard
    setSelectedBillboard(undefined);
  };



  // Handle billboard selection
  const handleBillboardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const billboardId = e.target.value;
    const selectedBillboard = availableBillboards.find((b) => b.id == billboardId);
    // console.log(typeof(selectedBillboard));
    setFormData((prev) => ({
      ...prev,
      billboard_id: billboardId,
      billboard_type: selectedBillboard?.billboardType || "",
      orientation: selectedBillboard?.orientation || "",

      billboard_price_per_day: selectedBillboard?.pricePerDay || 0,
    }));
    if (selectedBillboard) {
      setSelectedBillboard(selectedBillboard);
    }
  };

  

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const files = Array.from(e.target.files).slice(0, 10); // Limit to 10 files
  //     setFormData((prev) => ({ ...prev, images: files }));
  //   }
  // };


  const calculateNumberOfDays = (
    startDate: string,
    endDate: string
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
  };

  // console.log(formData);

  const handleSubmitOrder = async (data: any) => {
    // Prepare the payload

      if (
        !orderDetails.client_id ||
        !orderDetails.campaign_name ||
        !orderDetails.payment_option ||
        // !orderDetails.media_purchase_order ||
        !orderDetails.campaign_start_date ||
        !orderDetails.campaign_end_date ||
        !orderDetails.campaign_duration ||
        billboards.length === 0 ||
        !mediaPurchaseOrder
      ) {
        alert("Please fill all order informations");
        return;
      }


  const formData = new FormData();

  if (mediaPurchaseOrder) {
    formData.append("media_purchase_order", mediaPurchaseOrder);
  }

   

         // Prepare the payload
    const payload = {
      ...orderDetails,
      billboards,
      // media_purchase_order: mediaPurchaseOrder,
      // total_order_amount : billboards.reduce((acc, item) => acc + item.actual_amount, 0),
      total_order_amount: parseFloat(
        billboards.reduce((acc, item) => acc + item.actual_amount, 0).toFixed(2)
      )
    };

    // console.log(payload)
        // Submit the order
        onSubmit(payload, formData);

     
         // Clear the state and close the modal
    setBillboards([]);
    setUsedSlotsFaces({});
    setOrderDetails({
      client_id: "",
      campaign_name: "",
      campaign_duration: 0,
      campaign_start_date: "", 
      campaign_end_date: "", 
      payment_due_date: "",
      payment_option: "",
      media_purchase_order: null,
      total_order_amount: 0,
      discount_order_amount: 0,
      description: "",
    });

    // onClose();
  };


  console.log(availableBillboards);

console.log(selectedBillboard)
  if (!isOpen) return null;

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        initialFocus={sendButtonRef}
        className="flex place-self-center lg:items-center lg:justify-center  "
        size="lg"
      >
        <Dialog.Panel className=" max-h-[95vh] overflow-y-auto ">
          <Dialog.Title className="border-slate-200 ">
            <div className="flex justify-center items-center lg:text-xl font-bold ">
              <div>Create New Campaign Order</div>
            </div>
          </Dialog.Title>

          <Dialog.Description className="grid grid-cols-12  gap-y-3  ">
            <form
              onSubmit={handleSubmit(handleSubmitOrder)}
              className="col-span-12 rounded-lg w-full max-w-2xl  md:p-4 space-y-8 "
            >

              {/* Billboard selection Section */}

              <div className="col-span-12   ">
                <div className="col-span-12  flex justify-center items-center lg:space-x-8 space-x-2">
                  <div className="w-full relative">
                    <FormLabel
                      className="text-xs font-medium lg:text-[16px] text-black"
                      htmlFor="duration"
                    >
                      Campaign Duration
                    </FormLabel>

                    <Litepicker
                      id="campaign-duration"
                      // value={`${orderToEdit?.campaign_start_date} - ${orderToEdit?.campaign_end_date}`}
                      // onChange={setDaterange}
                      value={dateRange}
                      onChange={setDateRange}
                    
                      options={{
                        singleMode: false,
                        numberOfMonths: 3, // 2–3 is ideal for UX
                        numberOfColumns: 2,
                        allowRepick: true,
                        selectForward: true, // <- this prevents auto-adjusting issue
                        showWeekNumbers: true,
                        // minDate: "",
                        // maxDays: 20,
                        autoApply: false,
                        dropdowns: {
                          minYear: 1999,
                          maxYear: null,
                          months: true,
                          years: true,
                        },
                        // format: "YYYY-MM-DD"
                      }}

                      // options={{
                      //   autoApply: false,
                      //   singleMode: false,
                      //   numberOfColumns: 2,
                      //   numberOfMonths: 6,
                      //   allowRepick: true, // allows user to change date range easily
                      //   // autoApply: false,  // only apply when user confirms (optional)
                      //   // numberOfMonths: 2
                      //   showWeekNumbers: true,
                      //   selectForward: true, // <- this prevents auto-adjusting issue
                      //   // minDate: null,
                      //   // maxDays: null,
                      //   dropdowns: {
                      //     minYear: 1999,
                      //     maxYear: null,
                      //     months: true,
                      //     years: true,
                      //   },
                      // }}
                      className="block py-3 pl-8 mx-auto"
                    />
                    <div className="absolute flex items-center justify-center  bottom-4 left-2  text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                  </div>
                  <div className=" w-full relative ">
                    <FormLabel
                      className="font-medium text-xs lg:text-[16px] text-black"
                      htmlFor="duration"
                    >
                      Number of Days
                    </FormLabel>
                    <FormInput
                      formInputSize="lg"
                      type="text"
                      name="numberOfDays"
                      value={ `${orderDetails.campaign_duration} Days`}
                      readOnly
                      className="w-full text-sm pl-10 border rounded bg-gray-100 cursor-not-allowed"
                    />

                    <div className="absolute flex items-center justify-center w-8  h-8 left-0 bottom-1  text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* select billboard */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="billboard_id"
                >
                  Billboard Name
                </FormLabel>
                
                {/* Searchable Billboard Dropdown */}
                <div className="relative billboard-dropdown">
                  <div className="relative">
                                      <input
                    type="text"
                    placeholder="Search billboards..."
                    value={billboardSearchTerm}
                    onChange={(e) => setBillboardSearchTerm(e.target.value)}
                    onFocus={() => setIsBillboardDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsBillboardDropdownOpen(false);
                      }
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-customColor focus:border-transparent outline-none"
                  />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Lucide 
                        icon={isBillboardDropdownOpen ? "ChevronUp" : "ChevronDown"} 
                        className="w-5 h-5 text-slate-400" 
                      />
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isBillboardDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {/* Loading State */}
                      {billboardsLoading && (
                        <div className="px-4 py-3 text-slate-500 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <LoadingIcon icon="oval" className="w-4 h-4" />
                            <span>Loading billboards...</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Error State */}
                      {billboardsError && !billboardsLoading && (
                        <div className="px-4 py-3 text-red-500 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Lucide icon="AlertCircle" className="w-4 h-4" />
                            <span>{billboardsError}</span>
                          </div>
                        </div>
                      )}

                      {/* Search Results */}
                      {!billboardsLoading && !billboardsError && (
                        <>
                          {filteredBillboards.length > 0 ? (
                            filteredBillboards.map((billboard) => {
                              const isDisabled = 
                                (billboard.billboardType === "digital" && billboard?.available_slots?.length < 1) ||
                                (billboard.billboardType === "static" && billboard?.available_faces?.length < 1);
                              
                              return (
                                <div
                                  key={billboard.id}
                                  onClick={() => {
                                    if (!isDisabled) {
                                      handleBillboardChange({
                                        target: { value: billboard.id }
                                      } as React.ChangeEvent<HTMLSelectElement>);
                                      setBillboardSearchTerm(billboard.billboardName);
                                      setIsBillboardDropdownOpen(false);
                                    }
                                  }}
                                  className={`px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-b-0 ${
                                    isDisabled 
                                      ? 'opacity-50 cursor-not-allowed bg-slate-100' 
                                      : 'hover:bg-slate-50'
                                  } ${
                                    formData.billboard_id === billboard.id ? 'bg-customColor/10 border-l-4 border-l-customColor' : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="font-medium text-slate-900">
                                        {billboard.billboardName}
                                      </div>
                                                                        <div className="text-sm text-slate-600 mt-1">
                                    {billboard.address.length > 30 ? `${billboard.address.substring(0, 30)}...` : billboard.address} • {billboard.state}
                                  </div>
                                    </div>
                                    <div className="text-right ml-2">
                                      <div className={`text-xs px-2 py-1 rounded-full ${
                                        billboard.billboardType === "digital" 
                                          ? 'bg-blue-100 text-blue-700' 
                                          : 'bg-green-100 text-green-700'
                                      }`}>
                                        {billboard.billboardType}
                                      </div>
                                      <div className="text-xs text-slate-500 mt-1">
                                        {billboard.billboardType === "digital"
                                          ? `${billboard?.available_slots?.length || 0}/${billboard?.numberOfSlotsOrFaces} slots`
                                          : `${billboard?.available_faces?.length || 0}/${billboard?.numberOfSlotsOrFaces} faces`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="px-4 py-3 text-slate-500 text-center">
                              {billboardSearchTerm ? 'No billboards found' : 'No billboards available'}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Selected Billboard Display */}
                  {formData.billboard_id && selectedBillboard && (
                    <div className="mt-2 p-3 bg-customColor/5 border border-customColor/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900">
                            {selectedBillboard.billboardName}
                          </div>
                          <div className="text-sm text-slate-600">
                            {selectedBillboard.address.length > 30 ? `${selectedBillboard.address.substring(0, 30)}...` : selectedBillboard.address} • {selectedBillboard.state}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setFormData(prev => ({ ...prev, billboard_id: "" }));
                            setSelectedBillboard(undefined);
                            setBillboardSearchTerm("");
                          }}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <Lucide icon="X" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {errors.billboard_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.billboard_id.message?.toString()}
                  </p>
                )}
              </div>

                  {/* billboard type */}
              {formData?.billboard_type && (
                <>
                  <div className="col-span-12">
                    <FormLabel
                      className="font-medium lg:text-[16px] text-black"
                      htmlFor="billboardType"
                    >
                      Type
                    </FormLabel>
                    <FormSelect
                      id="billboardType"
                      formSelectSize="lg"
                      value={formData?.billboard_type}
                      className="w-full "
                      disabled
                    >
                      <option value="">
                        {formData?.billboard_type}
                      </option>
                    </FormSelect>
                  </div>

                

                  
                </>
              )}

              {/* Billboard Orientation  */}

             {formData?.orientation && ( <div className="col-span-12">
                    <FormLabel
                      className="font-medium lg:text-[16px] text-black"
                      htmlFor="orientation"
                    >
                      Orientation
                    </FormLabel>
                    <FormSelect
                      id="orientation"
                      formSelectSize="lg"
                      value={formData?.orientation}
                      className="w-full "
                      disabled
                    >
                      <option value="">{formData?.orientation}</option>
                    </FormSelect>
              </div>)}

               {/* Billboard price  */}
      {formData.billboard_price_per_day > 0 && (      <div className="col-span-12">
              <FormLabel  className="font-medium lg:text-[16px] text-black">Billboard Price/Day</FormLabel>
              <FormInput
              formInputSize="lg"
                type="number"
                name="actualAmount"
                value={formData.billboard_price_per_day}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>)}

                {/* Slot or Face Selection */}
              {formData?.billboard_type && (
                <div className="">
                    <FormLabel
                      className="font-medium lg:text-[16px] text-black"
                      htmlFor="client_type"
                    >
                      {formData?.billboard_type === "digital"
                        ? " Slot Placement"
                        : "Face Placement"}
                    </FormLabel>

                    <FormSelect
                      formSelectSize="lg"
                      name="slotOrFace"
                    
                      value={
                        formData?.slotOrFace}
                      onChange={handleChange}
                      // {...register("slot_or_face")}
                      className="w-full "
                    >
                      <option value="">
                        --Select--
                        {/* {selectedBillboard.billboardType === "digital" ? "Slot" : "Face"} */}
                      </option>
                      {/* {selectedBillboard?.billboardType === "digital"
                        ? selectedBillboard?.available_slots.map((slot) => (
                            <option key={slot} value={slot}>
                              Slot {slot}
                            </option>
                          )) || []
                        : selectedBillboard?.available_faces.map((face) => (
                            <option key={face} value={face}>
                              Face {face}
                            </option>
                          )) || []} */}
                            {formData.billboard_type === "digital"
    ? selectedBillboard?.available_slots
        .filter(slot => !usedSlotsFaces[selectedBillboard?.id]?.includes(slot.toString())) // Filter used slots
        .map(slot => (
          <option key={slot} value={slot}>Slot {slot}</option>
        ))
    : selectedBillboard?.available_faces
        .filter(face => !usedSlotsFaces[selectedBillboard?.id]?.includes(face.face_number.toString())) // Filter used faces
        .map(face => (
          <option key={face.face_number} value={face.face_number}>Face {face.face_number}{face.description? ' -' : ''} {face.description}</option>
        ))


        
  }
                    </FormSelect>
                </div>
              )}  


              {/* campaign dates */}
              {/* <div className="col-span-12   ">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="duration"
                >
                  Campaign Duration
                </FormLabel>
                <div className="col-span-12  flex justify-center items-center space-x-4">
                  <div className="w-full relative">
                    <FormLabel htmlFor="modal-datepicker-1">Start</FormLabel>
                    <Litepicker
                      id="campaign-duration"
                      value={startDate}
                      onChange={setStartDate}
                      options={{
                        autoApply: false,
                        showWeekNumbers: true,
                        dropdowns: {
                          minYear: 1990,
                          maxYear: null,
                          months: true,
                          years: true,
                        },
                      }}
                    />
                    <div className="absolute flex items-center justify-center w-8  h-8 right-0 bottom-1  text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                  </div>
                  <div className=" w-full relative">
                    <FormLabel htmlFor="modal-datepicker-2">End</FormLabel>
                    <Litepicker
                      id="modal-datepicker-2"
                      value={endDate}
                      onChange={setEndDate}
                      options={{
                        autoApply: false,
                        showWeekNumbers: true,
                        dropdowns: {
                          minYear: 1990,
                          maxYear: null,
                          months: true,
                          years: true,
                        },
                      }}
                    />
                    <div className="absolute flex items-center justify-center w-8  h-8 right-0 bottom-1  text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div> */}


              <div className="border-b border-slate-200 "></div>

{billboards.length > 0 && (
  <div className="col-span-12 flex flex-col gap-y-2">
    <h3 className="text-lg font-semibold ">Added Billboards</h3>
    {billboards.map((billboard, index) => (
      <div
        key={index}
        className="flex items-center lg:space-x-8 space-x-2  text-xs lg:text-sm p-2 lg:p-4 bg-primary text-customColor rounded-2xl "
      >
        <div className="w-full ">
          <div className="text-sm md:text-[16px] text-black font-semibold mb-2">
            {
              availableBillboards.find((b) => b.id == billboard.billboard_id)
                ?.billboardName
            }
          </div>
          <div className="flex space-x-2 text-xs capitalize ">
            <div className="bg-violet-200 text-violet-600 p-0.5">
              {
                availableBillboards.find((b) => b.id == billboard.billboard_id)
                  ?.orientation
              }
            </div>
            <div className="bg-blue-100 text-blue-600 p-0.5">
              {
                availableBillboards.find((b) => b.id == billboard.billboard_id)
                  ?.billboardType
              }
            </div>
            <div className="bg-orange-100 text-orange-500 p-0.5">
              {billboard.billboard_type === "digital"
                ? `Slot ${billboard.slotOrFace}`
                : `Face ${billboard.slotOrFace} `}
            </div>
          </div>
        </div>

        <div className="flex lg:w-full w-1/3 justify-end items-center space-x-2">
          <div className="lg:text-lg text-xs text-customColor font-semibold">
          <div className="text-slate-500 lg:text-sm text-xs">
              campaign cost
            </div>
            &#x20A6;{formatCurrency(billboard.actual_amount)}
            
          </div>
          <button
            onClick={() => {
              setBillboards((prev) => prev.filter((_, i) => i !== index));

              setUsedSlotsFaces((prev) => {
                const billboardId = billboard.billboard_id; // Correct key reference
                const updatedSlotsFaces = prev[billboardId]
                  ?.filter((slotOrFace) => slotOrFace !== String(billboard.slot || billboard.face)) || [];
          
                return {
                  ...prev,
                  [billboardId]: updatedSlotsFaces.length > 0 ? updatedSlotsFaces : undefined, // Remove key if empty
                };
              });
            }}
            className="  hover:bg-white text-customColor hover:text-white rounded-lg w-5 h-5 flex items-center justify-center"
          >
            {/* &times; */}
            <Lucide icon="X" className="text-red-600" />
          </button>
        </div>


      </div>
    ))}
  </div>
)}

{/* Add billboard button */}
<             Button
                  disabled={isLoading}
                  variant="primary"
                  type="button"
                  className="w-auto text-sm bg-white md:text-[16px] font-semibold border-customColor text-customColor"
                  ref={sendButtonRef}
                  onClick={handleAddBilboard}

                  // onClick={handleSubmit((data) => {
                  //   onSubmit(data);
                  //   onClose();
                  // })}
                >
                  <Lucide icon="Plus" className="w-4 h-4 mr-1" />

                  <div className="  text-center">Add Billboard</div>
                </Button>

                <div className="border-b border-slate-200"></div>

                  {/* Order data section */}

                {/* select client */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="client_type"
                >
                  Client
                </FormLabel>
                <FormSelect
                  name="client_id"
                  value={orderDetails.client_id}
                  onChange={handleOrderDetailsChange}
                  formSelectSize="lg"
                  // {...register("client", {
                  //   onChange: (e) => {
                  //     handleChange(e);
                  //   },
                  // })}
                  className="w-full"
                >
                  <option value="" disabled>
                    --Select--
                  </option>
                  {clients?.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company_name}
                    </option>
                  ))}
                </FormSelect>
                {errors.client_type && (
                  <p className="text-red-500">
                    {errors.client_type.message?.toString()}
                  </p>
                )}
              </div>


              {/* campaign name */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="campaign_name "
                >
                  Campaign Name
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="campaign_name"
                  type="text"
                  value={orderDetails.campaign_name}
                  name="campaign_name"
                  onChange={handleOrderDetailsChange}
                  placeholder="Type here"
                  required
                  // {...register("campaign_name")}
                />
               
              </div>

              {/* paymentt option */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="payment_option"
                >
                  Payment Option
                </FormLabel>
                <FormSelect
                  name="payment_option"
                  value={orderDetails.payment_option}
                  onChange={handleOrderDetailsChange}
                  formSelectSize="lg"
                  // {...register("payment_option")}

                  className="w-full"
                >
                  <option value="" selected disabled>
                    --Select--
                  </option>
                  <option value="prepaid">Upfront</option>
                  <option value="postpaid">Postpaid</option>
                </FormSelect>

                {errors.payment_option && (
                  <p className="text-red-500">
                    {errors.payment_option.message?.toString()}
                  </p>
                )}
              </div>   


              {orderDetails?.payment_option === 'prepaid' && (
               

<div className="col-span-12 relative">
<FormLabel className="lg:text-[16px]" htmlFor="dob">Payment Date</FormLabel>
<Litepicker
  id="dob"
  value={paymentPeriod}
 
  // onChange={setDateOfBirth}

  onChange={setPaymentPeriod}
  
  
  options={{
    autoApply: false,
    showWeekNumbers: true,
    dropdowns: {
      minYear: new Date().getFullYear(),
      maxYear: new Date().getFullYear() + 1,
      months: true,
      years: true,
    },
  }}
/>
<div className="absolute flex items-center justify-center w-8 h-8 right-0 bottom-1 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
  <Lucide icon="Calendar" className="w-4 h-4" />
</div>
</div>
              )}

                  {/* media purchase  uploaded as pdf */}
        

<PdfUploadSection
  uploadedPdf={mediaPurchaseOrder}
  setUploadedPdf={setMediaPurchaseOrder}
/>

              <div className="border-b border-slate-200"></div>

             

           

                  {/* description */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="contact_person_name"
                >
                  Description
                </FormLabel>
                <FormTextarea
                  // formTextareaSize="lg"
                  id="description"
                  name="description"
                  onChange={handleOrderDetailsChange}
                  placeholder="Add description..."
                />
              </div>


    <div className="border-b border-slate-200 my-2"></div>




              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="total_order_amount"
                >
                  Total Order Amount
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="actual_amount"
                  type="text"
                  name="total_order_amount"
                  readOnly
                  value={`₦${formatCurrency( billboards.reduce((acc, item) => acc + item.actual_amount, 0))}`}
                  placeholder="Type here"
                  // {...register("actual_amount")}
                />
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="discount_amount"
                >
                  Amount after Discount (Optional)
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="discount_order_amount"
                  type="number"
                  name="discount_order_amount"
                  onChange={handleOrderDetailsChange}
                  value={`${orderDetails.discount_order_amount}`}
                  placeholder="Type here"
                  // {...register("discount_amount")}
                />
                {errors.discount_order_amount && (
                  <p className="text-red-500">
                    {errors.discount_order_amount.message?.toString()}
                  </p>
                )}
              </div>


              <div className="flex flex-col lg:flex-row lg:space-x-2 gap-y-2 lg:gap-y-0 lg:text-lg text-sm">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={onClose}
                  className="lg:w-auto w-full mr-auto border-red-500 text-red-500"
                >
                  <Lucide icon="X" className="w-4 h-4 mr-1 " />
                  <div className=""> Cancel</div>
                </Button>

              

                <Button
                  disabled={isLoading}
                  variant="primary"
                  type="submit"
                  className="w-auto bg-customColor"
                  ref={sendButtonRef}
                  // onClick={handleSubmit((data) => {
                  //   onSubmit(data);
                  //   onClose();
                  // })}
                >
                  <Lucide icon="Plus" className="w-4 h-4 mr-1 " />

                  {isLoading ? (
                    <div className="flex items-center space-x-2 justify-end">
                      <LoadingIcon
                        icon="spinning-circles"
                        className="w-6 h-6"
                      />
                      <div className=" text-xs text-center">Creating...</div>
                    </div>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </Dialog.Description>

          <Dialog.Footer className="text-right">
         
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default OrderCreationModal;