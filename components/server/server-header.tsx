"use client";

import { ServerWithMemberWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface ServerHeaderProps {
  role?: MemberRole;
  server: ServerWithMemberWithProfile;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <button
          className="w-full text-md font-semibold px-3 flex
         items-center h-12 border-neutral-200 
         dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
         dark:hover:bg-zinc-700/50 transition"
        >
          {server.name}
          <ChevronDown className="h-5 w-5 ml-3" />
        </button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};

export default ServerHeader;
