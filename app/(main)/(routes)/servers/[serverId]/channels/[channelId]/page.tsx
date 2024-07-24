import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
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
      <ChatMessages
        member={member}
        name={channel.name}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel?.id,
          serverId: channel?.serverId,
        }}
        paramKey="channelId"
        paramValue={channel.id}
      />
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
