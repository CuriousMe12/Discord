import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface UpdateMemberRoleParams {
  params: { memberId: string };
}

export async function PATCH(req: Request, { params }: UpdateMemberRoleParams) {
  try {
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    if (!serverId)
      return new NextResponse("Server Id is missing", { status: 400 });

    if (!params.memberId)
      return new NextResponse("Member Id is missing", { status: 400 });

    // update members data via server => Learning
    const newServer = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        member: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        member: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
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

export async function DELETE(req: Request, { params }: UpdateMemberRoleParams) {
  try {
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    if (!serverId)
      return new NextResponse("Server Id is missing", { status: 400 });

    if (!params.memberId)
      return new NextResponse("Member Id is missing", { status: 400 });

    // update members data via server => Learning
    const newServer = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        member: {
          delete: {
            id: params.memberId,
          },
        },
      },
      include: {
        member: {
          include: {
            profile: true,
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
