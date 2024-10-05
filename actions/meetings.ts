import { db } from '@/lib/prisma';
import { MeetingType } from '@/types/types';
import { auth } from '@clerk/nextjs/server';

export async function getUserMeetings(type: MeetingType) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();

  const meetings = await db.booking.findMany({
    where: {
      userId: user.id,
      startTime: type === 'upcoming' ? { gte: now } : { lt: now },
    },
    include: {
      event: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: type === 'upcoming' ? 'asc' : 'desc',
    },
  });

  return meetings;
}
