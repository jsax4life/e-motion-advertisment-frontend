import React, { useEffect, useState } from "react";
import { Dialog } from "../../base-components/Headless";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../base-components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../base-components/Button";
import ImageUploadSection from "./ImageUpoadSection";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import { formatCurrency } from "../../utils/utils";
import { useFetchStates } from "../../lib/Hook";

interface BillboardCreationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const BillboardCreationModal: React.FC<BillboardCreationModalProps> = ({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const { states, loading, error } = useFetchStates();
  const [lgas, setLGA] = useState<string[]>([]);
  const [showFaceSelector, setShowFaceSelector] = useState(false);

  const convertImagesToBase64 = (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      })
    );
  };

  //   console.log(uploadedImages);

  const validationSchema = yup.object().shape({
    internalCode: yup.string().required("Billboard Code is required"),
    billboardName: yup.string().required("Billboard Name is required"),
    state: yup.string().required("State is required"),
    lga: yup.string().required("LGA is required"),
    address: yup.string().required("Adddress is required"),
    lat: yup.string().required("Latitude is required"),
    lng: yup.string().required("Longitude is required"),
    // height: yup.string().required("Height is required"),
    // width: yup.string().required("Width is required"),
    numberOfSlotsOrFaces: yup
      .string()
      .required("Number of placement is required"),
    // numberOfFaces: yup.string().required("Number of Faces is required"),
    // pricePerDay: yup.string().required("Price Per Day is required"),
    pricePerMonth: yup.string().required("Price Per Month is required"),
    status: yup.string().required("Status is required"),
    // activeStatus: yup.string().required("Active Status is required"),
    orientation: yup.string().required("Board Orientation is required"),
    dimension: yup.string().required("Dimension is required"),  
    billboardType: yup.string().required("Billboard Type is required"),
    mediaType: yup.string().required("media Type is required"),
    faceDescriptions: yup.array().when('billboardType', {
      is: 'static',
      then: yup.array().of(yup.string().optional()),
      otherwise: yup.array().notRequired()
    })

  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const [formData, setFormData] = useState({
    serialNumber: "",
    internalCode: "",
    billboardName: "",
    state: "",
    lga: "",
    address: "",
    geolocation: { lat: "", lng: "" },
    dimension: "", 
    height: "",
    width: "",
    billboardType: "Static",
    mediaType: "",
    numberOfSlotsOrFaces: "",
    // faceDescriptions: [] as string[], // for storing descriptions
    faceDescriptions: {} as Record<number, string>, // Store descriptions by face number
  showDescriptionInputFor: null as any, // Track which face is being described


    // numberOfSlots: "",
    // numberOfFaces: "",
    pricePerDay: "",
    pricePerMonth: "",
    status: "Active",
    activeStatus: "Vacant",
    images: [] as File[],
    orientation: "Landscape",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setValue(name, value); // Ensure React Hook Form tracks this change

    // if (name === "numberOfSlotsOrFaces") {
    //   const numFaces = parseInt(value);
    //   setFormData(prev => ({
    //     ...prev,
    //     [name]: value,
    //     faceDescriptions: Array(numFaces).fill("") // Initialize empty descriptions
    //   }));
    // } 

    if (name === "pricePerMonth") {
      const pricePerMonth = parseFloat(value);
      const pricePerDay = pricePerMonth / 30; // Assuming 30 days in a month

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        pricePerDay: pricePerDay.toFixed(2), // Round to 2 decimal places
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    if (name === "billboardType") {
      if (value === "static" || value === "bespoke" || value === "digital") {
        setValue("numberOfSlotsOrFaces", ""); // Reset numberOfSlots
      }
    }
    // Handle logic for resetting dependent fields
    // if (name === "billboardType") {
    //   if (value === "static" || value === "bespoke") {
    //     setValue("numberOfSlotsOrFaces", ""); // Reset numberOfSlots
    //   }
    //   if (value === "digital" || value === "bespoke") {
    //     setValue("numberOfSlotsOrFaces", ""); // Reset numberOfFaces
    //   }
    // }
  };

  // Generate a serial number when the modal is opened
  useEffect(() => {
    if (isOpen) {
      const newSerialNumber = generateSerialNumber(); // Generate a new serial number
      setValue("serialNumber", newSerialNumber); // Set the serial number in the form
      // setFormData((prev) => ({ ...prev, serialNumber: newSerialNumber }));
    }
  }, [isOpen]);

  const handleStateChange = (stateName: string) => {
    const selectedState = states.find((state) => state.name === stateName);
    setLGA(selectedState?.lgas || []);
    setValue("state", stateName, { shouldValidate: true });
    setValue("lga", "", { shouldValidate: true }); // Reset LGA selection
  };

  // Function to generate a serial number
  const generateSerialNumber = () => {
    // return uuidv4();

    //using timestamp-based serial number
    return `SN-${Date.now()}`;
  };

console.log(formData);

  const handleAddBillboard = async (data: any) => {
    const base64Images = await convertImagesToBase64(uploadedImages);

     // Prepare faces data for static billboards
  // const faces = formData.billboardType === "static" 
  // ? Array.from({ length: parseInt(formData.numberOfSlotsOrFaces) }).map((_, index) => ({
  //     number: index + 1,
  //     description: formData.faceDescriptions[index] || ""
  //   }))
  // : [];

    // Format faces data
    const faces = formData.billboardType === "static" 
    ? Object.entries(formData.faceDescriptions).map(([number, description]) => ({
        number: parseInt(number),
        description
      }))
    : [];

    // Prepare the payload
    const payload = {
      // Other form fields...
      ...data,

      // serialNumber: "6768702",
      images: base64Images, // Include Base64 images
      faceDescriptions: formData.billboardType === "static" ? faces : undefined,

    };

    // console.log(payload);
    onSubmit(payload);
    // Reset form data after submission
    setFormData({
      serialNumber: "",
      internalCode: "",
      billboardName: "",
      state: "",
      lga: "",
      address: "",
      geolocation: { lat: "", lng: "" },
      dimension: "", 
      height: "",
      width: "",
      billboardType: "Static",
      mediaType: "",
      numberOfSlotsOrFaces: "",
      faceDescriptions: {},
      showDescriptionInputFor: null,
      pricePerDay: "",
      pricePerMonth: "",
      status: "Active",
      activeStatus: "Vacant",
      images: [],
      orientation: "Landscape",
    });
    setUploadedImages([]); // Reset uploaded images
    // clear data from react-hook-form register

    // onClose();s
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
              <div>Create New Billboaard</div>
            </div>
          </Dialog.Title>

          <Dialog.Description className="grid grid-cols-12  gap-y-3 max-h-[90vh] overflow-y-auto ">
            <form
              onSubmit={handleSubmit(handleAddBillboard)}
              className="col-span-12 rounded-lg w-full max-w-2xl  md:p-4 space-y-8 "
            >
            

              <ImageUploadSection
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
              />

              <div className="col-span-12 ">
                <FormLabel
                  htmlFor="billboardNumber"
                  className="font-medium lg:text-[16px] text-black"
                >
                  Billboard Number
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  {...register("serialNumber")}
                  readOnly
                  id="serialNumber"
                  type="text"
                  placeholder="6768787"
                />
              </div>

              {/* Billboard Code */}

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="internalCode "
                >
                  Billboard Internal Code
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="internalCode"
                  type="text"
                  placeholder="Type here"
                  {...register("internalCode")}
                />
                {errors.internalCode && (
                  <p className="text-red-500">
                    {errors.internalCode.message?.toString()}
                  </p>
                )}
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="billboardName"
                >
                  Billboard Name
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  id="billboardName"
                  type="text"
                  placeholder="Type here"
                  {...register("billboardName")}
                />
                {errors.billboardName && (
                  <p className="text-red-500">
                    {errors.billboardName.message?.toString()}
                  </p>
                )}
              </div>


              <div className=" col-span-12 flex space-x-4">
                <div className=" w-1/2 relative intro-y">
                  <FormLabel
                    className="font-medium lg:text-[16px] text-black"
                    htmlFor="state"
                  >
                    State
                  </FormLabel>

                  <FormSelect
                    id="state"
                    formSelectSize="lg"
                    {...register("state", {
                      onChange: (e) => {
                        handleChange(e);
                        handleStateChange(e.target.value);
                      },
                    })}
                    // className="bg-gray-50 px-2.5 pb-1 pt-5  text-sm   peer"
                  >
                    <option value="" disabled>
                      --Select--
                    </option>
                    {states.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </FormSelect>

                  {errors?.state && (
                    <p className="text-red-500">
                      {errors.state.message?.toString()}
                    </p>
                  )}
                </div>

                {/* LGA of Origin */}
                <div className="w-1/2 relative intro-y">
                  <FormLabel
                    className="hidden md:block font-medium lg:text-[16px] text-black"
                    htmlFor="lga"
                  >
                    Local Government Area
                  </FormLabel>
                  <FormLabel
                    className="md:hidden font-medium lg:text-[16px] text-black"
                    htmlFor="lga"
                  >
                    LGA
                  </FormLabel>

                  <FormSelect
                    id="lga"
                    formSelectSize="lg"
                    onChange={(e) =>
                      setValue("lga", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <option value="" disabled>
                      --Select LGA--
                    </option>
                    {lgas.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </FormSelect>

                  {errors?.lga && (
                    <p className="text-red-500">
                      {errors.lga.message?.toString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="address"
                >
                  Address
                </FormLabel>
                <FormTextarea
                  formTextareaSize="lg"
                  id="address"
                  placeholder="Type here"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-red-500">
                    {errors.address.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <FormLabel className="font-medium lg:text-[16px] text-black">
                  Geolocation (Lat, Lng)
                </FormLabel>
                <div className="flex space-x-2">
                  <FormInput
                    formInputSize="lg"
                    type="text"
                    // name="lat"
                    // value={formData.geolocation.lat}
                    {...register("lat")}
                    className="w-1/2"
                    placeholder="Latitude"
                  />
                  <FormInput
                    formInputSize="lg"
                    type="text"
                    // name="lng"
                    // value={formData.geolocation.lng}
                    {...register("lng")}
                    // onChange={(e) =>
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     geolocation: {
                    //       ...prev.geolocation,
                    //       lng: e.target.value,
                    //     },
                    //   }))
                    // }
                    className="w-1/2"
                    placeholder="Longitude"
                  />
                </div>
      
              </div>

               

 <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="mediaType"
                >
                  Media Type
                </FormLabel>
                <FormSelect
                  id="mediaType"
                  formSelectSize="lg"
                  {...register("mediaType", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option disabled selected value="">
                    --Select--
                  </option>

                  <option value="48sheet">48Sheet</option>
                  <option value="Bridge panel">Bridge panel</option>
                  <option value="Bulletin">Bulletin</option>
                  <option value="Eye catcher">Eye catcher</option>
                  <option value="Full gantry">Full gantry</option>
                  <option value="Half gantry">Half gantry</option>
                  <option value="Half ring">Half ring</option>
                  <option value="Long Banner">Long Banner</option>
                  <option value="Long Banner">Long Banner</option>
                  <option value="Megaboard">Megaboard</option>
                  <option value="Pillars">Pillars</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Rooftop">Rooftop</option>
                  <option value="Standalone">Standalone</option>
                  <option value="Static">Static</option>
                  <option value="Triple static">Triple static</option>
                  <option value="Unipole">Unipole</option>
                  <option value="Wallmount">Wallmount</option>
                  <option value="Lampole">Lampole</option>
                  <option value="Standalone LED">Standalone LED</option>
                  <option value="LED">LED</option>


                </FormSelect>
                {errors.mediaType && (
                  <p className="text-red-500">
                    {errors.mediaType.message?.toString()}
                  </p>
                )}
              </div> 

<div className="col-span-12">
  <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="billboardType">
    Billboard Type
  </FormLabel>
  <FormSelect
    id="billboardType"
    formSelectSize="lg"
    {...register("billboardType", {
      onChange: (e) => {
        handleChange(e);
      },
    })}
    className="w-full p-2 border rounded"
  >
    <option disabled selected value="">--Select--</option>
    <option value="static">Static</option>
    <option value="digital">Digital</option>
    <option value="bespoke">Bespoke (Innovative)</option>
  </FormSelect>
  {errors.billboardType && (
    <p className="text-red-500">{errors.billboardType.message?.toString()}</p>
  )}
</div>

{/* Dimension */}
<div className="col-span-12">
  <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="dimension">
    Dimension
  </FormLabel>
  <FormSelect
    formSelectSize="lg"
    {...register("dimension", {
      onChange: (e) => {
        handleChange(e);
      },
    })}
    className="w-full p-2 border rounded"
  >
    <option value="" disabled selected>--select--</option>
    <option value="Standard">Standard</option>
    <option value="Custom">Custom</option>
  </FormSelect>
  {errors.dimension && (
    <p className="text-red-500">{errors.dimension.message?.toString()}</p>
  )}
</div>

{/* Conditional fields for Standard dimensions */}
{formData.dimension === "Standard" && formData.billboardType === "static" && (
  <div className="col-span-12">
    <FormLabel className="font-medium lg:text-[16px] text-black">
      Select Standard Size (Static) M
    </FormLabel>
    <FormSelect
      formSelectSize="lg"
      {...register("standardSize", {
        onChange: (e) => {
          const [width, height] = e.target.value.split("X");
          setValue("width", width.trim());
          setValue("height", height.trim());
        },
      })}
      className="w-full p-2 border rounded"
    >
      <option value="" disabled selected>--Select Size--</option>
      <option value="8 X 10">8M X 10M</option>
      <option value="15 X 2.5">15M X 2.5M</option>
      <option value="43 X 2">43M X 2M</option>
      <option value="20 X 1.9">20M X 1.9M</option>
      <option value="36 X 1.9">36M X 1.9M</option>
      <option value="46 X 3M">46M X 3M</option>
      <option value="18 X 2.4">18M X 2.4M</option>
      <option value="60 X 10">60M X 10M</option>
      <option value="23 X 7">23M X 7M</option>
      <option value="30 X 5">30M X 5M</option>
      <option value="12 X 3">12M X 3M</option>
      
    </FormSelect>
  </div>
)}

{formData.dimension === "Standard" && formData.billboardType === "digital" && (
  <div className="col-span-12">
    <FormLabel className="font-medium lg:text-[16px] text-black">
      Select Standard Size (Digital) M
    </FormLabel>
    <FormSelect
      formSelectSize="lg"
      {...register("standardSize", {
        onChange: (e) => {
          const [width, height] = e.target.value.split("X");
          setValue("width", width.trim());
          setValue("height", height.trim());
        },
      })}
      className="w-full p-2 border rounded"
    >
      <option value="" disabled selected>--Select Size--</option>
      <option value="60 X 6.4">60M X 6.4M</option>
      <option value="35 X 7">35M X 7M</option>
      <option value="33 X 7">33M X 7M</option>
      <option value="8.32 X 6.4">8.32 X 6.4M</option>
      <option value="18 X 14">18M X 14M</option>
    </FormSelect>
  </div>
)}

{/* Custom input for width and height */}
{formData.dimension === "Custom" && (
  <div className="col-span-12 flex space-x-2">
    <div className="w-1/2">
      <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="width">
        Width (Mt)
      </FormLabel>
      <FormInput
        formInputSize="lg"
        id="width"
        type="text"
        placeholder="Width"
        {...register("width")}
        className="p-2 border rounded"
      />
    </div>
    <div className="w-1/2">
      <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="height">
        Height (Mt)
      </FormLabel>
      <FormInput
        formInputSize="lg"
        id="height"
        type="text"
        placeholder="Height"
        {...register("height")}
        className="p-2 border rounded"
      />
    </div>
  </div>
)}

  
              {/* Number of Slots for Digital FormSelection only*/}

              {(formData.billboardType === "digital" ||
                formData.billboardType === "static") && (
                <div className="col-span-12">
                  <FormLabel
                    className="font-medium lg:text-[16px] text-black"
                    htmlFor="numberOfSlotsOrFaces"
                  >
                    {formData.billboardType === "digital"
                      ? "Number of Slots"
                      : "Number of Faces"}
                  </FormLabel>
                  <FormSelect
                    formSelectSize="lg"
                    // name="numberOfSlots"
                    value={formData.numberOfSlotsOrFaces}
                    {...register("numberOfSlotsOrFaces", {
                      onChange: (e) => {
                        handleChange(e);
                      },
                    })}
                    className="w-full p-2 border rounded"
                  >
                      <option value=""  selected>
                            --Select-- 
                          </option>
                    {formData.billboardType === "digital"
                      ? [...Array(8)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Slot {i + 1}
                          </option>
                        ))
                      : [...Array(4)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Face {i + 1}
                          </option>
                        ))}
                  </FormSelect>
                </div>
              )}

{/* face description */}

{/* {(formData.billboardType === "static" && formData.numberOfSlotsOrFaces) && (
  <div className="col-span-12 space-y-4">
    <h4 className="font-medium">Face Descriptions</h4>
    <div className="col-span-12 text-sm text-gray-500 mt-1">
  {formData.billboardType === "static" && 
   "Add descriptions to help identify each face's location/direction"}
</div>
    {Array.from({ length: parseInt(formData.numberOfSlotsOrFaces) }).map((_, index) => (
      <div key={index} className="space-y-2">
        <FormLabel
          className="font-medium text-sm"
          htmlFor={`faceDescription-${index}`}
        >
          Description for Face {index + 1}
        </FormLabel>
        <FormInput
          formInputSize="lg"
          id={`faceDescription-${index}`}
          type="text"
          placeholder="E.g., 'Facing northbound traffic'"
          value={formData.faceDescriptions[index] || ""}
          onChange={(e) => {
            const newDescriptions = [...formData.faceDescriptions];
            newDescriptions[index] = e.target.value;
            setFormData(prev => ({ ...prev, faceDescriptions: newDescriptions }));
          }}
          className="w-full p-2 border rounded"
        />
      </div>
    ))}
  </div>
)} */}



{formData.billboardType === "static" && formData.numberOfSlotsOrFaces && (
  <div className="col-span-12 space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="font-medium">Face Descriptions</h4>
      {Object.keys(formData.faceDescriptions).length < parseInt(formData.numberOfSlotsOrFaces) && (
        <button
          type="button"
          onClick={() => setShowFaceSelector(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Description
        </button>
      )}
    </div>

    {/* Face selector modal */}
    {showFaceSelector && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-sm w-full">
          <h3 className="font-medium mb-4">Select Face to Describe</h3>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: parseInt(formData.numberOfSlotsOrFaces) })
              .map((_, index) => index + 1)
              .filter(faceNum => !formData.faceDescriptions[faceNum])
              .map(faceNum => (
                <button
                  key={faceNum}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      showDescriptionInputFor: faceNum
                    }));
                    setShowFaceSelector(false);
                  }}
                  className="p-2 border rounded hover:bg-gray-50"
                >
                  Face {faceNum}
                </button>
              ))}
          </div>
          <button
            onClick={() => setShowFaceSelector(false)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* Description inputs for selected faces */}
    {Object.entries(formData.faceDescriptions).map(([faceNum, description]) => (
      // <div key={faceNum} className="space-y-2 border p-3 rounded-lg bg-slate-100">
      //   <div className="flex justify-between items-center ">
      //     <div className="font-medium text-customColor  max-w-3/4 ">Face {faceNum} - <span className="font-normal text-black">{ description}</span> </div>
      //     <button
      //       type="button"
      //       onClick={() => {
      //         const newDescriptions = { ...formData.faceDescriptions };
      //         delete newDescriptions[parseInt(faceNum)];
      //         setFormData(prev => ({
      //           ...prev,
      //           faceDescriptions: newDescriptions
      //         }));
      //       }}
      //       className="text-red-500 hover:text-red-700 text-sm"
      //     >
      //       Remove
      //     </button>
      //   </div>
        
      //   <FormInput
      //     formInputSize="lg"
      //     value={description}
      //     onChange={(e) => {
      //       setFormData(prev => ({
      //         ...prev,
      //         faceDescriptions: {
      //           ...prev.faceDescriptions,
      //           [faceNum]: e.target.value
      //         }
      //       }));
      //     }}
      //     placeholder="E.g., 'Facing northbound traffic'"
      //     className="w-full p-2 border rounded"
      //   />
      // </div>

<div key={faceNum} className="space-y-2 border p-3 rounded-lg bg-slate-100">
<div className="flex justify-between items-start gap-2"> {/* Changed to items-start and added gap */}
  <div className="font-medium text-customColor flex-1 min-w-0"> {/* Added flex-1 and min-w-0 */}
    <span className="whitespace-nowrap">Face {faceNum} - </span> {/* Prevent number from wrapping */}
    <span className="font-normal text-black break-words"> {/* Added break-words */}
      {description}
    </span>
  </div>
  <button
    type="button"
    onClick={() => {
      const newDescriptions = { ...formData.faceDescriptions };
      delete newDescriptions[parseInt(faceNum)];
      setFormData(prev => ({
        ...prev,
        faceDescriptions: newDescriptions
      }));
    }}
    className="text-red-500 hover:text-red-700 text-sm flex-shrink-0" 
  >
    Remove
  </button>
</div>
</div>


    ))}

    {/* Input for newly selected face */}
    {formData.showDescriptionInputFor && (
      <div className="space-y-2 border p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Face {formData.showDescriptionInputFor}</span>
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                showDescriptionInputFor: null
              }));
            }}
            className="text-blue-500 hover:text-red-700 text-sm"
          >
            Done
          </button>
        </div>
        <FormInput
          formInputSize="lg"
          value={formData.faceDescriptions[formData.showDescriptionInputFor] || ""}
          onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              faceDescriptions: {
                ...prev.faceDescriptions,
                [formData.showDescriptionInputFor]: e.target.value
              }
            }));
          }}
          onBlur={() => {
            if (!formData.faceDescriptions[formData.showDescriptionInputFor]) {
              setFormData(prev => ({
                ...prev,
                showDescriptionInputFor: null
              }));
            }
          }}
          placeholder="E.g., 'Facing northbound traffic'"
          className="w-full p-2 border rounded"
        />
      </div>
    )}
  </div>
)}
         

               {/* Price Per Month */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="pricePerMonth"
                >
                  Amount (Per Month)
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  
                  type="number"
                  value={formData.pricePerMonth}

                  {...register("pricePerMonth", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Price Per Day */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="pricePerDay"
                >
                  Amount (Per Day)
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  // name="pricePerDay"
                  type="text"
                  disabled
                  value={`₦${formatCurrency(Number(formData?.pricePerDay))}`}

                  {...register("pricePerDay", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.pricePerDay && (
                  <p className="text-red-500">
                    {errors.pricePerDay.message?.toString()}
                  </p>
                )}
              </div>

             

              {/* status */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="status"
                >
                  Status
                </FormLabel>
                <FormSelect
                  formSelectSize="lg"
                  // name="status"
                  value={formData.status}
                  {...register("status", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="under_maintenance">Under Maintenance</option>
                </FormSelect>
                {errors.status && (
                  <p className="text-red-500">
                    {errors.status.message?.toString()}
                  </p>
                )}
              </div>


              {/* board orientation */}
              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="orientation"
                >
                  Board Orientation
                </FormLabel>
                <FormSelect
                  // name="orientation"
                  formSelectSize="lg"
                  {...register("orientation", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="cube">Cube</option>
                </FormSelect>
                {errors.orientation && (
                  <p className="text-red-500">
                    {errors.orientation.message?.toString()}
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

export default BillboardCreationModal;
