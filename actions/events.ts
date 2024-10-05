'use server';

import { db } from '@/lib/prisma';
import { eventSchema } from '@/types/schema';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import {
  startOfDay,
  addDays,
  format,
  parseISO,
  isBefore,
  addMinutes,
} from 'date-fns';
import { Booking } from '@prisma/client';

export async function createEvent(values: z.infer<typeof eventSchema>) {
  const validatedFields = eventSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }
  const { userId } = auth();
  const validData = validatedFields.data;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const userExist = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!userExist) {
    throw new Error('User not found');
  }

  const event = await db.event.create({
    data: {
      ...validData,
      userId: userExist.id,
    },
  });

  return event;
}

export async function getUserEvents() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized!');
  }

  const userExist = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!userExist) {
    throw new Error('User not found!');
  }

  const events = await db.event.findMany({
    where: { userId: userExist.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return { events, username: userExist.username };
}

export async function deleteEvent(eventId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized!');
  }

  const userExist = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!userExist) {
    throw new Error('User not found!');
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.userId !== userExist.id) {
    throw new Error('Event not found or unauthorized');
  }

  await db.event.delete({
    where: { id: eventId },
  });

  return { success: true };
}

export async function getEventDetails(username: string, eventId: string) {
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  return event;
}

type BookingTime = Pick<Booking, 'startTime' | 'endTime'>;

export async function getEventAvailability(eventId: string) {
  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      user: {
        include: {
          availability: {
            select: {
              days: true,
              timeGap: true,
            },
          },
          bookings: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });

  if (!event || !event.user.availability) {
    return [];
  }

  const { availability, bookings } = event.user;

  const startDate = startOfDay(new Date());
  const endDate = addDays(startDate, 30);

  const availableDates = [];

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const dayOfWeek = format(date, 'EEEE').toUpperCase();
    const dayAvailability = availability.days.find((d) => d.day === dayOfWeek);

    if (dayAvailability) {
      const dateStr = format(date, 'yyyy-MM-dd');

      const slots = generateAvailableTimeSlots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        event.duration,
        bookings,
        dateStr,
        availability.timeGap || 0
      );

      availableDates.push({
        date: dateStr,
        slots,
      });
    }
  }

  return availableDates;
}

function generateAvailableTimeSlots(
  startTime: Date,
  endTime: Date,
  duration: number,
  bookings: BookingTime[],
  dateStr: string,
  timeGap: number
) {
  const slots = [];

  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );

  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  const now = new Date();
  if (format(now, 'yyyy-MM-dd') === dateStr) {
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  while (currentTime < slotEndTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    const isSlotAvailable = !bookings.some((booking) => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;

      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (currentTime <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    if (isSlotAvailable) {
      slots.push(format(currentTime, 'HH:mm'));
    }

    currentTime = slotEnd;
  }

  return slots;
}
