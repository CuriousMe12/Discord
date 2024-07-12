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

const DeleteServerModal = () => {
  const { isOpen, type, onClose, data } = useModal();

  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data as { server: ServerWithMemberWithProfile };

  const [isLoading, setIsLoading] = useState(false);

  // api call for removing the member from current channel...
  const onDeleteServer = async () => {
    try {
      setIsLoading(true);
      const response = axios.delete(`/api/servers/${server?.id}`);
      await toast.promise(response, {
        loading: "Deleting server...",
        success: "Server deleted successfully!",
        error: "Error deleting server!",
      });
      router.refresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center font-bold text-2xl">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-zinc-700">
            Are you sure you want to do this ? <br />
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{" "}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-200 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onDeleteServer}
              variant="primary"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
