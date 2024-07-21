"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import FileUpload from "../FileUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";
import toast from "react-hot-toast";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "server Image is required" }),
});

const MessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const openModal = isOpen && type === "messageFile";
  const router = useRouter();
  const { apiUrl, query } = data;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      const response = axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      await toast.promise(response, {
        loading: "Image uploading!",
        success: "File uploaded successfully",
        error: "Failed to upload File",
      });
      form.reset();
      router.refresh();
      window.location.reload();
    } catch (err) {}
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={openModal} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center font-bold text-2xl">
            Add an attachment
          </DialogTitle>

          <DialogDescription className="text-center">
            Send a file as message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        endpoint="messageFile"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-4 py-5">
              <Button disabled={isLoading} type="submit" variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
