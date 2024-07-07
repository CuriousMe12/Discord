import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const SeverIdLayout = async ({ children, params }: { children: ReactNode }) => {
  const profile = await currentProfile();

  if (!profile) return RedirectToSignIn;

  // fetch server
  // It has a param server Id & its members contains
  // userId
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  console.log(server);

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <div className="h-full md:pl-60">{children}</div>
    </div>
  );
};

export default SeverIdLayout;
