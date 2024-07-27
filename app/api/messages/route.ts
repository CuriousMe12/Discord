import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) return new NextResponse("Unauthorised Call", { status: 400 });

    if (!channelId)
      return new NextResponse("ChannelId is missing", { status: 401 });

    let messages: Message[] = [];

    // getting the first messages in batches
    // [Order change of query will also work]
    if (cursor)
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    else
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        take: MESSAGE_BATCH,
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    let nextCursor = null;

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (err) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
