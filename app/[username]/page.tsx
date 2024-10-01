import { getUserByUsername } from '@/actions/users';
import { EventCard } from '@/components/event-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { notFound } from 'next/navigation';

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    return {
      title: 'User not found',
    };
  }

  return {
    title: `${user.name}'s Profile | Scheduler`,
    description: `Book an event with ${user.name}. View available public events and schedules.`,
  };
}

const UsersPage = async ({ params }: Props) => {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col items-center mb-8'>
        <Avatar className='size-24 mb-4'>
          <AvatarImage src={user.imageUrl || ''} alt={user?.name || ''} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className='text-3xl font-bold mb-2'>{user.name}</h1>
        <p className='text-gray-600 text-center'>
          Welcome to my scheduling web app. Please select an event below to book
          a call with me. {params.username}
        </p>
      </div>

      {user.events.length === 0 ? (
        <p className='text-center text-gray-600'>No public events available.</p>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {user.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              username={params.username}
              isPublic
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
