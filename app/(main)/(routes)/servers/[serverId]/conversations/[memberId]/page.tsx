import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { getOrCreateConversations } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageParams {
  params: { memberId: string; serverId: string };
}

const MemberIdPage = async ({ params }: MemberIdPageParams) => {
  // find current logged in user profile from database...
  const profile = await currentProfile();

  if (!profile) return RedirectToSignIn;

  // Get the member data of the logged in user
  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect("/");

  // get the conversation between these two members
  const conversation = await getOrCreateConversations(
    params.memberId,
    currentMember.id
  );

  if (!conversation) return redirect(`/servers/${params.serverId}`);

  // extract the memberOne & memberTwo
  const memberOne = conversation?.memberOne;
  const memberTwo = conversation?.memberTwo;

  // decide the other member on the basis of profileId
  const otherMember =
    memberOne?.profileId === profile?.id ? memberTwo : memberOne;

  console.log("Hello", conversation);

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember?.profile.imageUrl}
        name={otherMember?.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
      <ChatMessages
        member={currentMember}
        name={otherMember.profile.name}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/api/direct-messages"
        paramKey="conversationId"
        paramValue={conversation.id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id,
        }}
      />
      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default MemberIdPage;
