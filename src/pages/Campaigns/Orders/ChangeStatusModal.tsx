import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog } from "../../../base-components/Headless";
import {
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
import ImageUploadSection from "../../Billboards/ImageUpoadSection";

interface BillboardCreationModalProps {
  isOpen: boolean;
  campaign: any;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}



const ChangeStatusModal: React.FC<BillboardCreationModalProps> = ({
  isOpen,
  isLoading,
  campaign,
  onClose,
  onSubmit,
}) => {
  const [sendButtonRef] = useState(React.createRef<HTMLButtonElement>());

  const [formData, setFormData] = useState<any>();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);


  const validationSchema = yup.object().shape({
    status: yup.string().required("Status Code is required"),
    remarks: yup.string().required("Comment is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  //   console.log(uploadedImages);

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

  const handleChangeStatus = async (data: any) => {
    const base64Images = await convertImagesToBase64(uploadedImages);

    // Prepare the payload
    const payLoad = {
      ...data,
      delivery_images: base64Images,
    }

    console.log(payLoad);

    // console.log(formData);
    onSubmit(payLoad);
    // onClose();
  };

    console.log(campaign);

  //   console.log(formData);

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
          <Dialog.Title>
            <div className="flex justify-center items-center">
              <div className="bg-customColor/20 fill-customColor text-customColor mr-4 rounded-2xl p-3">
                <Lucide icon="Home" className="w-10 h-10" />
              </div>
              <div className="text-2xl">
                <h2 className="mr-auto text-xl text-slate-800 font-bold">
                  Status Change
                </h2>
                <p className=" text-sm text-slate-500">
                  Choose a state to update
                </p>
              </div>
            </div>
          </Dialog.Title>

          <Dialog.Description className="grid grid-cols-12  gap-y-3 max-h-[90vh] overflow-y-auto ">
            <form
              onSubmit={handleSubmit(handleChangeStatus)}
              className="col-span-12 rounded-lg w-full max-w-2xl  md:p-4 space-y-8 "
            >
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
                  defaultValue={campaign.status}
                  {...register("status", {
                    onChange: (e) => {
                      handleChange(e);
                    },
                  })}
                  className="w-full p-2 border rounded-lg py-3.5"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  {/* <option value="paid">Paid</option> */}
                  <option value="delivered">Delivered</option>

                </FormSelect>
                {errors.status && (
                  <p className="text-red-500">
                    {errors.status.message?.toString()}
                  </p>
                )}
              </div>

              {/* add picture upload if status option is delivered */}
              {formData?.status === "delivered" && (
                // <div className="col-span-12">
                //   <FormLabel
                //     className="font-medium lg:text-[16px] text-black"
                //     htmlFor="images"
                //   >
                //     Upload Picture
                //   </FormLabel>
                //   <div className="flex items-center justify-between space-x-4">
                //     <div className="w-full">
                //       <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                //         <div className="space-y-1 text-center">
                //           <svg
                //             className="mx-auto h-12 w-12 text-gray-400"
                //             stroke="currentColor"
                //             fill="none"
                //             viewBox="0 0 24 24"
                //             xmlns="http://www.w3.org/2000/svg"
                //           >
                //             <path
                //               strokeLinecap="round"
                //               strokeLinejoin="round"
                //               strokeWidth="2"
                //               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                //             />
                //           </svg>
                //           <div className="flex text-sm text-gray-600">
                //             <label
                //               htmlFor="file-upload"
                //               className="relative cursor-pointer bg-white rounded-md font-medium text-customColor hover:text-customColor focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-customColor"
                //             >
                //               <span>Upload a file</span>
                //               <input
                //                 id="file-upload"
                //                 // name="images"
                //                 type="file"
                //                 className="sr-only"
                //                 {...register("images")}
                //               />
                //             </label>
                //             <p className="pl-1">or drag and drop</p>
                //           </div>
                //           <p className="text-xs text-gray-500">
                //             PNG, JPG, GIF up to 10MB
                //           </p>
                //         </div>
                //       </div>
                //     </div>
                //   </div>
                // </div>
                  <ImageUploadSection
                  uploadedImages={uploadedImages}
                  setUploadedImages={setUploadedImages}
                />
              )}


              <div className="col-span-12">
                <FormLabel
                  className="font-medium lg:text-[16px] text-black"
                  htmlFor="remarks"
                >
                  Comment
                </FormLabel>
                <FormTextarea
                  formTextareaSize="lg"
                  id="remarks"
                  rows={5}
                  cols={5}
                  name="remarks"
                  onChange={handleChange}
                  placeholder="Add comment..."
                />
              </div>

              <div className="flex justify-end space-x-2 lg:text-lg text-sm">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={onClose}
                  className="w-auto  border-customColor text-customColor"
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
        
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default ChangeStatusModal;
