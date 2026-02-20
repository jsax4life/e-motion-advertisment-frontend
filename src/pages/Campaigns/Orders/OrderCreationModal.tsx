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
  discounted_total: number;
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
  billboardType: "static" | "digital" | "bespoke" | "lamp_pole";
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
  available_lamp_holes: number[];

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
  const [excludedDays, setExcludedDays] = useState<string[]>([]);
  const [dateSelectionMode, setDateSelectionMode] = useState<"exclude" | "cherry-pick">("exclude");
  const [cherryPickedDates, setCherryPickedDates] = useState<string[]>([]);
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
    discount_amount: 0,
    discount_type: "percentage", // "percentage" or "fixed"
    discounted_amount: 0,
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
    discounted_total: 0,
    description: "",
  });

  const [billboards, setBillboards] = useState<any[]>([]); // List of billboards in the order
  const [usedSlotsFaces, setUsedSlotsFaces] = useState<Record<string, string[]>>({});
  const [mediaPurchaseOrder, setMediaPurchaseOrder] = useState<File | null>(null);
  const [expandedDiscounts, setExpandedDiscounts] = useState<Record<number, boolean>>({});

  // State for bulk hole selection for lamp pole billboards
  const [bulkHoleSelection, setBulkHoleSelection] = useState({
    startHole: 1,
    endHole: 1,
    totalHoles: 1,
    selectedHoles: [] as number[]
  });


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
          const perUnitPricePerDay = selectedBillboard.pricePerDay;
          
          // actual_amount should always be the per-day price (per-hole for lamp pole, per-billboard for others)
          const actualAmount = perUnitPricePerDay;
         
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
  }, [startDate, endDate, formData.billboard_id, availableBillboards, excludedDays, dateSelectionMode, cherryPickedDates]);


  useEffect(() => {
    if (orderDetails?.payment_option === "prepaid" && paymentPeriod) {
    
      setOrderDetails((prev) => ({...prev, 
        payment_due_date: paymentPeriod,
    
      }));
   
    }
  }, [paymentPeriod]);

  // Update order details when billboards change
  useEffect(() => {
    setOrderDetails((prev) => ({
      ...prev,
      discounted_total: calculateTotalDiscountedAmount()
    }));
  }, [billboards]);


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
    const total = type === "digital" ? billboard.available_slots : 
                  type === "lamp_pole" ? billboard.available_lamp_holes : 
                  billboard.available_faces;

    return Array.from({ length: Number(total) }, (_, i) => {
      const slotOrFace = type === "digital" ? `Slot ${i + 1}` : 
                        type === "lamp_pole" ? `Hole ${i + 1}` :
                        `Face ${i + 1}`;
      return {
        value: slotOrFace,
        isUsed: used.includes(slotOrFace),
      };
    });
  };

  // Handle bulk hole selection for lamp pole billboards
  const handleBulkHoleSelection = (startHole: number, endHole: number) => {
    const selectedBillboard = availableBillboards.find((b) => b.id === formData.billboard_id);
    if (!selectedBillboard || selectedBillboard.billboardType !== "lamp_pole") return;

    const globalAvailableHoles = selectedBillboard.available_lamp_holes || [];
    if (globalAvailableHoles.length === 0) return;

    // Get holes that have been used in the current order session
    const usedHolesInCurrentSession = usedSlotsFaces[formData.billboard_id] || [];
    const usedHoleNumbers = usedHolesInCurrentSession.map(holeLabel => 
      parseInt(holeLabel.replace('Hole ', ''))
    );

    // Filter out holes that are already used in the current session
    const availableHoles = globalAvailableHoles.filter(hole => 
      !usedHoleNumbers.includes(hole)
    );

    if (availableHoles.length === 0) return;

    const minHole = availableHoles[0];
    const maxHole = availableHoles[availableHoles.length - 1];
    
    // Ensure start and end holes are within available range
    const validStartHole = Math.max(minHole, Math.min(startHole, maxHole));
    const validEndHole = Math.max(validStartHole, Math.min(endHole, maxHole));
    
    // Only select holes that are actually available
    const selectedHoles = availableHoles.filter(hole => 
      hole >= validStartHole && hole <= validEndHole
    );
    
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
        // Use a descriptive slotOrFace label for grouped selection
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

      setBillboards((prev) => [...prev, groupedEntry]);
    } else {
      // Single entry for non-lamp pole billboards
      const perDayAmount = formData.actual_amount || 0; // This is per-day amount
      const campaignDuration = orderDetails.campaign_duration || 0;
      const totalCampaignAmount = perDayAmount * campaignDuration;
      
      const billboardWithTotal = {
        ...formData,
        actual_amount: totalCampaignAmount, // Store total campaign amount
        discount_amount: 0,
        discount_type: "percentage",
        discounted_amount: totalCampaignAmount,
      };
      
      setBillboards((prev) => [...prev, billboardWithTotal]);
    }

    // Reset the form
    setFormData({
      billboard_id: "",
      billboard_type: "",
      orientation: "",
      slotOrFace: "",
      start_date: "",
      end_date: "",
      billboard_price_per_day: 0,
      actual_amount: 0,
      discount_amount: 0,
      discount_type: "percentage",
      discounted_amount: 0,
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

    // Clear the selected billboard
    setSelectedBillboard(undefined);
  };



  // Handle billboard selection
  const handleBillboardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const billboardId = e.target.value;
    const selectedBillboard = availableBillboards.find((b) => b.id == billboardId);
    
    setFormData((prev) => ({
      ...prev,
      billboard_id: billboardId,
      billboard_type: selectedBillboard?.billboardType || "",
      orientation: selectedBillboard?.orientation || "",
      billboard_price_per_day: selectedBillboard?.pricePerDay || 0,
    }));

    if (selectedBillboard) {
      setSelectedBillboard(selectedBillboard);
      
      // Initialize bulk hole selection for lamp pole billboards
      if (selectedBillboard.billboardType === "lamp_pole") {
        const availableHoles = selectedBillboard.available_lamp_holes || [];
        const firstHole = availableHoles[0] || 1;
        setBulkHoleSelection({
          startHole: firstHole,
          endHole: firstHole,
          totalHoles: 1,
          selectedHoles: [firstHole]
        });
      }
    }
  };

  

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const files = Array.from(e.target.files).slice(0, 10); // Limit to 10 files
  //     setFormData((prev) => ({ ...prev, images: files }));
  //   }
  // };

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get all dates in range
  const getDatesInRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Toggle date selection in cherry-pick mode
  const toggleDateSelection = (date: string) => {
    if (cherryPickedDates.includes(date)) {
      setCherryPickedDates(cherryPickedDates.filter(d => d !== date));
    } else {
      setCherryPickedDates([...cherryPickedDates, date].sort());
    }
  };

  // Get calendar month data
  const getCalendarData = () => {
    if (!startDate || !endDate) return { months: [], allDates: [] };

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = getDatesInRange(startDate, endDate);

    // Get all unique months in range
    const months: { month: number; year: number; dates: string[] }[] = [];
    const current = new Date(start);

    while (current <= end) {
      const month = current.getMonth();
      const year = current.getFullYear();

      // Get dates for this month
      const monthDates = dates.filter(d => {
        const dDate = new Date(d);
        return dDate.getMonth() === month && dDate.getFullYear() === year;
      });

      months.push({ month, year, dates: monthDates });
      current.setMonth(current.getMonth() + 1);
    }

    return { months, allDates: dates };
  };

  const calculateNumberOfDays = (
    startDate: string,
    endDate: string
  ): number => {
    if (dateSelectionMode === "cherry-pick") {
      // In cherry-pick mode, count only the selected dates
      return cherryPickedDates.length;
    }
    
    // In exclude mode, count all days except excluded days of the week
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let count = 0;
    const currentDate = new Date(start);
    
    // Day name mapping
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    while (currentDate <= end) {
      const dayName = dayNames[currentDate.getDay()].toLowerCase();
      
      // Only count days that are NOT in the excludedDays array
      if (!excludedDays.includes(dayName)) {
        count++;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
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
  };

  // Calculate total discounted amount for all billboards
  const calculateTotalDiscountedAmount = () => {
    return billboards.reduce((total, billboard) => {
      // For lamp pole bulk selections, use total_campaign_amount or discounted_amount
      if (billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection) {
        return total + (billboard.discounted_amount || billboard.total_campaign_amount || 0);
      } else {
        return total + (billboard.discounted_amount || billboard.actual_amount);
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
      excluded_days: dateSelectionMode === "exclude" ? excludedDays : [],
      cherry_picked_dates: dateSelectionMode === "cherry-pick" ? cherryPickedDates : [],
      date_selection_mode: dateSelectionMode,
      // media_purchase_order: mediaPurchaseOrder,
      total_order_amount: parseFloat(
        billboards.reduce((acc, item) => {
          // For lamp pole bulk selections, use total_campaign_amount
          if (item.billboard_type === "lamp_pole" && item.is_bulk_selection) {
            return acc + (item.total_campaign_amount || 0);
          } else {
            return acc + item.actual_amount;
          }
        }, 0).toFixed(2)
      ),
      discounted_total: parseFloat(
        calculateTotalDiscountedAmount().toFixed(2)
      )
    };

    // console.log(payload)
        // Submit the order
        onSubmit(payload, formData);

     
         // Clear the state and close the modal
    setBillboards([]);
    setUsedSlotsFaces({});
    setExcludedDays([]);
    setCherryPickedDates([]);
    setDateSelectionMode("exclude");
    setDateRange("");
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
      discounted_total: 0,
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
                        numberOfMonths: 2,
                        numberOfColumns: 2,
                        splitView: true,
                        allowRepick: true,
                        selectForward: true,
                        showWeekNumbers: true,
                        autoApply: false,
                        dropdowns: {
                          minYear: 1999,
                          maxYear: new Date().getFullYear() + 5,
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

              {/* Date Selection Mode Section */}
              <div className="col-span-12">
                <FormLabel className="font-medium lg:text-[16px] text-black mb-3 block">
                  Campaign Date Selection (Optional)
                </FormLabel>
                
                {/* Mode Toggle */}
                <div className="mb-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDateSelectionMode("exclude");
                      setCherryPickedDates([]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      dateSelectionMode === "exclude"
                        ? "bg-customColor text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Exclude Days of Week
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDateSelectionMode("cherry-pick");
                      setExcludedDays([]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      dateSelectionMode === "cherry-pick"
                        ? "bg-customColor text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Cherry-Pick Dates
                  </button>
                </div>

                {/* Exclude Days Mode */}
                {dateSelectionMode === "exclude" && (
                  <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-600 mb-2">
                      Select days to exclude (e.g., weekends)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: 'sunday', label: 'Sun' },
                        { value: 'monday', label: 'Mon' },
                        { value: 'tuesday', label: 'Tue' },
                        { value: 'wednesday', label: 'Wed' },
                        { value: 'thursday', label: 'Thu' },
                        { value: 'friday', label: 'Fri' },
                        { value: 'saturday', label: 'Sat' },
                      ].map((day) => (
                        <label
                          key={day.value}
                          className="flex items-center space-x-1.5 cursor-pointer hover:bg-slate-100 px-2 py-1.5 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={excludedDays.includes(day.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setExcludedDays([...excludedDays, day.value]);
                              } else {
                                setExcludedDays(excludedDays.filter(d => d !== day.value));
                              }
                            }}
                            className="rounded border-slate-300 text-customColor focus:ring-customColor"
                          />
                          <span className="text-xs text-slate-700">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cherry-Pick Mode */}
                {dateSelectionMode === "cherry-pick" && (
                  <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    {!startDate || !endDate ? (
                      <p className="text-xs text-slate-500 text-center py-4">
                        Please select a campaign duration first to cherry-pick dates
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-slate-600 mb-3">
                          Click on dates to select/deselect. Selected: {cherryPickedDates.length} day{cherryPickedDates.length !== 1 ? 's' : ''}
                        </p>
                        <div className="overflow-x-auto">
                          <div className="flex gap-4 min-w-max">
                            {getCalendarData().months.map((monthData, idx) => {
                              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                              const firstDate = new Date(monthData.year, monthData.month, 1);
                              const lastDate = new Date(monthData.year, monthData.month + 1, 0);
                              const firstDayOfWeek = firstDate.getDay();
                              const daysInMonth = lastDate.getDate();
                              
                              // Get all dates in this month that are in range
                              const datesInMonth = monthData.dates;
                              
                              return (
                                <div key={`${monthData.year}-${monthData.month}`} className="min-w-[280px]">
                                  <div className="text-center font-semibold text-sm mb-2 text-slate-700">
                                    {monthNames[monthData.month]} {monthData.year}
                                  </div>
                                  <div className="grid grid-cols-7 gap-1">
                                    {/* Day headers */}
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                      <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
                                        {day}
                                      </div>
                                    ))}
                                    
                                    {/* Empty cells for days before month starts */}
                                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                      <div key={`empty-${i}`} className="h-8"></div>
                                    ))}
                                    
                                    {/* Days of the month */}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                      const day = i + 1;
                                      const dateStr = formatDate(new Date(monthData.year, monthData.month, day));
                                      const isInRange = datesInMonth.includes(dateStr);
                                      const isSelected = cherryPickedDates.includes(dateStr);
                                      
                                      return (
                                        <button
                                          key={day}
                                          type="button"
                                          onClick={() => {
                                            if (isInRange) {
                                              toggleDateSelection(dateStr);
                                            }
                                          }}
                                          disabled={!isInRange}
                                          className={`h-8 w-8 rounded text-xs transition-colors ${
                                            !isInRange
                                              ? 'text-slate-300 cursor-not-allowed'
                                              : isSelected
                                              ? 'bg-customColor text-white hover:bg-customColor/90'
                                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                          }`}
                                        >
                                          {day}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {cherryPickedDates.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-600 mb-1">Quick Actions:</p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const allDates = getDatesInRange(startDate, endDate);
                                  setCherryPickedDates(allDates);
                                }}
                                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Select All
                              </button>
                              <button
                                type="button"
                                onClick={() => setCherryPickedDates([])}
                                className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Clear All
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
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
              <FormLabel  className="font-medium lg:text-[16px] text-black">
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
                              min={(() => {
                                const globalHoles = selectedBillboard?.available_lamp_holes || [];
                                const usedHoles = usedSlotsFaces[formData.billboard_id] || [];
                                const usedHoleNumbers = usedHoles.map(holeLabel => 
                                  parseInt(holeLabel.replace('Hole ', ''))
                                );
                                const availableHoles = globalHoles.filter(hole => 
                                  !usedHoleNumbers.includes(hole)
                                );
                                return availableHoles[0] || 1;
                              })()}
                              max={(() => {
                                const globalHoles = selectedBillboard?.available_lamp_holes || [];
                                const usedHoles = usedSlotsFaces[formData.billboard_id] || [];
                                const usedHoleNumbers = usedHoles.map(holeLabel => 
                                  parseInt(holeLabel.replace('Hole ', ''))
                                );
                                const availableHoles = globalHoles.filter(hole => 
                                  !usedHoleNumbers.includes(hole)
                                );
                                return availableHoles[availableHoles.length - 1] || 1;
                              })()}
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
                              max={(() => {
                                const globalHoles = selectedBillboard?.available_lamp_holes || [];
                                const usedHoles = usedSlotsFaces[formData.billboard_id] || [];
                                const usedHoleNumbers = usedHoles.map(holeLabel => 
                                  parseInt(holeLabel.replace('Hole ', ''))
                                );
                                const availableHoles = globalHoles.filter(hole => 
                                  !usedHoleNumbers.includes(hole)
                                );
                                return availableHoles[availableHoles.length - 1] || 1;
                              })()}
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
                            Total cost: {formatCurrency(bulkHoleSelection.totalHoles * (formData.actual_amount || 0))}
                          </p>
                          <p className="text-xs text-blue-500 mt-1">
                            Per hole (per day): {formatCurrency(formData.actual_amount || 0)}
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
                        value={formData?.slotOrFace}
                        onChange={handleChange}
                        className="w-full"
                      >
                        <option value="">--Select--</option>
                        {formData.billboard_type === "digital"
                          ? selectedBillboard?.available_slots
                              .filter(slot => !usedSlotsFaces[selectedBillboard?.id]?.includes(slot.toString()))
                              .map(slot => (
                                <option key={slot} value={slot}>Slot {slot}</option>
                              ))
                          : selectedBillboard?.available_faces
                              .filter(face => !usedSlotsFaces[selectedBillboard?.id]?.includes(face.face_number.toString()))
                              .map(face => (
                                <option key={face.face_number} value={face.face_number}>
                                  Face {face.face_number}{face.description ? ' - ' + face.description : ''}
                                </option>
                              ))
                        }
                      </FormSelect>
                    )}
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
  <div className="col-span-12 flex flex-col gap-y-4">
    <h3 className="text-lg font-semibold ">Added Billboards</h3>
    {billboards.map((billboard, index) => (
      <div
        key={index}
        className="border border-slate-200 rounded-lg p-4 bg-slate-50"
      >
        {/* Billboard Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <div className="text-sm md:text-[16px] text-black font-semibold mb-2">
              {(() => {
                const billboardName = availableBillboards.find((b) => b.id == billboard.billboard_id)?.billboardName || '';
                return billboardName.length > 25 ? `${billboardName.substring(0, 25)}...` : billboardName;
              })()}
            </div>
            <div className="flex space-x-2 text-xs capitalize">
              <div className="bg-violet-200 text-violet-600 px-2 py-1 rounded">
                {
                  availableBillboards.find((b) => b.id == billboard.billboard_id)
                    ?.orientation
                }
              </div>
              <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {
                  availableBillboards.find((b) => b.id == billboard.billboard_id)
                    ?.billboardType
                }
              </div>
              <div className="bg-orange-100 text-orange-500 px-2 py-1 rounded">
                {billboard.billboard_type === "digital"
                  ? `Slot ${billboard.slotOrFace}`
                  : billboard.billboard_type === "lamp_pole"
                  ? billboard.is_bulk_selection 
                    ? `Holes ${billboard.bulk_start_hole}-${billboard.bulk_end_hole} (${billboard.bulk_total_holes})`
                    : `Hole ${billboard.slotOrFace}`
                  : `Face ${billboard.slotOrFace}`}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setBillboards((prev) => prev.filter((_, i) => i !== index));

              setUsedSlotsFaces((prev) => {
                const billboardId = billboard.billboard_id;
                let updatedSlotsFaces = prev[billboardId] || [];
                
                if (billboard.is_bulk_selection) {
                  // Remove all holes in the bulk selection
                  const holeLabels = Array.from(
                    { length: billboard.bulk_end_hole - billboard.bulk_start_hole + 1 }, 
                    (_, i) => `Hole ${billboard.bulk_start_hole + i}`
                  );
                  updatedSlotsFaces = updatedSlotsFaces.filter(
                    (slotOrFace) => !holeLabels.includes(slotOrFace)
                  );
                } else {
                  // Remove single slot/face
                  updatedSlotsFaces = updatedSlotsFaces.filter(
                    (slotOrFace) => slotOrFace !== String(billboard.slotOrFace)
                  );
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
            
            {/* Show total campaign amount for lamp pole bulk selections */}
            {billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection && (
              <div className="mt-2 pt-2 border-t border-slate-200">
                <div className="text-sm font-semibold text-slate-800">
                  Total Campaign Amount: ₦{formatCurrency(billboard.total_campaign_amount || 0)}
                </div>
              </div>
            )}
          </div>

          {/* Discount Button or Controls */}
          <div className="space-y-2">
            {!expandedDiscounts[index] ? (
              <div className="flex justify-end">
                <button
                  onClick={() => toggleDiscountSection(index)}
                  className="text-xs bg-customColor text-white px-3 py-2 rounded hover:bg-customColor/90 transition-colors"
                >
                  Apply Discount
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs text-slate-600 mb-1 block">Apply Discount</label>
                <div className="flex space-x-2">
                  <FormSelect
                    value={billboard.discount_type || "percentage"}
                    onChange={(e) => handleBillboardDiscountChange(index, "discount_type", e.target.value)}
                    className="text-xs border border-slate-300 rounded px-2 py-2 w-8"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">₦</option>
                  </FormSelect>
                  <input
                    type="number"
                    value={billboard.discount_amount || 0}
                    onChange={(e) => handleBillboardDiscountChange(index, "discount_amount", parseFloat(e.target.value) || 0)}
                    onFocus={(e) => e.target.select()}
                    placeholder="0"
                    className="text-xs border border-slate-300 rounded px-2 py-1 flex-1"
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
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Final Amount:</span>
            <span className="text-lg font-bold text-customColor">
              ₦{formatCurrency(billboard.discounted_amount || (billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection ? billboard.total_campaign_amount : billboard.actual_amount))}
            </span>
          </div>
          {(billboard.discount_amount > 0) && (
            <div className="text-xs text-green-600 mt-1">
              Savings: ₦{formatCurrency((billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection ? billboard.total_campaign_amount : billboard.actual_amount) - (billboard.discounted_amount || (billboard.billboard_type === "lamp_pole" && billboard.is_bulk_selection ? billboard.total_campaign_amount : billboard.actual_amount)))}
            </div>
          )}
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
                  value={`₦${formatCurrency( billboards.reduce((acc, item) => {
                    // For lamp pole bulk selections, use total_campaign_amount
                    if (item.billboard_type === "lamp_pole" && item.is_bulk_selection) {
                      return acc + (item.total_campaign_amount || 0);
                    } else {
                      return acc + item.actual_amount;
                    }
                  }, 0))}`}
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
                  id="discounted_total"
                  type="text"
                  name="discounted_total"
                  readOnly
                  value={`₦${formatCurrency(calculateTotalDiscountedAmount())}`}
                  className="w-full text-sm border rounded bg-gray-100 cursor-not-allowed"
                  // {...register("discount_amount")}
                />
                <div className="text-xs text-slate-500 mt-1">
                  Automatically calculated from individual billboard discounts
                </div>
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