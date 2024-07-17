import { db } from "./db";

/**
 * finds conversation between two members
 * @param memberOneId String - member one Id
 * @param memberTwoId String - member Two Id
 * @returns find the conversation
 */
export const getOrCreateConversations = async (
  memberOneId: string,
  memberTwoId: string
) => {
  const conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));
  if (conversation) return conversation;
  return await createNewConversation(memberOneId, memberTwoId);
};

/**
 * finds conversation between two members
 * @param memberOneId String - member one Id
 * @param memberTwoId String - member Two Id
 * @returns conversation between the given members if exists else null
 */
const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (err) {
    return null;
  }
};

/**
 * creates new conversation between two members
 * @param memberOneId String - member one Id
 * @param memberTwoId String - member Two Id
 * @returns created conversation between the given members if exists else null
 */
const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (err) {
    return null;
  }
};
