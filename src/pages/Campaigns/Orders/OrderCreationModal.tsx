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
import { formatCurrency } from "../../../utils/utils";

interface BillboardCreationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  clients: Client[];
  availableBillboards: AvailableBillboard[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface StateData {
  name: string;
  lgas: string[];
}

interface Client {
  id: string;
  company_name: string;
}

interface BillboardOrder {
  id: string;
  name: string;
  type: "Static" | "Digital" | "Bespoke";
  slotsAvailable: number;
  facesAvailable: number;
  price: number;
}

// !formData.client_id ||
// !formData.billboard_id ||
// !formData.campaign_name ||
// !formData.start_date ||
// !formData.end_date ||
// !formData.payment_option ||
// !formData.media_purchase_order ||
// !formData.actual_amount ||
// !formData.campaign_duration

interface AvailableBillboard {
  id: string;
  serialNumber: string;
  internalCode: string;
  billboardName: string;
  billboardType: "static" | "digital" | "bespoke";
  numberOfSlots: number;
  numberOfFaces: number;
  pricePerDay: number;
  state: string;
  lga: string;
  address: string;
  geolocation: object;
  dimension: string; // Default dimension
  height: string;
  width: string;
  available_slots: number[];
  available_faces: number[];

  pricePerMonth: string;
  status: string;
  activeStatus: string;
  images: [];
  orientation: string;
}

const BillboardCreationModal: React.FC<BillboardCreationModalProps> = ({
  isOpen,
  isLoading,
  clients,
  availableBillboards,
  onClose,
  onSubmit,
}) => {
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());

  const [states, setStates] = useState<StateData[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [selectedBillboard, setSelectedBillboard] = useState<AvailableBillboard>();
  // const [duration, setDuration] = useState<string>("")
  const [orders, setOrders] = useState<any[]>([]);


  // const [clients, setClients] = useState<Client[]>([]);
  // const [billboards, setBillboards] = useState<Billboard[]>([]);

  // Fetch clients and billboards on page mount
  // useEffect(() => {
  //   // Mock API calls
  //   const fetchClients = async () => {
  //     const response = await fetch("/api/clients");
  //     const data = await response.json();
  //     setClients(data);
  //   };

  //   const fetchBillboards = async () => {
  //     const response = await fetch("/api/billboards");
  //     const data = await response.json();
  //     setBillboards(data);
  //   };

  //   fetchClients();
  //   fetchBillboards();
  // }, []);

  // console.log(startDate);
  // console.log(endDate);

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
    slot: "",
    face: "",
    start_date: "",
    end_date: "",
    actual_amount: 0,
    billboard_price_per_day: 0,
 
  });



  // State for order-level details
  const [orderDetails, setOrderDetails] = useState({
    client_id: "",
    campaign_name: "",
    campaign_duration: 0,
    campaign_start_date: "",
    campaign_end_date: "",
    payment_option: "",
    media_purchase_order: "",
    total_order_amount: 0,
    discount_order_amount: 0,
    description: "",
  });

  const [billboards, setBillboards] = useState<any[]>([]); // List of billboards in the order
  const [usedSlotsFaces, setUsedSlotsFaces] = useState<Record<string, string[]>>({});


  // Fetch states and LGAs from API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          "https://nigerian-states-and-lga.vercel.app/"
        );
        const data: StateData[] = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Failed to fetch states and LGAs:", error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (startDate && endDate && formData.billboard_id) {
      const selectedBillboard = availableBillboards.find(
        (b) => b.id == formData.billboard_id
      );
      if (selectedBillboard) {
        const numberOfDays = calculateNumberOfDays(startDate, endDate);
        const actualAmount =  numberOfDays * selectedBillboard.pricePerDay
       
        const campaignDuration = numberOfDays;
        const campaignStartDate = startDate;
        const campaignEndDate = endDate;

        setFormData((prev) => ({
          ...prev,
          actual_amount: actualAmount,
          start_date: startDate,
          end_date: endDate,
        }));
        // setDuration(campaignDuration);

        setOrderDetails((prev) => ({...prev, 
          campaign_duration: campaignDuration,

          campaign_start_date: campaignStartDate,
          campaign_end_date: campaignEndDate,
      
        }));

      }
    }
  }, [startDate, endDate, formData.billboard_id, billboards]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      !formData.end_date 
      
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
      slot: "",
      face: "",
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
        !orderDetails.media_purchase_order ||
        billboards.length === 0
      ) {
        alert("No orders to create.");
        return;
      }

         // Prepare the payload
    const payload = {
      ...orderDetails,
      billboards,
      total_order_amount : billboards.reduce((acc, item) => acc + item.actual_amount, 0),
    };

        // Submit the order
        onSubmit(payload);

        console.log(payload);
      
         // Clear the state and close the modal
    setBillboards([]);
    setUsedSlotsFaces({});
    setOrderDetails({
      client_id: "",
      campaign_name: "",
      campaign_duration: 0,
      campaign_start_date: "", 
      campaign_end_date: "", 
      payment_option: "",
      media_purchase_order: "",
      total_order_amount: 0,
      discount_order_amount: 0,
      description: "",
    });

    // onClose();
  };

//   console.log(formData)
// console.log(orderDetails)
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

          <Dialog.Description className="grid grid-cols-12  gap-y-3 max-h-[90vh] overflow-y-auto ">
            <form
              onSubmit={handleSubmit(handleSubmitOrder)}
              className="col-span-12 rounded-lg w-full max-w-2xl  md:p-4 space-y-8 "
            >

              {/* Billboard selection Section */}

              {/* select billboard */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="client_type"
                >
                  Billboard Name
                </FormLabel>
                <FormSelect
                  name="billboard_id"
                  onChange={handleBillboardChange}
                  formSelectSize="lg"
                  value={formData.billboard_id}

                  // {...register("bilboard_name", {
                  //   onChange: (e) => {
                  //     handleBillboardChange(e);
                  //   },
                  // })}
                  className="w-full"
                >
                  <option disabled selected value="">
                    --select--
                  </option>
                  {availableBillboards.map((billboard) => (
                    <option
                      key={billboard.id}
                      value={billboard.id}
                      disabled={
                        (billboard.billboardType === "digital" &&
                          billboard?.available_slots?.length < 1) ||
                        (billboard.billboardType === "static" &&
                          billboard?.available_faces?.length < 1)
                      }
                    >
                      {billboard.billboardName} (
                      {billboard.billboardType === "digital"
                        ? `${billboard?.available_slots?.length} of ${billboard?.numberOfSlots} slots available`
                        : `${billboard?.available_faces.length} of ${billboard?.numberOfFaces} faces available`}
                      )
                    </option>
                  ))}
                </FormSelect>
                {errors.client_type && (
                  <p className="text-red-500">
                    {errors.client_type.message?.toString()}
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
            <div className="col-span-12">
              <FormLabel  className="font-medium lg:text-[16px] text-black">Billboard Price/Day</FormLabel>
              <FormInput
              formInputSize="lg"
                type="number"
                name="actualAmount"
                value={formData.billboard_price_per_day}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

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
                      name={`${
                        formData?.billboard_type === "digital"
                          ? "slot"
                          : "face"
                      }`}
                      value={`${
                        formData?.billboard_type === "digital"
                          ? formData.slot
                          : formData.face
                      }`}
                      onChange={handleChange}
                      // {...register("slot_or_face")}
                      className="w-full "
                    >
                      <option value="">
                        --Select--
                        {/* {selectedBillboard.billboardType === "digital" ? "Slot" : "Face"} */}
                      </option>
                      {selectedBillboard?.billboardType === "digital"
                        ? selectedBillboard?.available_slots.map((slot) => (
                            <option key={slot} value={slot}>
                              Slot {slot}
                            </option>
                          )) || []
                        : selectedBillboard?.available_faces.map((face) => (
                            <option key={face} value={face}>
                              Face {face}
                            </option>
                          )) || []}
                    </FormSelect>
                </div>
              )}  


              {/* campaign dates */}
              <div className="col-span-12   ">
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
              </div>


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
              {billboard.slot
                ? `Slot ${billboard.slot}`
                : `Face ${billboard.face} `}
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
              setUsedSlotsFaces((prev) => ({
                ...prev,
                [billboard.billboardId]: prev[billboard.billboardId]?.filter(
                  (slotOrFace) => slotOrFace !== billboard.slotOrFace
                ),
              }));
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

                  {/* media purchase input */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="media_purchase_order"
                >
                  Media Purchase Order Document
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="media_purchase_order"
                  type="url"
                  value={orderDetails.media_purchase_order}
                  name="media_purchase_order"
                  onChange={handleOrderDetailsChange}
                  placeholder="Type here"
                  // {...register("media_purchase_order")}
                />
                {errors.media_purchase_order && (
                  <p className="text-red-500">
                    {errors.media_purchase_order.message?.toString()}
                  </p>
                )}
              </div>

                  {/* description */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="contact_person_name"
                >
                  Description
                </FormLabel>
                <FormTextarea
                  formTextareaSize="lg"
                  id="description"
                  name="description"
                  onChange={handleOrderDetailsChange}
                  placeholder="Add description..."
                />
              </div>


    <div className="border-b border-slate-200 my-2"></div>

{billboards.length > 0 && (
  <div className="col-span-12 flex flex-col gap-y-2">
    <h3 className="text-lg font-semibold ">Order Summary</h3>
    {/* {billboards.map((billboard, index) => (
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
              {billboard.slot
                ? `Slot ${billboard.slot}`
                : `Face ${billboard.face} `}
            </div>
          </div>
        </div>

        <div className="flex lg:w-full w-1/3 justify-end items-center space-x-2">
          <div className="lg:text-lg text-xs text-customColor font-semibold">
            &#x20A6;{formatCurrency(formData.actual_amount)}{" "}
            <span className="text-slate-500 lg:text-sm text-xs">
              campaign cost
            </span>{" "}
          </div>
          <button
            onClick={() => {
              setBillboards((prev) => prev.filter((_, i) => i !== index));
              setUsedSlotsFaces((prev) => ({
                ...prev,
                [billboard.billboardId]: prev[billboard.billboardId]?.filter(
                  (slotOrFace) => slotOrFace !== billboard.slotOrFace
                ),
              }));
            }}
            className="  hover:bg-white text-customColor hover:text-white rounded-lg w-5 h-5 flex items-center justify-center"
          >
            <Lucide icon="X" className="text-red-600" />
          </button>
        </div>


      </div>
    ))} */}
  </div>
)}


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
                  id="discount_amount"
                  type="text"
                  name="discount_amount"
                  onChange={handleChange}
                  value={`${orderDetails.discount_order_amount}`}
                  placeholder="Type here"
                  // {...register("discount_amount")}
                />
                {errors.discount_amount && (
                  <p className="text-red-500">
                    {errors.discount_amount.message?.toString()}
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
            {/* <Button
              type="button"
              variant="outline-secondary"
              onClick={onClose}
              className="w-20 mr-1 border-customColor text-customColor"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="button"
              className="lg:w-25 bg-customColor"
              ref={sendButtonRef}
              onClick={handleSubmit((data) => {
                onSubmit(data);
                onClose();
              })}
            >
              Apply Filter
            </Button> */}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default BillboardCreationModal;
