import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) return loggedInUser;

    const name = `${user.firstName} ${user.lastName}`;
    const username = name.split(' ').join('-') + user.id.slice(-4);

    await clerkClient().users.updateUser(user.id, {
      username,
    });

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username,
      },
    });

    return newUser;
  } catch (error) {
    console.error(error);
  }
};
