import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface PatchParams {
  params: { serverId: string };
}

export async function PATCH(req: Request, { params }: PatchParams) {
  try {
    const profile = await currentProfile();

    if (!profile)
      return new NextResponse("unAuthorized access", { status: 401 });

    if (!params.serverId)
      return new NextResponse("ServerId required", { status: 400 });

    const { serverId } = params;

    const response = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
      },
      data: {
        member: {
          deleteMany: {
            profileId: profile?.id,
          },
        },
      },
    });
    return NextResponse.json(response);
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
