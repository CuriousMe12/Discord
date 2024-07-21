"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="flex justify-center w-full">
        <div className="relative h-20 w-20">
          <Image src={value} alt="Upload" fill className="rounded-full" />
          <button
            type="button"
            title="Image"
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-600 dark:text-indigo-500 hover:underline"
        >
          {value}
        </a>
        <button
          type="button"
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

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
