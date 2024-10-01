'use server';

import { db } from '@/lib/prisma';
import { formSchema } from '@/types/schema';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';

export async function updateUsername(values: z.infer<typeof formSchema>) {
  const validatedField = formSchema.safeParse(values);

  if (!validatedField.success) {
    throw new Error('Invalid fields');
  }

  const { userId } = auth();
  const { username } = validatedField.data;

  if (!userId) throw new Error('Unauthorized');

  const existingUsername = await db.user.findUnique({
    where: { username },
  });

  if (existingUsername && existingUsername.id !== userId) {
    throw new Error('Username is already taken');
  }

  await db.user.update({
    where: { clerkUserId: userId },
    data: { username },
  });

  await clerkClient.users.updateUser(userId, {
    username,
  });

  return { success: true };
}

export async function getUserByUsername(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      events: {
        where: {
          isPrivate: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          isPrivate: true,
          _count: {
            select: { bookings: true },
          },
        },
      },
    },
  });

  return user;
}
