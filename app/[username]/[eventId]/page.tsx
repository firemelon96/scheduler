import { getEventAvailability, getEventDetails } from '@/actions/events';
import { notFound } from 'next/navigation';
import EventDetails from './_components/event-details';
import { Suspense } from 'react';
import BookingForm from './_components/booking-form';
import { defaultAvailability } from '@/app/(main)/availability/data';

type Props = {
  params: { username: string; eventId: string };
};

export async function generateMetadata({ params }: Props) {
  const event = await getEventDetails(params.username, params.eventId);

  if (!event) {
    return {
      title: 'Event not found',
    };
  }

  return {
    title: `Book ${event?.title} with ${event.user.name} | Scheduler`,
    description: `Book an event with ${event?.user.name}. View available public events and schedules.`,
  };
}

const EventIdPage = async ({ params }: Props) => {
  const event = await getEventDetails(params.username, params.eventId);
  const availability = await getEventAvailability(params.eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className='flex flex-col items-start justify-center lg:flex-row px-4 py-8'>
      <EventDetails event={event} />
      <Suspense fallback={<div>Looading booking form...</div>}>
        <BookingForm event={event} availability={availability} />
      </Suspense>
    </div>
  );
};

export default EventIdPage;
