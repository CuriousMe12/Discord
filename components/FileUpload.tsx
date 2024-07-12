"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage";
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  return (
    // <UploadDropzone
    //   endpoint={endpoint}
    //   onClientUploadComplete={(res) => {
    //     onChange(res[0].url);
    //   }}
    //   onUploadError={(error: Error) => {
    //     // Do something with the error.
    //     alert(`ERROR! ${error.message}`);
    //   }}
    // />
    <UploadButton
      endpoint={endpoint}
      appearance={{
        button: {
          background: "#3572EF",
          padding: "1rem",
          color: "#ffffff",
          marginBottom: "1vw",
        },
      }}
      onClientUploadComplete={(res) => {
        // Do something with the response
        onChange(res[0].url);
        toast.success("Image Uploaded Successfully!", {
          style: {
            fontSize: "20px",
          },
        });
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};

export default FileUpload;
