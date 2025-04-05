import { useDropzone } from "react-dropzone";
import { useState } from "react";

import { Dispatch, SetStateAction } from "react";
import Lucide from "../../base-components/Lucide";
import ImagesShape from "../../assets/images/images-shape.png"

interface ImageUploadSectionProps {
  uploadedImages: File[];
  setUploadedImages: Dispatch<SetStateAction<File[]>>;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  uploadedImages,
  setUploadedImages,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      // Only accept one image, replacing the previous
      if (acceptedFiles.length > 0) {
        setUploadedImages([acceptedFiles[0]]);
      }
    },
  });

  return (
    <div className="space-y-2 col-span-12">
      <div
        {...getRootProps()}
        className={`p-4 border-2 ${
          uploadedImages.length > 0 ? "border-green-500" : "border-dashed border-gray-300"
        } rounded-lg cursor-pointer hover:border-blue-500`}
      >
        <input {...getInputProps()} />
        {uploadedImages.length === 0 ? (
          <div className="flex flex-col gap-y-4 justify-center items-center text-sm">
            <img src={ImagesShape} alt="shape" className="w-8 h-8 place-self-center" />
            <p className="text-gray-500 font-medium">
              Drop your image here, or <span className="text-violet-500">browse</span>
            </p>
            <p className="text-gray-500 text-center">Only one picture is allowed. JPEG and PNG files only.</p>
          </div>
        ) : (
          <div className="relative w-full h-32">
            <img
              src={URL.createObjectURL(uploadedImages[0])}
              alt="uploaded-profile"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUploadedImages([]);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;