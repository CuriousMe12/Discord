"use client";

import { useEffect, useState } from "react";
import InviteModel from "../models/invite-model";
import CreateServerModal from "../models/create-server-modal";
import EditServerModal from "../models/edit-server-modal";
import MembersModel from "../models/members-modal";
import CreateChannelModal from "../models/create-channel-modal";
import LeaveServerModal from "../models/leave-server-modal";
import DeleteServerModal from "../models/delete-server-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <LeaveServerModal />
      <CreateChannelModal />
      <InviteModel />
      <DeleteServerModal />
      <EditServerModal />
      <MembersModel />
    </>
  );
};
