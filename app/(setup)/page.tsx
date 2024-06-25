import InitialModel from "@/components/models/initial-model";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/intial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  // Normally the array in model is array of other models always
  const server = await db.server.findFirst({
    where: {
      member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) redirect(`/servers/${server.id}`);

  return <InitialModel />;
};

export default SetupPage;
