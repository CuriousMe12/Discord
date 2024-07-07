import { Channel, Member, Profile, Server } from "@prisma/client";

// server & channel & (member & profile)[]
export type ServerWithMemberWithProfile = Server & {
  channel: Channel[];
  member: (Member & { profile: Profile })[];
};
