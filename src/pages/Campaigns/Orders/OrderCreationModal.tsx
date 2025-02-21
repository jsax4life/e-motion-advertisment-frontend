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
  billboards: Billboard[];
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

interface Billboard {
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
  billboards,
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
  const [selectedBillboard, setSelectedBillboard] = useState<Billboard>();
  const [orders, setOrders] = useState<any[]>([]);
  const [usedSlotsFaces, setUsedSlotsFaces] = useState<Record<string, string[]>>({});
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
    client_id: "",
    billboard_id: "",
    campaign_name: "",
    campaign_duration: "",
    // billboard_type: "",
    slot: "",
    face: "",
    comment: "",
    // slot_or_face: "",
    start_date: "",
    end_date: "",
    payment_option: "",
    media_purchase_order: "",
    actual_amount: 0,
    discount_amount: 0,
  });

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
      const selectedBillboard = billboards.find(
        (b) => b.id == formData.billboard_id
      );
      if (selectedBillboard) {
        const numberOfDays = calculateNumberOfDays(startDate, endDate);
        const actualAmount = numberOfDays * selectedBillboard.pricePerDay;
        const campaignDuration = `${startDate}-${endDate}`;

        setFormData((prev) => ({
          ...prev,
          actual_amount: actualAmount,
          campaign_duration: campaignDuration,
          start_date: startDate,
          end_date: endDate,
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

  const handleAddOrder = () => {
    // Validate required fields
    if (
      !formData.client_id ||
      !formData.billboard_id ||
      !formData.campaign_name ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.payment_option ||
      !formData.media_purchase_order ||
      !formData.actual_amount ||
      !formData.campaign_duration
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Add the current form data to the orders list
    setOrders((prev) => [...prev, formData]);

    // Reset the form (optional)
    setFormData({
      client_id: "",
      billboard_id: "",
      campaign_name: "",
      campaign_duration: "",
      // billboard_type: "",
      slot: "",
      face: "",
      comment: "",
      start_date: "",
      end_date: "",
      payment_option: "",
      media_purchase_order: "",
      actual_amount: 0,
      discount_amount: 0,
    });
  };

  // Handle billboard selection
  const handleBillboardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const billboardId = e.target.value;
    const selectedBillboard = billboards.find((b) => b.id == billboardId);
    // console.log(typeof(selectedBillboard));
    setFormData((prev) => ({
      ...prev,
      billboard_id: billboardId,
      // billboard_type: selectedBillboard?.billboardType || "",
      actual_amount: selectedBillboard?.pricePerDay || 0,
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

    // If no orders are added, treat it as a single order
    if (orders.length === 0) {
      // Validate required fields
      if (
        !formData.client_id ||
        !formData.billboard_id ||
        !formData.campaign_name ||
        !formData.start_date ||
        !formData.end_date ||
        !formData.payment_option ||
        !formData.media_purchase_order ||
        !formData.actual_amount ||
        !formData.campaign_duration
      ) {
        alert("No orders to create.");
        return;
      }

      // Submit the single order
      onSubmit([formData]);
    } else {
      // Submit all orders
      onSubmit(orders);
    }

    setOrders([]);
    setFormData({
      client_id: "",
      billboard_id: "",
      campaign_name: "",
      campaign_duration: "",
      // billboard_type: "",
      slot: "",
      face: "",
      comment: "",
      start_date: "",
      end_date: "",
      payment_option: "",
      media_purchase_order: "",
      actual_amount: 0,
      discount_amount: 0,
    });
    // onClose();
  };

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
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="client_type"
                >
                  Client
                </FormLabel>
                <FormSelect
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
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

              <div className="border-b border-slate-200"></div>

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
                  name="campaign_name"
                  onChange={handleChange}
                  placeholder="Type here"
                  required
                  // {...register("campaign_name")}
                />
                {errors.campaign_name && (
                  <p className="text-red-500">
                    {errors.campaign_name.message?.toString()}
                  </p>
                )}
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
                  value={formData.payment_option}
                  onChange={handleChange}
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
                  {billboards.map((billboard) => (
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

              {/* campaign duration */}
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

              <div className="border-b border-slate-200 my-2"></div>

              {orders.length > 0 && (
                <div className="col-span-12 flex flex-col gap-y-2">
                  <h3 className="text-lg font-semibold ">Order Summary</h3>
                  {orders.map((order, index) => (
                    <div
                      key={index}
                      className="flex items-center lg:space-x-8 space-x-2  text-xs lg:text-sm p-2 lg:p-4 bg-primary text-customColor rounded-2xl "
                    >
                      <div className="w-full ">
                        <div className="text-sm md:text-[16px] text-black font-semibold mb-2">
                          {
                            billboards.find((b) => b.id == order.billboard_id)
                              ?.billboardName
                          }
                        </div>
                        <div className="flex space-x-2 text-xs capitalize ">
                          <div className="bg-violet-200 text-violet-600 p-0.5">
                            {
                              billboards.find((b) => b.id == order.billboard_id)
                                ?.orientation
                            }
                          </div>
                          <div className="bg-blue-100 text-blue-600 p-0.5">
                            {
                              billboards.find((b) => b.id == order.billboard_id)
                                ?.billboardType
                            }
                          </div>
                          <div className="bg-orange-100 text-orange-500 p-0.5">
                            {order.slot
                              ? `Slot ${order.slot}`
                              : `Face ${order.face} `}
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:w-full w-1/3 justify-end items-center space-x-2">
                        <div className="lg:text-lg text-xs text-customColor font-semibold">
                          &#x20A6;{formatCurrency(order.actual_amount)}{" "}
                          <span className="text-slate-500 lg:text-sm text-xs">
                            full cost
                          </span>{" "}
                        </div>
                        <button
                          onClick={() => {
                            setOrders((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="  hover:bg-white text-customColor hover:text-white rounded-lg w-5 h-5 flex items-center justify-center"
                        >
                          {/* &times; */}
                          <Lucide icon="X" className="text-red-600" />
                        </button>
                      </div>

                      {/* <p><strong>Client:</strong> {clients.find((c) => c.id === order.client_id)?.company_name}</p>
        <p><strong>Billboard:</strong> {billboards.find((b) => b.id === order.billboard_id)?.billboardName}</p>
        <p><strong>Campaign Name:</strong> {order.campaign_name}</p>
        <p><strong>Duration:</strong> {order.start_date} to {order.end_date}</p>
        <p><strong>Amount:</strong> ${order.actual_amount}</p>
        <button
          type="button"
          onClick={() => {
            setOrders((prev) => prev.filter((_, i) => i !== index));
          }}
          className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Remove
        </button> */}
                    </div>
                  ))}
                </div>
              )}

              {selectedBillboard?.billboardType && (
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
                      value={selectedBillboard?.billboardType}
                      className="w-full "
                      disabled
                    >
                      <option value="">
                        {selectedBillboard?.billboardType}
                      </option>
                    </FormSelect>
                  </div>

                  <div className="col-span-12">
                    <FormLabel
                      className="font-medium lg:text-[16px] text-black"
                      htmlFor="orientation"
                    >
                      Orientation
                    </FormLabel>
                    <FormSelect
                      id="orientation"
                      formSelectSize="lg"
                      value={selectedBillboard?.orientation}
                      className="w-full "
                      disabled
                    >
                      <option value="">{selectedBillboard?.orientation}</option>
                    </FormSelect>
                  </div>

                  {/* Slot or Face Selection */}

                  <div className="">
                    <FormLabel
                      className="font-medium lg:text-[16px] text-black"
                      htmlFor="client_type"
                    >
                      {selectedBillboard.billboardType === "digital"
                        ? " Slot Placement"
                        : "Face Placement"}
                    </FormLabel>

                    <FormSelect
                      formSelectSize="lg"
                      name={`${
                        selectedBillboard.billboardType === "digital"
                          ? "slot"
                          : "face"
                      }`}
                      value={`${
                        selectedBillboard.billboardType === "digital"
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
                      {selectedBillboard.billboardType === "digital"
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
                </>
              )}

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
                  name="media_purchase_order"
                  onChange={handleChange}
                  placeholder="Type here"
                  // {...register("media_purchase_order")}
                />
                {errors.media_purchase_order && (
                  <p className="text-red-500">
                    {errors.media_purchase_order.message?.toString()}
                  </p>
                )}
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="contact_person_name"
                >
                  Comment
                </FormLabel>
                <FormTextarea
                  formTextareaSize="lg"
                  id="comment"
                  name="comment"
                  onChange={handleChange}
                  placeholder="Add comment..."
                />
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="actual_amount"
                >
                  Amount
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="actual_amount"
                  type="text"
                  name="actual_amount"
                  readOnly
                  value={`₦${formatCurrency(formData.actual_amount)}`}
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
                  value={`${formData.discount_amount}`}
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
                  type="button"
                  className="w-auto text-sm bg-white md:text-[16px] font-semibold border-customColor text-customColor"
                  ref={sendButtonRef}
                  onClick={handleAddOrder}

                  // onClick={handleSubmit((data) => {
                  //   onSubmit(data);
                  //   onClose();
                  // })}
                >
                  <Lucide icon="Plus" className="w-4 h-4 mr-1" />

                  <div className="  text-center">Add Billboard</div>
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
