"use client";

import { useState } from "react";
import axios from "axios";
import { ServerWithMemberWithProfile } from "@/types";
import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Channel } from "@prisma/client";
import qs from "query-string";

const DeleteMessageModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const { apiUrl, query } = data;

  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteMessage";
  const { channel } = data as { channel: Channel };

  const [isLoading, setIsLoading] = useState(false);

  // api call for removing the member from current channel...
  const onDelete = async () => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: { ...query },
      });
      await axios.delete(url);
      onClose();
      router.refresh();
    } catch (err) {}
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center font-bold text-2xl">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-zinc-700">
            Are you sure you want to do this ? <br />
            The message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-200 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onDelete} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
