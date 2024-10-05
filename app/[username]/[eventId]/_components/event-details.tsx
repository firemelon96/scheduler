import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserWithoutMeta } from '@/types/types';
import { Event } from '@prisma/client';
import { Calendar, Clock } from 'lucide-react';

type Props = {
  event: Event & {
    user: UserWithoutMeta;
  };
};

const EventDetails = ({ event }: Props) => {
  const { user } = event;
  return (
    <div className='p-10 lg:w-1/3 w-full md:h-[746px] bg-white'>
      <h1 className='text-3xl font-bold mb-4'>{event.title}</h1>
      <div className='flex items-center mb-4'>
        <Avatar className='size-12 mr-4'>
          <AvatarImage src={user.imageUrl || ''} alt={user.name || ''} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className='text-xl font-semibold'>{user.name}</h2>
          <p className='text-gray-600'>{user.username}</p>
        </div>
      </div>

      <div className='flex items-center mb-2'>
        <Clock className='mr-2 size-4' />
        <span>{event.duration} minutes</span>
      </div>
      <div className='flex items-center mb-4'>
        <Calendar className='mr-2 size-4' />
        <span>Google meet</span>
      </div>
      <p className='text-gray-700'>{event.description}</p>
    </div>
  );
};

export default EventDetails;
