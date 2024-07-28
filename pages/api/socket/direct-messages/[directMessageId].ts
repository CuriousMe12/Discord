import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextResponseServerIO } from "@/types";
import { Member, MemberRole, Message } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextResponseServerIO
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed!" });
  }

  try {
    const profile = await currentProfile(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    // Validate params & body
    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!conversationId)
      return res.status(404).json({ error: "Conversation Id not found" });

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId as string,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) return res.status(404).json({ error: "member not found" });

    // Check if Message is deleted or not
    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted)
      return res.status(404).json({ error: "Message not found" });

    // check if editing is done by owner only
    const isMessageOwner = directMessage.memberId === directMessage.member.id;
    const isAdmin = directMessage.member.role === MemberRole.ADMIN;
    const isModerator = directMessage.member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify)
      return res.status(404).json({ error: "Unauthorized access" });

    // Perform db operation according to method
    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          deleted: true,
          content: "This message is deleted.",
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner)
        return res.status(404).json({ error: "Unauthorized access" });
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    // emit socket IO event
    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);
    return res.status(200).json(directMessage);
  } catch (err) {
    return res.status(500).json({ error: "Internal Error" });
  }
}
