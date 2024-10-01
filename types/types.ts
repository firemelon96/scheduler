import { Event, User } from '@prisma/client';

export type UserWithoutMeta = Pick<
  User,
  'email' | 'name' | 'imageUrl' | 'username'
>;

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
