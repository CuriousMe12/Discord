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
    const { channelId, serverId, messageId } = req.query;
    const { content } = req.body;

    // Validate params & body
    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!channelId)
      return res.status(400).json({ error: "Channel Id missing" });
    if (!serverId) return res.status(400).json({ error: "Server Id missing" });

    // Check is server is present
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        member: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        member: true,
      },
    });

    if (!server) return res.status(404).json({ error: "Server not found" });

    // Check is Channel is present
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
      },
    });

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    // Extract member from server members array
    const member = server.member.find(
      (member: Member) => member.profileId === profile.id
    );

    if (!member) return res.status(404).json({ error: "Member not found" });

    // Check if Message is deleted or not
    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted)
      return res.status(404).json({ error: "Message not found" });

    // check if editing is done by owner only
    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify)
      return res.status(404).json({ error: "Unauthorized access" });

    // Perform db operation according to method
    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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
    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (err) {
    return res.status(500).json({ error: "Internal Error" });
  }
}
