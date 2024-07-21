import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextResponseServerIO } from "@/types";
import { Member } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfile(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) return res.status(400).json({ error: "Unauthorised access" });

    if (!serverId)
      return res.status(401).json({ error: "Served Id is missing" });

    if (!channelId)
      return res.status(401).json({ error: "Channel Id is missing" });

    if (!content) return res.status(401).json({ error: "Content is missing" });

    // check if the user if a part of this server
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

    // check if part of the channel
    const channel = await db.channel.findUnique({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const member = server.member.find(
      (member: Member) => member?.profileId === channel?.profileId
    );

    if (!member) return res.status(404).json({ error: "Member not found" });

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
}
