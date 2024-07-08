"use client";

import { useEffect, useState } from "react";
import InviteModel from "../models/invite-model";
import CreateServerModal from "../models/create-server-modal";
import EditServerModal from "../models/edit-server-modal";
import InitialModel from "../models/initial-model";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModel />
      <EditServerModal />
    </>
  );
};
