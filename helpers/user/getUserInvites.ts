import { getServerSession } from "next-auth";
import { InviteStatus } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Get all invites for a user. Default status is PENDING, but other status can be passed via props.
 * @param {InviteStatus} [status='PENDING'] - The status of invites to fetch. Available status: PENDING, ACCEPTED, EXPIRED, REJECTED
 * @returns {Promise<Array<any>>} A promise that resolves to an array of invites for the user.
 * Each invite includes details about the project, board, and sender.
 */
export const getUserInvites = async (
  status: InviteStatus = InviteStatus.PENDING
): Promise<Array<any>> => {
  const session = await getServerSession(authOptions);

  const invites = await db.invite.findMany({
    where: {
      recipientId: session?.user.id,
      status: status,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: true,
      board: true,
      sender: true,
    },
  });

  return invites;
};
