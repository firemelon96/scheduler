import { Booking, Event, User } from '@prisma/client';

export type UserWithoutMeta = Pick<
  User,
  'email' | 'name' | 'imageUrl' | 'username'
>;

export type UserNameEmail = Pick<User, 'name' | 'email'>;

export type EventTypeWithoutMeta = Omit<
  Event,
  'userId' | 'createdAt' | 'updatedAt'
>;

export type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type FieldPath =
  | `${Day}.isAvailable`
  | `${Day}.startTime`
  | `${Day}.endTime`
  | 'timeGap';

export type BookingWithoutMeta = Pick<
  Booking,
  'eventId' | 'additionalInfo' | 'email' | 'endTime' | 'startTime' | 'name'
>;

export type MeetingType = 'upcoming' | 'past';

export type BookingWithEventAndUser = Booking & {
  event: Event & {
    user: UserNameEmail;
  };
};

export type BookingWithEvent = Booking & {
  event: {
    title: string;
  };
};
