import React, { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, Disclosure } from "../../../base-components/Headless";
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
import { formatCurrency } from "../../../utils/utils";
import Litepicker from "../../../base-components/Litepicker";
import { PullBillboardContext } from "../../../stores/BillboardDataContext";
import { set } from "lodash";

interface OrderCreationModalProps {
  isOpen: boolean;
  orderToEdit?: Campaign; // Existing order data for editing

  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

type SlotsFacesResponse = {
  option: string[];
  value: number[];
};

interface Campaign {
  id: string;
  client_id: string;
  campaign_name: string;
  status: string;

  campaign_duration: number;
  campaign_start_date: string;
  campaign_end_date: string;
  total_order_amount: number;
  discount_order_amount: number;
  description: string;

  payment_option: string;
  media_purchase_order: string;
  billboards: any[];
}

const OrderEditingModal: React.FC<OrderCreationModalProps> = ({
  isOpen,
  isLoading,
  orderToEdit,
  onClose,
  onSubmit,
}) => {
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());
  const [updatedFields, setUpdatedFields] = useState({});
  const { billboards: availableBillboards, billboardDispatch } =
    useContext(PullBillboardContext);
  const [isAddingBillboard, setIsAddingBillboard] = useState(false);
  // State for billboard-specific form data
  const [formData, setFormData] = useState({
    billboard_id: "",
    billboard_type: "",
    orientation: "",
    // slot: "",
    // face: "",
    slotOrFace: "",

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
    status: "",
  });

  const [billboards, setBillboards] = useState<any[]>([]); // List of billboards in the order
  const [newlyAddedBillboards, setNewlyAddedBillboards] = useState<any[]>([]); // List of billboards in the order
  // State to track used slots/faces for each billboard
  const [usedSlotsFaces, setUsedSlotsFaces] = useState<
    Record<string, string[]>
  >({});

  const validationSchema = yup.object().shape({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });
  // Watch for changes in the form
  const watchedData = watch();

  //   useEffect(() => {
  //     setFormData(watchedData); // Update local state on change
  //   }, [watchedData]);
  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(watchedData)) {
      // Function to get only the updated fields

      const getUpdatedFields = (original: any, updated: any): Partial<any> => {
        let changes: Partial<any> = {};

        Object.keys(updated).forEach((key) => {
          if (original[key] !== updated[key]) {
            changes[key] = updated[key]; // Store only changed fields
          }
        });

        return changes;
      };

      const changes = getUpdatedFields(orderToEdit, watchedData as FormData);

      // Merge the new changes with the existing `updatedFields`
      setUpdatedFields(changes); // Store only changed fields

      // setFormData(watchedData); // Update the formData state
    }
  }, []);

  // Pre-fill the form if editing an existing order
  useEffect(() => {
    if (orderToEdit) {
      setOrderDetails({
        client_id: orderToEdit.client_id,
        campaign_name: orderToEdit.campaign_name,
        campaign_duration: orderToEdit.campaign_duration,
        campaign_start_date: orderToEdit.campaign_start_date,
        campaign_end_date: orderToEdit.campaign_end_date,
        payment_option: orderToEdit.payment_option,
        media_purchase_order: orderToEdit.media_purchase_order,
        total_order_amount: orderToEdit.total_order_amount,
        discount_order_amount: orderToEdit.discount_order_amount,
        description: orderToEdit.description,
        status: orderToEdit.status,
      });

      setBillboards(orderToEdit.billboards);

      // Mark used slots/faces
      const usedSlotsFacesMap: Record<string, string[]> = {};
      orderToEdit.billboards.forEach((billboard) => {
        if (!usedSlotsFacesMap[billboard.billboardId]) {
          usedSlotsFacesMap[billboard.billboardId] = [];
        }
        usedSlotsFacesMap[billboard.billboardId].push(billboard.slotOrFace);
      });
      setUsedSlotsFaces(usedSlotsFacesMap);
    }
  }, [orderToEdit]);

  // const calculateNumberOfDays = (
  //   startDate: string,
  //   endDate: string
  // ): number => {
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   const timeDifference = end.getTime() - start.getTime();
  //   return Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
  // };

  // Update the actual amount when dates or billboard changes
  useEffect(() => {
    if (formData.billboard_id && availableBillboards && orderToEdit) {
      const selectedBillboard = availableBillboards.find(
        (b: { id: string }) => b.id == formData.billboard_id
      );
      if (selectedBillboard) {
        // const numberOfDays = calculateNumberOfDays(startDate, endDate);
        const actualAmount =
          orderToEdit?.campaign_duration * selectedBillboard.pricePerDay;

        const campaignStartDate = orderToEdit?.campaign_start_date;
        const campaignEndDate = orderToEdit?.campaign_end_date;

        setFormData((prev) => ({
          ...prev,
          actual_amount: actualAmount,
          start_date: campaignStartDate,
          end_date: campaignEndDate,
        }));
      }
    }
  }, [formData.billboard_id, availableBillboards]);

  // Handle order-level field changes
  const handleOrderDetailsChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle billboard selection
  const handleBillboardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const billboardId = e.target.value;
    const selectedBillboard = availableBillboards.find(
      (b: { id: string }) => b.id == billboardId
    );
    setFormData((prev) => ({
      ...prev,
      billboard_id: billboardId,
      billboard_type: selectedBillboard?.billboardType || "",
      orientation: selectedBillboard?.orientation || "",

      billboard_price_per_day: selectedBillboard?.pricePerDay || 0,
    }));
    // if (selectedBillboard) {
    //   setSelectedBillboard(selectedBillboard);
    // }
  };

  console.log(orderToEdit);

  // Get available slots/faces for the selected billboard
  const availableSlotsFaces = (
    billboardId: string,
    type: string
  ): SlotsFacesResponse => {
    const billboard = availableBillboards.find(
      (b: { id: string }) => b.id == billboardId
    );
    if (!billboard) return { option: [], value: [] };

    const used = usedSlotsFaces[billboardId] || [];

    const total =
      type === "digital"
        ? billboard.available_slots
        : billboard.available_faces;

    const slotOrFaceUi = total
      .filter((slot: any) => !used?.includes(slot.toString())) // Filter used slots
      .map((slot: any) => {
        return `${type === "digital" ? "Slot" : "Face"} ${slot}`;
      });

    const slotOrFaceValue = total
      .filter((slot: any) => !used?.includes(slot.toString())) // Filter used slots
      .map((slot: any) => slot);

    return {
      option: slotOrFaceUi,
      value: slotOrFaceValue,
    };
  };

  console.log(orderDetails);
  console.log(availableBillboards);

  // console.log(availableSlotsFaces( formData.billboard_id,
  //   formData.billboard_type));

  const handleAddBilboard = () => {
    // console.log(formData);
    // Validate required fields
    if (
      !formData.billboard_id ||
      !formData.billboard_type ||
      !formData.orientation ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.slotOrFace
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Add the current form data to the billboard list
    // setOrders((prev) => [...prev, formData]);
    setBillboards((prev) => [...prev, formData]);
    setNewlyAddedBillboards((prev) => [...prev, formData]);

    // Reset the form (optional)
    setFormData({
      billboard_id: "",
      billboard_type: "",
      orientation: "",
      // slot: "",
      // face: "",
      start_date: "",
      end_date: "",
      slotOrFace: "",
      billboard_price_per_day: 0,
      actual_amount: 0,
    });

    // Mark the selected slot/face as used
    setUsedSlotsFaces((prev) => ({
      ...prev,
      [formData.billboard_id]: [
        ...(prev[formData.billboard_id] || []),
        formData.slotOrFace,
      ],
    }));

    // Update the used slots and faces
    // setUsedSlotsFaces((prev) => {
    //   const updated = { ...prev };
    //   if (formData.billboard_type === "digital") {
    //     updated[formData.billboard_id] = [...(updated[formData.billboard_id] || []), formData.slot];
    //   } else {
    //     updated[formData.billboard_id] = [...(updated[formData.billboard_id] || []), formData.face];
    //   }
    //   return updated;
    // });

    // Clear the selected billboard
    // setSelectedBillboard(undefined);
  };

  // console.log(billboards);

  // console.log(newlyAddedBillboards);
  // handdle submit order
  const handleSubmitOrder = async (data: any) => {
    console.log(orderDetails);
    // Prepare the payload
    const totalOrderAmount =
      Number(orderDetails.total_order_amount) +
      newlyAddedBillboards.reduce((acc, item) => acc + item.actual_amount, 0);

    if (
      !orderDetails.client_id ||
      !orderDetails.campaign_name ||
      !orderDetails.payment_option ||
      !orderDetails.media_purchase_order ||
      !orderDetails.total_order_amount ||
      billboards.length === 0
    ) {
      alert(
        "Please fill all required order fields and add at least one billboard."
      );
      return;
    }

    // Prepare the payload
    const payload = {
      ...orderDetails,
      billboards,
      id: orderToEdit?.id, // Include the order edited
      total_order_amount: billboards.reduce(
        (acc, item) => acc + Number(item.actual_amount),
        0
      ),
    };

    // Submit the order
    onSubmit(payload);

    console.log(payload);

    // Clear the state and close the modal
    setBillboards([]);
    setNewlyAddedBillboards([]);
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
      status: "",
    });

    // onClose();
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setValue(name, value); // Ensure React Hook Form tracks this change

    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //   console.log(billboard);

  // console.log(formData);

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
              <div>Modify Campaign Order</div>
            </div>
          </Dialog.Title>

          <Dialog.Description className="grid grid-cols-12  gap-y-3 max-h-[90vh] overflow-y-auto ">
            <form
              onSubmit={handleSubmit(handleSubmitOrder)}
              className="col-span-12 rounded-lg w-full max-w-2xl  md:p-4 space-y-8 "
            >
              {/* campaign dates */}
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
                      value={`${orderToEdit?.campaign_start_date} - ${orderToEdit?.campaign_end_date}`}
                      // onChange={setDaterange}
                      readOnly
                      options={{
                        autoApply: false,
                        singleMode: false,
                        numberOfColumns: 2,
                        numberOfMonths: 2,
                        showWeekNumbers: true,
                        dropdowns: {
                          minYear: 2021,
                          maxYear: null,
                          months: true,
                          years: true,
                        },
                      }}
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
                      defaultValue={`${orderToEdit?.campaign_duration} Days`}
                      readOnly
                      className="w-full text-sm pl-10 border rounded bg-gray-100 cursor-not-allowed"
                    />

                    <div className="absolute flex items-center justify-center w-8  h-8 left-0 bottom-1  text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Group variant="boxed">
                <Disclosure>
                  <Disclosure.Button className="leading-relaxed lg:text-lg font-semibold text-customColor dark:text-slate-500">
                    ⬇ View All Added Billboards
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    {billboards.length > 0 && (
                      <div className="col-span-12 flex flex-col gap-y-2">
                        {/* <h3 className="text-lg font-semibold ">Added Billboards</h3> */}
                        {billboards.map((billboard, index) => (
                          <div
                            key={index}
                            className="flex items-center lg:space-x-8 space-x-2  text-xs lg:text-sm  lg:p-4 bg-primary text-customColor rounded-2xl "
                          >
                            <div className="w-full ">
                              <div className="text-sm md:text-[16px] text-black font-semibold mb-2">
                                {
                                  availableBillboards.find(
                                    (b: { id: any }) =>
                                      b.id == billboard.billboard_id
                                  )?.billboardName
                                }
                              </div>
                              <div className="flex space-x-2 text-xs capitalize ">
                                <div className="bg-violet-200 text-violet-600 p-0.5">
                                  {
                                    availableBillboards.find(
                                      (b: { id: any }) =>
                                        b.id == billboard.billboard_id
                                    )?.orientation
                                  }
                                </div>
                                <div className="bg-blue-100 text-blue-600 p-0.5">
                                  {
                                    availableBillboards.find(
                                      (b: { id: any }) =>
                                        b.id == billboard.billboard_id
                                    )?.billboardType
                                  }
                                </div>
                                <div className="bg-orange-100 text-orange-500 p-0.5">
                                  {billboard.billboard_type === "digital"
                                    ? `Slot `
                                    : `Face `}
                                  {billboard.slotOrFace}
                                </div>
                              </div>
                            </div>

                            <div className="flex lg:w-full w-1/3 justify-end items-center space-x-2">
                              <div className="lg:text-lg text-xs text-customColor font-semibold">
                                <div className="text-slate-500 lg:text-sm text-xs">
                                  campaign cost
                                </div>
                                &#x20A6;
                                {formatCurrency(billboard.actual_amount)}
                              </div>
                              <button
                                onClick={() => {
                                  setBillboards((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );

                                  setUsedSlotsFaces((prev) => {
                                    const billboardId = billboard.billboard_id; // Correct key reference
                                    const updatedSlotsFaces =
                                      prev[billboardId]?.filter(
                                        (slotOrFace) =>
                                          slotOrFace !==
                                          String(
                                            billboard.slot || billboard.face
                                          )
                                      ) || [];

                                    return {
                                      ...prev,
                                      [billboardId]:
                                        updatedSlotsFaces.length > 0
                                          ? updatedSlotsFaces
                                          : undefined, // Remove key if empty
                                    };
                                  });
                                }}
                                className="  hover:bg-white text-customColor hover:text-white rounded-lg w-5 h-5 flex items-center justify-center"
                                type="button"
                              >
                                {/* &times; */}
                                <Lucide icon="X" className="text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Disclosure.Panel>
                </Disclosure>
              </Disclosure.Group>

              <div className="border-b border-slate-200"></div>

              {/* select billboard */}
              {isAddingBillboard && (
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
                    {availableBillboards.map((billboard: any) => (
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
                          ? `${billboard?.available_slots?.length} of ${billboard?.numberOfSlotsOrFaces} slots available`
                          : `${billboard?.available_faces.length} of ${billboard?.numberOfSlotsOrFaces} faces available`}
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
              )}

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
                      <option value="">{formData?.billboard_type}</option>
                    </FormSelect>
                  </div>
                </>
              )}

              {/* Billboard Orientation  */}

              {formData?.orientation && (
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
                    value={formData?.orientation}
                    className="w-full "
                    disabled
                  >
                    <option value="">{formData?.orientation}</option>
                  </FormSelect>
                </div>
              )}

              {/* Billboard price  */}

              {formData?.billboard_price_per_day > 0 && (
                <div className="col-span-12">
                  <FormLabel className="font-medium lg:text-[16px] text-black">
                    Billboard Price/Day
                  </FormLabel>
                  <FormInput
                    formInputSize="lg"
                    type="number"
                    name="actualAmount"
                    value={formData.billboard_price_per_day}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>
              )}

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
                    value={`${formData?.slotOrFace}`}
                    onChange={handleChange}
                    // {...register("slot_or_face")}
                    className="w-full "
                  >
                    <option value="">
                      Select{" "}
                      {formData.billboard_type === "digital" ? "Slot" : "Face"}
                    </option>
                    {(() => {
                      const slotsData = availableSlotsFaces(
                        formData.billboard_id,
                        formData.billboard_type
                      );
                      return slotsData?.option.map((label, index) => (
                        <option
                          key={slotsData.value[index]}
                          value={slotsData.value[index]}
                        >
                          {label}
                        </option>
                      ));
                    })()}
                  </FormSelect>
                </div>
              )}

              {newlyAddedBillboards.length > 0 && (
                <div className="col-span-12 flex flex-col gap-y-2">
                  {/* <h3 className="text-lg font-semibold ">Added Billboards</h3> */}
                  {newlyAddedBillboards.map((newlyAddedBillboard, index) => (
                    <div
                      key={index}
                      className="flex items-center lg:space-x-8 space-x-2  text-xs lg:text-sm p-2 lg:p-4 bg-primary text-customColor rounded-2xl "
                    >
                      <div className="w-full ">
                        <div className="text-sm md:text-[16px] text-black font-semibold mb-2">
                          {
                            availableBillboards.find(
                              (b: { id: any }) =>
                                b.id == newlyAddedBillboard.billboard_id
                            )?.billboardName
                          }
                        </div>
                        <div className="flex space-x-2 text-xs capitalize ">
                          <div className="bg-violet-200 text-violet-600 p-0.5">
                            {
                              availableBillboards.find(
                                (b: { id: any }) =>
                                  b.id == newlyAddedBillboard.billboard_id
                              )?.orientation
                            }
                          </div>
                          <div className="bg-blue-100 text-blue-600 p-0.5">
                            {
                              availableBillboards.find(
                                (b: { id: any }) =>
                                  b.id == newlyAddedBillboard.billboard_id
                              )?.billboardType
                            }
                          </div>
                          <div className="bg-orange-100 text-orange-500 p-0.5">
                            {newlyAddedBillboard.billboard_type === "digital"
                              ? `Slot `
                              : `Face `}
                            {newlyAddedBillboard.slotOrFace}
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:w-full w-1/3 justify-end items-center space-x-2">
                        <div className="lg:text-lg text-xs text-customColor font-semibold">
                          <div className="text-slate-500 lg:text-sm text-xs">
                            campaign cost
                          </div>
                          &#x20A6;
                          {formatCurrency(newlyAddedBillboard.actual_amount)}
                        </div>
                        <button
                          onClick={() => {
                            setBillboards((prev) =>
                              prev.filter(
                                (item, i) =>
                                  item.slotOrFace !=
                                  newlyAddedBillboard.slotOrFace
                              )
                            );
                            setNewlyAddedBillboards((prev) =>
                              prev.filter((_, i) => i !== index)
                            );

                            setUsedSlotsFaces((prev) => {
                              const billboardId =
                                newlyAddedBillboard.billboard_id; // Correct key reference
                              const updatedSlotsFaces =
                                prev[billboardId]?.filter(
                                  (slotOrFace) =>
                                    slotOrFace !==
                                    String(newlyAddedBillboard.slotOrFace)
                                ) || [];

                              return {
                                ...prev,
                                [billboardId]:
                                  updatedSlotsFaces.length > 0
                                    ? updatedSlotsFaces
                                    : undefined, // Remove key if empty
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

              {isAddingBillboard ? (
                <Button
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

                  <div className="  text-center">Add </div>
                </Button>
              ) : (
                <button
                  disabled={isLoading}
                  type="button"
                  className="w-auto flex text-sm md:text-[16px] font-semibold text-customColor"
                  ref={sendButtonRef}
                  onClick={() => {
                    setIsAddingBillboard(true);
                  }}
                >
                  <Lucide icon="Plus" className="w-4 h-4 mr-1" />

                  <div className="  text-center">Add New Billboard</div>
                </button>
              )}

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
                  // formTextareaSize="lg"
                  defaultValue={orderDetails.description}
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
                  value={`₦${formatCurrency(
                    billboards.reduce(
                      (acc, item) => acc + Number(item.actual_amount),
                      0
                    )
                  )}`}
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
                  value={orderDetails?.discount_order_amount}
                  id="discount_order_amount"
                  type="text"
                  name="discount_order_amount"
                  onChange={handleOrderDetailsChange}
                  placeholder="Type here"
                  // {...register("discount_amount")}
                />
                {errors.discount_amount && (
                  <p className="text-red-500">
                    {errors.discount_amount.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex space-x-2 lg:text-lg text-sm">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={onClose}
                  className="w-auto  border-red-500 text-red-500"
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

                  {isLoading ? (
                    <div className="flex items-center space-x-2 justify-end">
                      <LoadingIcon
                        icon="spinning-circles"
                        className="w-6 h-6"
                      />
                      <div className=" text-xs text-center">Modifying...</div>
                    </div>
                  ) : (
                    "Modify Order"
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

export default OrderEditingModal;
