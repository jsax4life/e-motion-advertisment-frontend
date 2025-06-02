import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog } from "../../base-components/Headless";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
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
  billboard: Billboard;

  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface Billboard {
  id: string;
  serialNumber: string;
  internalCode: string;
  billboardName: string;
  billboardType: "static" | "digital" | "bespoke";
  mediaType: string;
  numberOfSlotsOrFaces: number;
  numberOfFaces: number;
  pricePerDay: number;
  state: string;
  lga: string;
  address: string;
  lat: string;
  lng: string;
  dimension: string; // Default dimension
  height: string;
  width: string;
  available_slots: number[];
  available_faces: number[];
  faces: { faceNumber: number; description: string }[];

  pricePerMonth: string;
  status: string;
  activeStatus: string;
  images: [];
  orientation: string;
}

const BillboardEditingModal: React.FC<BillboardCreationModalProps> = ({
  isOpen,
  isLoading,
  billboard,
  onClose,
  onSubmit,
}) => {
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [updatedFields, setUpdatedFields] = useState({});
  const { states, loading, error } = useFetchStates();
  const [lgas, setLGA] = useState<string[]>([]);

  const [formData, setFormData] = useState<any>(billboard);

  const validationSchema = yup.object().shape({
    // internalCode: yup.string().required("Billboard Code is required"),
    // billboardName: yup.string().required("Billboard Name is required"),
    // state: yup.string().required("State is required"),
    lga: yup.string().required("LGA is required"),
    address: yup.string().required("Adddress is required"),
    lat: yup.string().required("Latitude is required"),
    lng: yup.string().required("Longitude is required"),
    // height: yup.string().required("Height is required"),
    // width: yup.string().required("Width is required"),
    // numberOfSlots: yup.string().required("Number of Slots is required"),
    // numberOfFaces: yup.string().required("Number of Faces is required"),
    pricePerDay: yup.string().required("Price Per Day is required"),
    // pricePerMonth: yup.string().required("Price Per Month is required"),
    // status : yup.string().required("Status is required"),
    // activeStatus: yup.string().required("Active Status is required"),
    orientation: yup.string().required("Board Orientation is required"),
    mediaType: yup.string().required("Media Type is required"),
  });

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

    // useEffect(() => {
    //   setFormData(watchedData); // Update local state on change
    // }, [watchedData]);

  

    useEffect(() => {
    // Initialize lga data with the billboard data
    if (billboard && billboard?.state && states.length > 0) {
      const selectedState = states.find(
        (state) => state.name === billboard.state
      );
      // console.log("selectedState", selectedState);
      setLGA(selectedState?.lgas || []);
      // setValue('billboardType', billboard.billboardType, { shouldValidate: true });
      // setValue("state", billboard.state, { shouldValidate: true });
      // setValue("lga", billboard.lga, { shouldValidate: true });

    } }, [billboard, states]);

//     if(!billboard) return;
//     // initialize lgas state on the initial billboard data
// if(billboard?.lga) {
// console.log("Billboard LGA:", billboard.lga);
// setLGA(billboard?.lga ? [billboard.lga] : []);

// }

  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(watchedData)) {
      // Function to get only the updated fields
      const getUpdatedFields = (
        original: FormData,
        updated: FormData
      ): Partial<FormData> => {
        let changes: Partial<FormData> = {};
        Object.keys(updated).forEach((key) => {
          if (original !== updated) {
            changes = updated; // Include only changed fields
          }
        });
        return changes;
      };

      const changes = getUpdatedFields(
        formData as FormData,
        watchedData as FormData
      );

      // Merge the new changes with the existing `updatedFields`
      setUpdatedFields((prevFields) => ({
        ...prevFields,
        ...changes,
      }));

      setFormData(watchedData); // Update the formData state
    }
  }, [formData, watchedData]);

  //   console.log(uploadedImages);

  const handleStateChange = (stateName: string) => {
    const selectedState = states.find((state) => state.name === stateName);
    setLGA(selectedState?.lgas || []);
    setValue("state", stateName, { shouldValidate: true });
    setValue("lga", "", { shouldValidate: true }); // Reset LGA selection
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setValue(name, value); // Ensure React Hook Form tracks this change

    if (name === "pricePerDay") {
      const pricePerDay = parseFloat(value);
      const pricePerMonth = pricePerDay * 30; // Assuming 30 days in a month

      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [name]: value,
        pricePerMonth: pricePerMonth.toFixed(2), // Round to 2 decimal places
      }));
    } else {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    // Handle logic for resetting dependent fields
    if (name === "billboardType") {
      if (value === "static" || value === "bespoke") {
        setValue("numberOfSlotsOrFaces", ""); // Reset numberOfSlots
      }
      if (value === "digital" || value === "bespoke") {
        setValue("numberOfSlotsOrFaces", ""); // Reset numberOfFaces
      }
    }
  };

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

  const handleEditillboard = async (data: any) => {
    console.log("true");
    const base64Images = await convertImagesToBase64(uploadedImages);

    // Prepare the payload
    const payload = {
      // Other form fields...
      ...data,
      // serialNumber: "6768702",
      images: base64Images, // Include Base64 images
    };

    console.log(payload);

    if (Object.keys(updatedFields).length === 0 && updatedFields.constructor === Object) {
      alert("No fields have been updated.");
      throw new Error("Object is empty");
      

    }
    

    console.log(updatedFields);
    onSubmit(updatedFields);
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
              <div>Edit Billboaard</div>
            </div>
          </Dialog.Title>

          <Dialog.Description className="grid grid-cols-12  gap-y-3 max-h-[90vh] overflow-y-auto ">
            <form
              onSubmit={handleSubmit(handleEditillboard)}
              className="col-span-12 rounded-lg w-full max-w-2xl  md:p-4 space-y-8 "
            >
              {/* image */}
              {/* <div className="col-span-12">
              <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="images">Images</FormLabel>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div> */}

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
                  value={billboard?.serialNumber}
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
                  defaultValue={billboard?.internalCode}
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

              {/* <div className="col-span-12">
                <FormLabel className="font-medium lg:text-[16px] text-black" htmlFor="lga">Local Government Area</FormLabel>
                <FormInput
                formInputSize="lg"
                    defaultValue={billboard?.lga}
                  id="lga"
                  type="text"
                  placeholder="Type here"
                  {...register("lga")}
                />
                {errors.lga && ( <p className="text-red-500">{errors.lga.message?.toString()}</p>)}
              </div> */}

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
                    defaultValue={billboard?.state}
                    onChange={(e) => {
                      setValue("state", e.target.value, {
                        shouldValidate: true,
                      });
                      handleStateChange(e.target.value);
                    }}
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
                    defaultValue={billboard?.lga}
                    {...register("lga", {
                      onChange: (e) => {
                        handleChange(e);
                      },
                    })}
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
                  Addresss
                </FormLabel>
                <FormInput
                  formInputSize="lg"
                  defaultValue={billboard?.address}
                  id="address"
                  type="address"
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
                    defaultValue={billboard?.lat}
                    type="text"
                    // name="lat"
                    // defaultValue={formData.geolocation.lat}
                    {...register("lat")}
                    className="w-1/2"
                    placeholder="Latitude"
                  />
                  <FormInput
                    formInputSize="lg"
                    defaultValue={billboard?.lng}
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
                {/* { errors.lat  && ( <p className="text-red-500">{errors.lat.message?.toString()} </p>)}
                { errors.lng  && ( <p className="text-red-500">{errors.lng.message?.toString()} </p>)} */}
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
                  defaultValue={billboard?.orientation}
                  {...register("orientation", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  onChange={(e) =>
                    setValue("orientation", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </FormSelect>
                {errors.orientation && (
                  <p className="text-red-500">
                    {errors.orientation.message?.toString()}
                  </p>
                )}
              </div>

              {/* media type */}

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
                  defaultValue={billboard?.mediaType}
                  {...register("mediaType", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  onChange={(e) =>
                    setValue("mediaType", e.target.value, {
                      shouldValidate: true,
                    })
                  }
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

              {/* dimension */}

              {billboard?.dimension && (
                <div className="col-span-12">
                  <FormLabel
                    className="font-medium lg:text-[16px] text-black"
                    htmlFor="dimension"
                  >
                    Dimension
                  </FormLabel>
                  <FormSelect
                    formSelectSize="lg"
                    defaultValue={billboard?.dimension}
                    {...register("dimension", {
                      onChange: (e) => {
                        handleChange(e);
                      },
                    })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="" disabled selected>
                      --select--
                    </option>

                    <option value="Standard">Standard</option>
                    <option value="Custom">Custom</option>
                  </FormSelect>
                  {errors.dimension && (
                    <p className="text-red-500">
                      {errors.dimension.message?.toString()}
                    </p>
                  )}
                </div>
              )}

              {/* specifications */}

              {(billboard.dimension === "Custom" ||
                billboard.dimension === "Standard") && (
                <div className="col-span-12 flex space-x-2">
                  <div className="w-1/2 ">
                    <FormLabel
                      className="font-medium lg:text-[16px] text-black"
                      htmlFor="width"
                    >
                      Width(M)
                    </FormLabel>
                    <FormInput
                      formInputSize="lg"
                      defaultValue={billboard?.width}
                      id="width"
                      type="text"
                      placeholder="Width"
                      {...register("width")}
                      className="p-2 border rounded"
                    />
                  </div>

                  <div className="w-1/2 ">
                    <FormLabel
                      className="font-medium lg:text-[16px] text-black"
                      htmlFor="height"
                    >
                      Height(M)
                    </FormLabel>
                    <FormInput
                      formInputSize="lg"
                      defaultValue={billboard?.height}
                      id="height"
                      type="text"
                      placeholder="Height"
                      {...register("height")}
                      className=" p-2 border rounded"
                    />
                  </div>
                </div>
              )}

              {/* Billboard Type */}

              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="billboardType"
                >
                  Billboard Type
                </FormLabel>
                <FormSelect
                  id="billboardType"
                  formSelectSize="lg"
                  defaultValue={billboard?.billboardType}
                  
                  {...register("billboardType", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                 
                  className="w-full p-2 border rounded pointer-events-none bg-gray-100 text-gray-500"

                >
                  <option disabled selected value="">
                    --Select--
                  </option>

                  <option value="static">Static</option>
                  <option value="digital">Digital</option>
                  <option value="bespoke">Bespoke (Innovative)</option>
                </FormSelect>
                {errors.billboardType && (
                  <p className="text-red-500">
                    {errors.billboardType.message?.toString()}
                  </p>
                )}
              </div>

              {/* if the activestatus of the billboard is occupied, the user should be able to select more face or slot, else if it's vacant, the face or slot can be increased or decreased */}

              {billboard.billboardType && (

                <>
  <div className="col-span-12">
    <FormLabel
      className="font-medium lg:text-[16px] text-black"
      htmlFor="numberOfSlotsOrFaces"
    >
      {billboard.billboardType === "digital"
        ? "Number of Slots"
        : "Number of Faces"}
    </FormLabel>

    <FormSelect
      formSelectSize="lg"
      defaultValue={billboard?.numberOfSlotsOrFaces}
      {...register("numberOfSlotsOrFaces")}
      className="w-full p-2 border rounded"
    >
    


{(() => {
        const current = billboard?.numberOfSlotsOrFaces || 1;
        const isDigital = billboard.billboardType === "digital";
        const max = isDigital ? 8 : 3;
        let options: number[] = [];

        if (billboard.activeStatus === "occupied") {
          // Only allow increasing from current to max
          for (let i = current; i <= max; i++) {
            options.push(i);
          }
        } else if (billboard.activeStatus === "vacant") {
          // Allow both increasing and decreasing within 1 to max
          for (let i = 1; i <= max; i++) {
            options.push(i);
          }
        }

        return options.map((val) => (
          <option key={val} value={val}>
            {isDigital ? "Slots" : "Faces"} {val}
          </option>
        ));
      })()}
    </FormSelect>
  </div>



    {/* Show editable face descriptions only for static billboards */}
    {billboard.billboardType === "static" && (
      <div className="col-span-12 grid grid-cols-1 gap-4 mt-4">
        {Array.from({
          length: watch("numberOfSlotsOrFaces") || billboard.numberOfSlotsOrFaces || 1,
        }).map((_, index) => {
          const defaultDesc = billboard.faces?.[index]?.description || "";
          return (
            <div key={index}>
              <FormLabel htmlFor={`faceDescriptions.${index}.description`}>
                Face {index + 1} Description
              </FormLabel>

              <FormInput
                  formInputSize="sm"
                  // name="pricePerDay"
                  type="text"
                  defaultValue={defaultDesc}
                  {...register(`faceDescriptions.${index}.description`)}

                  className="w-full p-2 border rounded"
                />
             
              <input
                type="hidden"
                value={index + 1}
                {...register(`faceDescriptions.${index}.number`)}
              />
            </div>
          );
        })}
      </div>
    )}
    </>
)}

              

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
                  type="number"
                  defaultValue={billboard?.pricePerDay}
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
                  disabled
                  type="text"
                  value={formatCurrency(
                    Number(
                      formData.pricePerMonth
                        ? formData.pricePerMonth
                        : billboard.pricePerMonth
                    )
                  )}
                  {...register("pricePerMonth", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full p-2 border rounded"
                />
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
                      <div className=" text-xs text-center">Editing...</div>
                    </div>
                  ) : (
                    "Submit"
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

export default BillboardEditingModal;
