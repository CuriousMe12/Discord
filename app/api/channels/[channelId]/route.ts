import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface DeleteChannelProps {
  params: { channelId: string };
}

export async function DELETE(req: NextRequest, { params }: DeleteChannelProps) {
  try {
    const profile = await currentProfile();

    if (!profile)
      return new NextResponse("unAuthorized access", { status: 400 });

    if (!params.channelId)
      return new NextResponse("Channel Id is required", { status: 401 });

    await db.channel.delete({
      where: {
        id: params.channelId,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Channel deleted successfully!",
    });
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
