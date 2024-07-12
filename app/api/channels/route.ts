import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const ChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required" })
    .refine((name) => name !== "general", {
      message: "Channel name can't be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("unAuthorizes", { status: 401 });

    // get query keys
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId)
      return new NextResponse("Server Id not present", { status: 400 });

    // get body
    const body = await req.json();

    // Validate the body against Channel Schema
    const validationResult = ChannelSchema.safeParse(body);
    if (!validationResult.success)
      return NextResponse.json(
        {
          message: "Input is Invalid",
          status: "error",
        },
        {
          status: 400,
        }
      );

    const { name, type } = validationResult.data;

    const server = await db.server.update({
      where: {
        id: serverId,
        member: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channel: {
          create: {
            profileId: profile.id,
            // serverId: serverId,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
