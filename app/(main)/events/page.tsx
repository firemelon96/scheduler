import { getUserEvents } from '@/actions/events';
import { EventCard } from '@/components/event-card';
import React, { Suspense } from 'react';

const Events = async () => {
  const { events, username } = await getUserEvents();
  return (
    <Suspense fallback={<div>Loading events...</div>}>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {events.map((event) => (
          <EventCard
            isPublic={false}
            key={event.id}
            event={event}
            username={username}
          />
        ))}
      </div>
    </Suspense>
  );
};

export default Events;
