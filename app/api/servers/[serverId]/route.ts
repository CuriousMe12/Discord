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
    const { name } = await req.json();
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
      },
    });
    return NextResponse.json(newServer);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
