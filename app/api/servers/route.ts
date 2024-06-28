import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) return;

  const profile = await db.profile.findUnique({
    where: {
      id: userId,
    },
  });

  return profile;
};

export { currentProfile };
