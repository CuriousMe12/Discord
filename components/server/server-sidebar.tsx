import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import ServerHeader from "./server-header";

interface ServerSidebarProps {
  serverId: String;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  // fetch server
  // It has a param server Id & its members contains
  // userId
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channel: {
        orderBy: {
          createdAt: "asc",
        },
      },
      member: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  // Learning: Filter type wise channels using enum used
  // in prisma....//....
  // Compare enums
  const textChannels = server?.channel.filter((channel: any) => {
    return channel.type === ChannelType.TEXT;
  });

  const audioChannels = server?.channel.filter((channel: any) => {
    return channel.type === ChannelType.AUDIO;
  });

  const videoChannels = server?.channel.filter((channel: any) => {
    return channel.type === ChannelType.VIDEO;
  });

  const members = server?.member.filter(
    (ele: any) => ele.profileId !== profile.id
  );

  if (!server) return redirect("/");

  const role = server?.member.find((ele) => ele.profileId === profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full bg-[#F2F3F5] dark:bg-[#2B2D31]">
      <ServerHeader role={role} server={server} />
    </div>
  );
};

export default ServerSidebar;
