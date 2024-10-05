'use server';

import { db } from '@/lib/prisma';
import { availabilitySchema } from '@/types/schema';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

export async function getUserAvailability() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const userExist = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: {
        include: { days: true },
      },
    },
  });

  if (!userExist || !userExist.availability) {
    return null;
  }

  const availabilityData: Record<string, any> = {
    timeGap: userExist.availability.timeGap,
  };

  [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ].forEach((day) => {
    const dayAvailability = userExist.availability?.days.find(
      (d) => d.day === day.toUpperCase()
    );

    availabilityData[day] = {
      isAvailable: !!dayAvailability,
      startTime: dayAvailability
        ? dayAvailability.startTime.toISOString().slice(11, 16)
        : '09:00',
      endTime: dayAvailability
        ? dayAvailability.endTime.toISOString().slice(11, 16)
        : '17:00',
    };
  });

  return availabilityData;
}

export async function updateAvailability(
  values: z.infer<typeof availabilitySchema>
) {
  const validatedFields = availabilitySchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  const { userId } = auth();
  const validFields = validatedFields.data;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const userExist = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: true,
    },
  });

  if (!userExist) {
    throw new Error('User not found');
  }

  type AvailabilityDay = {
    isAvailable: boolean;
    startTime?: string;
    endTime?: string;
  };

  type AvailabilityFields = {
    monday: AvailabilityDay;
    tuesday: AvailabilityDay;
    wednesday: AvailabilityDay;
    thursday: AvailabilityDay;
    friday: AvailabilityDay;
    saturday: AvailabilityDay;
    sunday: AvailabilityDay;
  };

  enum Day {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
  }

  const availabilityData = Object.entries(
    validFields as AvailabilityFields
  ).flatMap(([day, { isAvailable, startTime, endTime }]) => {
    if (isAvailable) {
      const baseDate = new Date().toISOString().split('T')[0];

      const enumDay = day.toUpperCase() as keyof typeof Day;

      return [
        {
          day: Day[enumDay],
          startTime: new Date(`${baseDate}T${startTime}:00Z`),
          endTime: new Date(`${baseDate}T${endTime}:00Z`),
        },
      ];
    }
    return [];
  });

  if (userExist.availability) {
    await db.availability.update({
      where: { id: userExist.availability.id },
      data: {
        timeGap: validFields.timeGap,
        days: {
          deleteMany: {},
          create: availabilityData,
        },
      },
    });
  } else {
    await db.availability.create({
      data: {
        userId: userExist.id,
        timeGap: validFields.timeGap,
        days: {
          create: availabilityData,
        },
      },
    });
  }

  return { success: true };
}
