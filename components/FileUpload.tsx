"use client";

import { UploadDropzone } from "@uploadthing/react";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone<UploadThingEndpoints, UploadThingConfig>
      endpoint={endpoint}
      onClientUploadComplete={(res: any) => {
        onChange(res?.[0].fileUrl);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default FileUpload;
