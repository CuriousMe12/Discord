import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

const currentProfile = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) return;

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};

export { currentProfile };
