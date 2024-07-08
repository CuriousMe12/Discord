import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";

type ServerId = {
  serverId: string;
};

interface InviteParams {
  params: ServerId;
}

export async function PATCH(req: Request, { params }: InviteParams) {
  try {
    const serverId = params?.serverId;
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    // db call
    const newServer = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
    return NextResponse.json(newServer);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
