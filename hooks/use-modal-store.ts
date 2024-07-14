import { ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "leaveServer"
  | "deleteServer"
  | "createChannel"
  | "createServer"
  | "members"
  | "invite"
  | "editServer";

interface ModelData {
  server?: Server;
  channelType?: ChannelType;
}

// define state & their types
interface ModalStore {
  type: ModalType | null;
  data?: ModelData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModelData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));
