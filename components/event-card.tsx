'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Trash } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deleteEvent } from '@/actions/events';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { EventTypeWithoutMeta } from '@/types/types';

type Props = {
  event: EventTypeWithoutMeta & {
    _count: {
      bookings: number;
    };
  };
  username: string;
  isPublic: boolean;
};

export const EventCard = ({ event, username, isPublic }: Props) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${username}/${event.id}`
      );
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    startTransition(() => {
      deleteEvent(event.id)
        .then(() => {
          toast.success('Deleted successfully');
          router.refresh();
        })
        .catch((error) => toast.error(error.message));
    });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target as HTMLElement;
    if (element.tagName !== 'BUTTON' && element.tagName !== 'SVG') {
      window?.open(
        `${window?.location.origin}/${username}/${event.id}`,
        '_blank'
      );
    }
  };

  return (
    <Card
      className='flex flex-col justify-between cursor-pointer'
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className='text-2xl'>{event.title}</CardTitle>
        <CardDescription className='flex justify-between'>
          <span>
            {event.duration} mins | {event.isPrivate ? 'Private' : 'Public'}
          </span>
          <span>{event._count.bookings} Bookings</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{event.description}</p>
      </CardContent>
      {!isPublic && (
        <CardFooter className='space-x-4'>
          <Button
            variant='outline'
            className='flex items-center'
            onClick={handleCopy}
            disabled={isPending}
          >
            <Link className='size-4 mr-2' /> {isCopied ? 'Copied' : 'Copy link'}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='secondary'
                disabled={isPending}
                className='flex items-center'
              >
                <Trash className='size-4 mr-2' />
                {isPending ? 'Deleting...' : 'Delete event'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your eveent and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    disabled={isPending}
                    onClick={handleDelete}
                    className='bg-red-500 hover:bg-red-600 text-white'
                  >
                    Yes, Delete event
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
};
