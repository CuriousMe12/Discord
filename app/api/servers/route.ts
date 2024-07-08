import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";

type ServerId = {
  serverId: string;
};

interface Params {
  params: ServerId;
}

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    // db call
    const newServer = await db.server.create({
      data: {
        name,
        profileId: profile.id,
        inviteCode: uuidv4(),
        imageUrl: imageUrl,
        channel: {
          create: {
            name: "General",
            profileId: profile.id,
            type: ChannelType.TEXT,
          },
        },
        member: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });
    return NextResponse.json(newServer);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
