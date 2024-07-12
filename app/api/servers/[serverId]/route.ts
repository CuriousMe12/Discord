import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type ServerId = {
  serverId: string;
};

interface Params {
  params: ServerId;
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { serverId } = params;
    const { name, imageUrl } = await req.json();
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
        name,
        imageUrl,
      },
    });
    return NextResponse.json(newServer);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

interface DeleteServerProps {
  params: { serverId: string };
}

export async function DELETE(req: Request, { params }: DeleteServerProps) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    if (!params?.serverId)
      return new NextResponse("ServerId is required", { status: 401 });

    // db call fro deleting the server in database...
    await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });

    return new NextResponse("Server deleted successfully!", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
