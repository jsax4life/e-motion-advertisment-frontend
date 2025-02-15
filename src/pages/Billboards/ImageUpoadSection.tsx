import { useDropzone } from "react-dropzone";
import { useState } from "react";

import { Dispatch, SetStateAction } from "react";
import Lucide from "../../base-components/Lucide";
import ImagesShape from "../../assets/images/images-shape.png"

interface ImageUploadSectionProps {
  uploadedImages: File[];
//   setUploadedImages: (files: File[]) => void;
  setUploadedImages: Dispatch<SetStateAction<File[]>>;

}
  
  const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
    uploadedImages,
    setUploadedImages,
  }) => {
//   const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
    setUploadedImages((prev: File[]) => [...prev, ...acceptedFiles.slice(0, 5 - prev.length)]);
    },
  });

  // console.log(uploadedImages.length);  

  return (
    <div className="space-y-2">
      {/* <label className="block text-sm font-medium">Upload Images (Max 10)</label> */}
      <div
        {...getRootProps()}
        className={`p-4 border-2 ${
          uploadedImages.length > 0 ? "border-green-500" : "border-dashed border-gray-300"
        } rounded-lg cursor-pointer hover:border-blue-500`}
      >
        <input {...getInputProps()} />
        {uploadedImages.length === 0 ? (
          <div className=" flex flex-col gap-y-4 justify-center items-center text-sm">
            <img src={ImagesShape} alt="shape" className="w-8 h-8 place-self-center"/>
            <p className="text-gray-500 font-medium">
            Drop your image here, or <span className="text-violet-500">browse</span> 
            </p>
            <p className=" text-gray-500">Max. of 5 images, JPEG and PNG files are allowed</p>
          </div>
        ) : (



            <div className="grid grid-cols-5 gap-4">
            {uploadedImages.map((file, index) => (
              
              <div key={index} className="relative ">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`uploaded-${index}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the drop zone from opening
                    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                >
                  &times;
                </button>
              </div>

              
             
            
            ))}

          {uploadedImages.length < 5 && (  <div className=" border-2 border-dashed rounded-lg border-green-500 flex justify-center items-center">
                <Lucide icon="Plus" className="text-green-500"/>
              </div>)}
         
          </div>

          )}
          
          
        {/* )} */}
      </div>
    </div>
  );
};


export default ImageUploadSection;

