import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) return RedirectToSignIn;

  if (!params.inviteCode) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
      member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) return redirect(`/servers/${server?.id}`);

  // use invite code for getting the server
  const newServer = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      member: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });

  if (newServer) return redirect(`/servers/${newServer?.id}`);

  return null;
};

export default InviteCodePage;
