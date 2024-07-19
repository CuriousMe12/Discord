import { Channel, Member, Profile, Server } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as ServerIOServer } from "socket.io";

export type NextResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIOServer;
    };
  };
};

// server & channel & (member & profile)[]
export type ServerWithMemberWithProfile = Server & {
  channel: Channel[];
  member: (Member & { profile: Profile })[];
};
