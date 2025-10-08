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
import { useAvailableBillboards } from "../../../hooks/useBillboards";
import { set } from "lodash";
import PdfUploadSection from "./PdfUploadSection";

interface OrderCreationModalProps {
  isOpen: boolean;
  orderToEdit?: Campaign; // Existing order data for editing

  isLoading: boolean;
  onClose: () => void;
  // onSubmit: (data: any) => void;
  onSubmit: (data: any, fileForm: any) => void;

}

type Face = { face_number: number; description?: string };

// type Billboard = {
//   id: string;
//   available_faces: Face[];
//   available_slots: number[];
// };

// type SlotsFacesResponse = {
//   option: string[];
//   value: (number | string)[];
// };

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
  // Use the same available billboards source as order creation to avoid disparity
  const { availableBillboards, loading: billboardsLoading, error: billboardsError } = useAvailableBillboards();
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
  const [mediaPurchaseOrder, setMediaPurchaseOrder] = useState<File | null>(null);

  // Billboard search and dropdown state
  const [billboardSearchTerm, setBillboardSearchTerm] = useState("");
  const [isBillboardDropdownOpen, setIsBillboardDropdownOpen] = useState(false);

  // Discount management state
  const [expandedDiscounts, setExpandedDiscounts] = useState<Record<number, boolean>>({});

  // State for bulk hole selection for lamp pole billboards
  const [bulkHoleSelection, setBulkHoleSelection] = useState({
    startHole: 1,
    endHole: 1,
    totalHoles: 1,
    selectedHoles: [] as number[]
  });

  // Filtered billboards based on search term
  const filteredBillboards = availableBillboards?.filter((billboard: any) => {
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

      // Initialize existing billboards with discount fields
      const initializedBillboards = orderToEdit.billboards.map(billboard => ({
        ...billboard,
        discount_amount: billboard.discount_amount ?? 0,
        discount_type: billboard.discount_type ?? "percentage",
        discounted_amount: billboard.discounted_amount ?? billboard.actual_amount ?? 0
      }));
      setBillboards(initializedBillboards);

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
        const campaignDuration = orderToEdit?.campaign_duration || 0;
        const perUnitPricePerDay = selectedBillboard.pricePerDay || 0;
        
        // actual_amount should always be the per-day price (per-hole for lamp pole, per-billboard for others)
        const actualAmount = perUnitPricePerDay;


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
  }, [formData.billboard_id, availableBillboards, orderToEdit?.campaign_duration]);

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
  };

  console.log(orderToEdit);

  // Get available slots/faces for the selected billboard
  // const availableSlotsFaces = (
  //   billboardId: string,
  //   type: string
  // ): SlotsFacesResponse => {
  //   const billboard = availableBillboards.find(
  //     (b: { id: string }) => b.id == billboardId
  //   );
  //   if (!billboard) return { option: [], value: [] };

  //   const used = usedSlotsFaces[billboardId] || [];

  //   const availableFace = billboard.available_faces.map((face: { face_number: any; description: string;}) => face);

  //   const total =
  //     type === "digital"
  //       ? billboard.available_slots
  //       : availableFace;

  //       console.log(total)

  //   const slotOrFaceUi = total
  //     .filter((slotOrFace: any) => !used?.includes(`${type === 'digital'? slotOrFace.toString() : slotOrFace.face_number.toString()}`)) // Filter used slots
  //     .map((slotOrFace: any) => {
  //       console.log(slotOrFace)
  //       return `${type === "digital" ? "Slot" : "Face"} ${type === 'digital'? slotOrFace : slotOrFace.face_number } ${type === 'digital'? '' : slotOrFace.description?? '' }`;
  //     });

     

  //   const slotOrFaceValue = total
  //     .filter((slotOrFace: any) => !used?.includes(`${type === 'digital'? slotOrFace.toString() : slotOrFace.face_number.toString()}`)) // Filter used slots
  //     .map((slotOrFace: any) => type === "digital" ? slotOrFace : slotOrFace.face_number);

  //   return {
  //     option: slotOrFaceUi,
  //     value: slotOrFaceValue,
  //   };
  // };



  const availableSlotsFaces = (
    billboardId: string,
    type: string
  ): SlotsFacesResponse => {

    const billboard = availableBillboards.find((b: { id: string; }) => b.id == billboardId);
    if (!billboard) return { option: [], value: [] };
    

    const used = usedSlotsFaces[billboardId] || [];
  
    const isDigital = type === 'digital';
  
    // Determine total options (slots, faces, or holes)
    const totalOptions = isDigital
      ? billboard.available_slots
      : type === 'lamp_pole'
      ? billboard.available_lamp_holes
      : billboard.available_faces;
  
      console.log(totalOptions);
    // Filter available (not used) options
    const availableOptions = totalOptions.filter((item: any) => {
      const id = isDigital ? item.toString() : 
                 type === 'lamp_pole' ? item.toString() :
                 item.face_number.toString();
      return !used.includes(id);
    });
  
    // Generate display strings
    const option = availableOptions.map((item: any) => {
      if (isDigital) {
        return `Slot ${item}`;
      } else if (type === 'lamp_pole') {
        return `Hole ${item}`;
      } else {
        return `Face ${item.face_number} ${item.description ?? ''}`.trim();
      }
    });
  
    // Generate values
    const value = availableOptions.map((item: any) =>
      isDigital ? item : type === 'lamp_pole' ? item : item.face_number
    );

    console.log(option)
    console.log(value)
  
    return { option, value };
  };

  // Calculate discounted amount for a billboard
  const calculateDiscountedAmount = (actualAmount: number, discountAmount: number, discountType: string) => {
    if (discountType === "percentage") {
      return actualAmount - (actualAmount * discountAmount / 100);
    } else {
      return Math.max(0, actualAmount - discountAmount);
    }
  };

  // Handle discount changes for individual billboards
  const handleBillboardDiscountChange = (index: number, field: string, value: any) => {
    // Determine if this billboard is from the existing billboards or newly added
    const isFromExisting = index < billboards.length;
    
    if (isFromExisting) {
      setBillboards((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        
        // Recalculate discounted amount
        if (field === "discount_amount" || field === "discount_type") {
          const billboard = updated[index];
          let actualAmount;
          
          // For lamp pole bulk selections, use total campaign amount
          if (billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection) {
            actualAmount = billboard.total_campaign_amount || 0;
          } else {
            actualAmount = billboard.actual_amount;
          }
          
          const discountAmount = billboard.discount_amount;
          const discountType = billboard.discount_type;
          
          // Validate discount amount to prevent negative final amounts
          let validDiscountAmount = discountAmount;
          if (discountType === "percentage" && discountAmount > 100) {
            validDiscountAmount = 100;
            updated[index].discount_amount = 100;
          } else if (discountType === "fixed" && discountAmount > actualAmount) {
            validDiscountAmount = actualAmount;
            updated[index].discount_amount = actualAmount;
          }
          
          updated[index].discounted_amount = calculateDiscountedAmount(actualAmount, validDiscountAmount, discountType);
        }
        
        return updated;
      });
    } else {
      const newIndex = index - billboards.length;
      setNewlyAddedBillboards((prev) => {
        const updated = [...prev];
        updated[newIndex] = { ...updated[newIndex], [field]: value };
        
        // Recalculate discounted amount
        if (field === "discount_amount" || field === "discount_type") {
          const billboard = updated[newIndex];
          let actualAmount;
          
          // For lamp pole bulk selections, use total campaign amount
          if (billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection) {
            actualAmount = billboard.total_campaign_amount || 0;
          } else {
            actualAmount = billboard.actual_amount;
          }
          
          const discountAmount = billboard.discount_amount;
          const discountType = billboard.discount_type;
          
          // Validate discount amount to prevent negative final amounts
          let validDiscountAmount = discountAmount;
          if (discountType === "percentage" && discountAmount > 100) {
            validDiscountAmount = 100;
            updated[newIndex].discount_amount = 100;
          } else if (discountType === "fixed" && discountAmount > actualAmount) {
            validDiscountAmount = actualAmount;
            updated[newIndex].discount_amount = actualAmount;
          }
          
          updated[newIndex].discounted_amount = calculateDiscountedAmount(actualAmount, validDiscountAmount, discountType);
        }
        
        return updated;
      });
    }
  };

  // Calculate total discounted amount for all billboards
  const calculateTotalDiscountedAmount = () => {
    const allBillboards = [...billboards, ...newlyAddedBillboards];
    return allBillboards.reduce((total, billboard) => {
      // For lamp pole bulk selections, use total_campaign_amount or discounted_amount
      if (billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection) {
        const amount = billboard.discounted_amount || billboard.total_campaign_amount || 0;
        return total + (isNaN(Number(amount)) ? 0 : Number(amount));
      } else {
        const amount = billboard.discounted_amount || billboard.actual_amount || 0;
        return total + (isNaN(Number(amount)) ? 0 : Number(amount));
      }
    }, 0);
  };

  // Toggle discount section visibility
  const toggleDiscountSection = (index: number) => {
    setExpandedDiscounts((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  console.log(formData);
  console.log(availableBillboards);

  // Handle bulk hole selection for lamp pole billboards
  const handleBulkHoleSelection = (startHole: number, endHole: number) => {
    const selectedBillboard = availableBillboards.find((b: any) => b.id === formData.billboard_id);
    if (!selectedBillboard || selectedBillboard.billboardType !== "lamp_pole") return;

    const maxHoles = selectedBillboard.available_lamp_holes?.length || 0;
    const validStartHole = Math.max(1, Math.min(startHole, maxHoles));
    const validEndHole = Math.max(validStartHole, Math.min(endHole, maxHoles));
    
    const selectedHoles = Array.from({ length: validEndHole - validStartHole + 1 }, (_, i) => validStartHole + i);
    
    setBulkHoleSelection({
      startHole: validStartHole,
      endHole: validEndHole,
      totalHoles: selectedHoles.length,
      selectedHoles
    });

    // Update form data with the first hole (for compatibility)
    setFormData((prev) => ({
      ...prev,
      slotOrFace: `Hole ${validStartHole}`,
    }));
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

    // For lamp pole billboards, validate bulk hole selection
    if (formData.billboard_type === "lamp_pole") {
      if (bulkHoleSelection.totalHoles === 0) {
        alert("Please select at least one hole for lamp pole billboard.");
        return;
      }
    } else {
      // For non-lamp pole billboards, validate slot/face selection
      if (!formData.slotOrFace) {
        alert("Please select a slot/face.");
        return;
      }
    }

    // Create billboard entries based on type
    if (formData.billboard_type === "lamp_pole") {
      // Create a single grouped entry for selected holes
      const perHoleAmount = formData.actual_amount || 0; // This is per-hole per-day amount
      const campaignDuration = orderDetails.campaign_duration || 0;
      const totalCampaignAmount = perHoleAmount * (bulkHoleSelection.totalHoles || 1) * campaignDuration;
      
      const groupedEntry = {
        ...formData,
        slotOrFace: `Holes ${bulkHoleSelection.startHole}-${bulkHoleSelection.endHole}`,
        is_bulk_selection: true,
        bulk_start_hole: bulkHoleSelection.startHole,
        bulk_end_hole: bulkHoleSelection.endHole,
        bulk_total_holes: bulkHoleSelection.totalHoles,
        campaign_duration: campaignDuration,
        // Store per-hole amount and total campaign amount
        actual_amount: perHoleAmount, // Keep per-hole per-day amount for calculations
        total_campaign_amount: totalCampaignAmount, // Total for entire campaign
        discount_amount: 0,
        discount_type: "percentage",
        discounted_amount: totalCampaignAmount,
      } as any;

      setNewlyAddedBillboards((prev) => [...prev, groupedEntry]);
    } else {
      // Single entry for non-lamp pole billboards
      const perDayAmount = formData.actual_amount || 0; // This is per-day amount
      const campaignDuration = orderDetails.campaign_duration || 0;
      const totalCampaignAmount = perDayAmount * campaignDuration;
      
      const billboardWithDiscount = {
        ...formData,
        actual_amount: totalCampaignAmount, // Store total campaign amount
        discount_amount: 0,
        discount_type: "percentage",
        discounted_amount: totalCampaignAmount
      };
      setNewlyAddedBillboards((prev) => [...prev, billboardWithDiscount]);
    }

    // Reset the form
    setFormData({
      billboard_id: "",
      billboard_type: "",
      orientation: "",
      start_date: "",
      end_date: "",
      slotOrFace: "",
      billboard_price_per_day: 0,
      actual_amount: 0,
    });

    // Reset bulk hole selection
    setBulkHoleSelection({
      startHole: 1,
      endHole: 1,
      totalHoles: 1,
      selectedHoles: []
    });

    // Update the used slots and faces
    setUsedSlotsFaces((prev) => {
      const updated = { ...prev };
      if (formData.billboard_type === "lamp_pole") {
        // Mark all selected holes as used
        const holeLabels = bulkHoleSelection.selectedHoles.map(hole => `Hole ${hole}`);
        updated[formData.billboard_id] = [...(updated[formData.billboard_id] || []), ...holeLabels];
      } else {
        updated[formData.billboard_id] = [...(updated[formData.billboard_id] || []), formData.slotOrFace];
      }
      return updated;
    });

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

    const formData = new FormData();

    if (mediaPurchaseOrder) {
      formData.append("media_purchase_order", mediaPurchaseOrder);

    }

     // ✅ Conditionally add campaign_order_id if updating
  if (orderToEdit?.id) {
    formData.append("campaign_order_id", orderToEdit.id.toString());
  }


    // Prepare the payload
    const allBillboards = [...billboards, ...newlyAddedBillboards];
    const payload = {
      ...orderDetails,
      billboards: allBillboards,
      id: orderToEdit?.id, // Include the order edited
      total_order_amount: allBillboards.reduce((acc, item) => {
        // For lamp pole bulk selections, use total_campaign_amount
        if (item.billboard_type === "lamp_pole" && item.is_bulk_selection) {
          const amount = item.total_campaign_amount || 0;
          return acc + (isNaN(Number(amount)) ? 0 : Number(amount));
        } else {
          const amount = item.actual_amount || 0;
          return acc + (isNaN(Number(amount)) ? 0 : Number(amount));
        }
      }, 0),
    };

    onSubmit(payload, formData);


    // Submit the order
    // onSubmit(payload);

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
                    {(billboards.length > 0 || newlyAddedBillboards.length > 0) && (
                      <div className="col-span-12 flex flex-col gap-y-2">
                        {/* <h3 className="text-lg font-semibold ">Added Billboards</h3> */}
                        {[...billboards, ...newlyAddedBillboards].map((billboard, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 ${
                              billboard.discount_amount > 0
                                ? "border-green-200 bg-green-50"
                                : "border-slate-200 bg-slate-50"
                            }`}
                          >
                            {/* Billboard Info */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                              <div className="text-sm md:text-[16px] text-black font-semibold mb-2">
                                  {(() => {
                                    const billboardName = availableBillboards.find((b: any) => b.id == billboard.billboard_id)?.billboardName || '';
                                    return billboardName.length > 25 ? `${billboardName.substring(0, 25)}...` : billboardName;
                                  })()}
                              </div>
                                <div className="flex flex-wrap gap-2 text-xs capitalize">
                                  <div className="bg-violet-200 text-violet-600 px-2 py-1 rounded whitespace-nowrap">
                                  {
                                      availableBillboards.find((b: any) => b.id == billboard.billboard_id)?.orientation
                                  }
                                </div>
                                  <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded whitespace-nowrap">
                                  {
                                      availableBillboards.find((b: any) => b.id == billboard.billboard_id)?.billboardType
                                  }
                                </div>
                                  <div className="bg-orange-100 text-orange-500 px-2 py-1 rounded whitespace-nowrap">
                                  {billboard.billboard_type === "digital"
                                      ? `Slot ${billboard.slotOrFace}`
                                      : billboard.billboard_type === "lamp_pole"
                                      ? billboard.is_bulk_selection
                                        ? `Holes ${billboard.bulk_start_hole}-${billboard.bulk_end_hole} (${billboard.bulk_total_holes})`
                                        : `Hole ${billboard.slotOrFace}`
                                      : `Face ${billboard.slotOrFace}`}
                                </div>
                                  {/* Discount Status Badge */}
                                  {billboard.discount_amount > 0 && (
                                    <div className="bg-green-100 text-green-600 px-2 py-1 rounded flex items-center whitespace-nowrap">
                                      <Lucide icon="Percent" className="w-3 h-3 mr-1" />
                                      {billboard.discount_type === "percentage" 
                                        ? `${billboard.discount_amount}% OFF`
                                        : `₦${formatCurrency(billboard.discount_amount)} OFF`
                                      }
                              </div>
                                  )}
                            </div>
                              </div>
                              <button
                                onClick={() => {
                                  // Determine if this billboard is from the existing billboards or newly added
                                  const isFromExisting = index < billboards.length;
                                  
                                  if (isFromExisting) {
                                    // Remove from existing billboards
                                    setBillboards((prev) => prev.filter((_, i) => i !== index));
                                  } else {
                                    // Remove from newly added billboards (adjust index)
                                    const newIndex = index - billboards.length;
                                    setNewlyAddedBillboards((prev) => prev.filter((_, i) => i !== newIndex));
                                  }

                                  setUsedSlotsFaces((prev) => {
                                    const billboardId = billboard.billboard_id;
                                    let updatedSlotsFaces = prev[billboardId] || [];
                                    if (billboard.is_bulk_selection) {
                                      const holeLabels = Array.from(
                                        { length: billboard.bulk_end_hole - billboard.bulk_start_hole + 1 },
                                        (_, i) => `Hole ${billboard.bulk_start_hole + i}`
                                      );
                                      updatedSlotsFaces = updatedSlotsFaces.filter((slotOrFace) => !holeLabels.includes(slotOrFace));
                                    } else {
                                      updatedSlotsFaces = updatedSlotsFaces.filter((slotOrFace) => slotOrFace !== String(billboard.slotOrFace));
                                    }

                                    return {
                                      ...prev,
                                      [billboardId]: updatedSlotsFaces.length > 0 ? updatedSlotsFaces : undefined,
                                    };
                                  });
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Lucide icon="X" className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Pricing and Discount Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Amounts Breakdown */}
                              <div>
                                <label className="text-xs text-slate-600 mb-2 block">Amount</label>
                                {billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection ? (
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-600">Per hole (per day)</span><span className="font-medium">₦{formatCurrency(billboard.actual_amount || 0)}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-600">Holes</span><span className="font-medium">{billboard.bulk_total_holes}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-600">Total (per day)</span><span className="font-semibold text-slate-800">₦{formatCurrency((billboard.actual_amount || 0) * (billboard.bulk_total_holes || 1))}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-600">Campaign duration</span><span className="font-medium">{billboard.campaign_duration || 0} days</span></div>
                                    <div className="flex justify-between"><span className="text-slate-600">Total for campaign</span><span className="font-semibold text-green-600">₦{formatCurrency(((billboard.actual_amount || 0) * (billboard.bulk_total_holes || 1) * (billboard.campaign_duration || 0)))}</span></div>
                                  </div>
                                ) : (
                                  <div className="text-lg font-semibold text-slate-800">
                                    ₦{formatCurrency(billboard.actual_amount)}
                                  </div>
                                )}
                              </div>

                              {/* Discount Button or Controls */}
                              <div className="space-y-2">
                                {!expandedDiscounts[index] ? (
                                  <div className="flex justify-end">
                                    <button
                                      onClick={() => toggleDiscountSection(index)}
                                      className={`text-xs px-3 py-2 rounded transition-colors ${
                                        billboard.discount_amount > 0
                                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                                          : "bg-customColor text-white hover:bg-customColor/90"
                                      }`}
                                    >
                                      {billboard.discount_amount > 0 ? "Modify Discount" : "Apply Discount"}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <label className="text-xs text-slate-600 mb-1 block">Apply Discount</label>
                                    <div className="flex gap-2">
                                      <FormSelect
                                        value={billboard.discount_type || "percentage"}
                                        onChange={(e) => handleBillboardDiscountChange(index, "discount_type", e.target.value)}
                                        className="text-xs border border-slate-300 rounded px-2 py-2 w-12 flex-shrink-0"
                                      >
                                        <option value="percentage">%</option>
                                        <option value="fixed">₦</option>
                                      </FormSelect>
                                      <input
                                        type="number"
                                        value={billboard.discount_amount || 0}
                                        onChange={(e) => handleBillboardDiscountChange(index, "discount_amount", parseFloat(e.target.value) || 0)}
                                        placeholder="0"
                                        className="text-xs border border-slate-300 rounded px-2 py-1 flex-1 min-w-0"
                                        min="0"
                                        max={(() => {
                                          if (billboard.discount_type === "percentage") {
                                            return 100; // Max 100% for percentage
                                          } else {
                                            // For fixed amount, use the appropriate amount based on billboard type
                                            if (billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection) {
                                              return billboard.total_campaign_amount || 0;
                                            } else {
                                              return billboard.actual_amount || 0;
                                            }
                                          }
                                        })()}
                                      />
                                    </div>
                                    <button
                                      onClick={() => toggleDiscountSection(index)}
                                      className="text-xs text-slate-500 hover:text-slate-700"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Final Amount */}
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-sm text-slate-600 flex-shrink-0">Final Amount:</span>
                                <span className="text-lg font-bold text-customColor text-right truncate">
                                  ₦{formatCurrency(billboard.discounted_amount || (billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection ? billboard.total_campaign_amount : billboard.actual_amount))}
                                </span>
                              </div>
                              {(billboard.discount_amount > 0) && (
                                <div className="text-xs text-green-600 mt-1 text-right">
                                  Savings: ₦{formatCurrency((billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection ? billboard.total_campaign_amount : billboard.actual_amount) - (billboard.discounted_amount || (billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection ? billboard.total_campaign_amount : billboard.actual_amount)))}
                                </div>
                              )}
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
                        {/* Search Results */}
                        {filteredBillboards.length > 0 ? (
                          filteredBillboards.map((billboard: any) => {
                            const isDisabled = 
                              (billboard.billboardType === "digital" && billboard?.available_slots?.length < 1) ||
                              (billboard.billboardType === "static" && billboard?.available_faces?.length < 1) ||
                              (billboard.billboardType === "lamp_pole" && billboard?.available_lamp_holes?.length < 1);
                            
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
                                        : billboard.billboardType === "lamp_pole"
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-green-100 text-green-700'
                                    }`}>
                                      {billboard.billboardType}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                        {billboard.billboardType === "digital"
                                        ? `${billboard?.available_slots?.length || 0}/${billboard?.numberOfSlotsOrFaces} slots`
                                        : billboard.billboardType === "lamp_pole"
                                        ? `${billboard?.available_lamp_holes?.length || 0}/${billboard?.numberOfSlotsOrFaces} holes`
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
                      </div>
                    )}

                    {/* Selected Billboard Display */}
                    {formData.billboard_id && (
                      <div className="mt-2 p-3 bg-customColor/5 border border-customColor/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            {(() => {
                              const selectedBillboard = availableBillboards.find((b: any) => b.id == formData.billboard_id);
                              return (
                                <>
                                  <div className="font-medium text-slate-900">
                                    {selectedBillboard?.billboardName}
                                  </div>
                                  <div className="text-sm text-slate-600">
                                    {selectedBillboard?.address && selectedBillboard.address.length > 30 ? 
                                      `${selectedBillboard.address.substring(0, 30)}...` : 
                                      selectedBillboard?.address} • {selectedBillboard?.state}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                          <button
                            onClick={() => {
                              setFormData(prev => ({ ...prev, billboard_id: "" }));
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
                    {formData.billboard_type === "lamp_pole" ? "Per Hole Price/Day" : "Amount"}
                  </FormLabel>
                  <FormInput
                    formInputSize="lg"
                    type="number"
                    name="actualAmount"
                    value={formData.actual_amount || 0}
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
                      : formData?.billboard_type === "lamp_pole"
                      ? " Hole Placement (Bulk Selection)"
                      : "Face Placement"}
                  </FormLabel>

                  {/* Bulk hole selection for lamp pole billboards */}
                  {formData.billboard_type === "lamp_pole" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Hole
                          </label>
                          <FormInput
                            type="number"
                            min="1"
                            max={availableBillboards.find((b: any) => b.id === formData.billboard_id)?.available_lamp_holes?.length || 0}
                            value={bulkHoleSelection.startHole}
                            onChange={(e) => {
                              const startHole = parseInt(e.target.value) || 1;
                              handleBulkHoleSelection(startHole, bulkHoleSelection.endHole);
                            }}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Hole
                          </label>
                          <FormInput
                            type="number"
                            min={bulkHoleSelection.startHole}
                            max={availableBillboards.find((b: any) => b.id === formData.billboard_id)?.available_lamp_holes?.length || 0}
                            value={bulkHoleSelection.endHole}
                            onChange={(e) => {
                              const endHole = parseInt(e.target.value) || bulkHoleSelection.startHole;
                              handleBulkHoleSelection(bulkHoleSelection.startHole, endHole);
                            }}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Selected:</strong> Holes {bulkHoleSelection.startHole} to {bulkHoleSelection.endHole} 
                          ({bulkHoleSelection.totalHoles} holes total)
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Per hole (per day): {formatCurrency(formData.actual_amount || 0)}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Total (per day): {formatCurrency((formData.actual_amount || 0) * bulkHoleSelection.totalHoles)}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Campaign duration: {orderDetails.campaign_duration || 0} days
                        </p>
                        <p className="text-xs text-blue-700 font-semibold mt-1">
                          Total for campaign: {formatCurrency((formData.actual_amount || 0) * bulkHoleSelection.totalHoles * (orderDetails.campaign_duration || 0))}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {bulkHoleSelection.selectedHoles.slice(0, 10).map(hole => (
                          <span 
                            key={hole}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            Hole {hole}
                          </span>
                        ))}
                        {bulkHoleSelection.selectedHoles.length > 10 && (
                          <span className="text-gray-500 text-xs px-2 py-1">
                            +{bulkHoleSelection.selectedHoles.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Regular slot/face selection for non-lamp pole billboards */
                  <FormSelect
                    formSelectSize="lg"
                    name="slotOrFace"
                    value={`${formData?.slotOrFace}`}
                    onChange={handleChange}
                      className="w-full"
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
                  )}
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
                              ? `Slot ${newlyAddedBillboard.slotOrFace}`
                              : newlyAddedBillboard.billboard_type === "lamp_pole"
                              ? newlyAddedBillboard.is_bulk_selection
                                ? `Holes ${newlyAddedBillboard.bulk_start_hole}-${newlyAddedBillboard.bulk_end_hole} (${newlyAddedBillboard.bulk_total_holes})`
                                : `Hole ${newlyAddedBillboard.slotOrFace}`
                              : `Face ${newlyAddedBillboard.slotOrFace}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:w-full w-1/3 justify-end items-center space-x-2">
                        <div className="lg:text-lg text-xs text-customColor font-semibold">
                          <div className="text-slate-500 lg:text-sm text-xs">
                            campaign cost
                          </div>
                          &#x20A6;
                          {formatCurrency(
                            newlyAddedBillboard.billboard_type === "lamp_pole" && newlyAddedBillboard.is_bulk_selection
                              ? newlyAddedBillboard.total_campaign_amount || 0
                              : newlyAddedBillboard.actual_amount
                          )}
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
              {/* <div className="col-span-12">
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
              </div> */}

              <PdfUploadSection
  uploadedPdf={mediaPurchaseOrder}
  setUploadedPdf={setMediaPurchaseOrder}
/>

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
                    [...billboards, ...newlyAddedBillboards].reduce((acc, item) => {
                      // For lamp pole bulk selections, use total_campaign_amount
                      if (item.billboard_type === "lamp_pole" && item.is_bulk_selection) {
                        const amount = item.total_campaign_amount || 0;
                        return acc + (isNaN(Number(amount)) ? 0 : Number(amount));
                      } else {
                        const amount = item.actual_amount || 0;
                        return acc + (isNaN(Number(amount)) ? 0 : Number(amount));
                      }
                    }, 0)
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
                  Total Amount after Discounts
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  value={`₦${formatCurrency(calculateTotalDiscountedAmount())}`}
                  id="discount_order_amount"
                  type="text"
                  readOnly
                  className="w-full text-sm border rounded bg-gray-100 cursor-not-allowed"
                />
                <div className="text-xs text-slate-500 mt-1">
                  Automatically calculated from individual billboard discounts
                </div>
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
