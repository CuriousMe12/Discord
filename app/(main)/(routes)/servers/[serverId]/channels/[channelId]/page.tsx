import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";

interface ChannelIdPageParams {
  params: { channelId: string; serverId: string };
}

const ChannelIdPage = async ({ params }: ChannelIdPageParams) => {
  const profile = await currentProfile();
  if (!profile) return RedirectToSignIn;

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channel?.name}
        serverId={params.serverId}
        imageUrl={channel?.imageUrl}
        type="channel"
      />
      <div className="flex-1">Future Messages</div>
      <ChatInput
        name={channel?.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel?.id,
          serverId: params?.serverId,
        }}
      />
    </div>
  );
};

export default ChannelIdPage;
