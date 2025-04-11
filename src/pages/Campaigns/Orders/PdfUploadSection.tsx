import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import Lucide from "../../../base-components/Lucide";

interface PdfUploadSectionProps {
  uploadedPdf: File | null;
  setUploadedPdf: Dispatch<SetStateAction<File | null>>;
}

const PdfUploadSection: React.FC<PdfUploadSectionProps> = ({
  uploadedPdf,
  setUploadedPdf,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedPdf(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="space-y-2 col-span-12">
    
        

    <div> 
                  Media Purchase Order Document
               
      </div>
  


      <div
        {...getRootProps()}
        className={`p-4 border-2 ${
          uploadedPdf ? "border-green-500" : "border-dashed border-gray-300"
        } rounded-lg cursor-pointer hover:border-blue-500`}
      >
        <input {...getInputProps()} />
        {!uploadedPdf ? (
          <div className="flex flex-col gap-y-4 justify-center items-center text-sm text-gray-500">
            {/* <Lucide icon="FileText" className="w-8 h-8 text-violet-500" /> */}
            <p>
              Drop your PDF here, or <span className="text-violet-500">browse</span>
            </p>
            {/* <p className="text-center">Only one file is allowed. PDF format only.</p> */}
          </div>
        ) : (
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Lucide icon="File" className="w-5 h-5 text-gray-600" />
              <p className="text-sm text-gray-800">{uploadedPdf.name}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUploadedPdf(null);
              }}
              className="text-red-500 hover:text-red-700 text-lg font-bold"
            >
              &times;
            </button>
          </div>
        )}
      </div>




    </div>
  );
};

export default PdfUploadSection;
