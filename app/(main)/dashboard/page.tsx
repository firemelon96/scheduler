'use client';

import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useTransition } from 'react';
import { updateUsername } from '@/actions/users';
import { formSchema } from '@/types/schema';
import { toast } from 'sonner';
import { getLatestUpdates } from '@/actions/dashboard';
import { useRouter } from 'next/navigation';
import { BookingWithEvent } from '@/types/types';
import { format } from 'date-fns';

const Dashboard = () => {
  const { isLoaded, user } = useUser();

  const [meetingUpdates, setmeetingUpdates] = useState<
    BookingWithEvent[] | null
  >([]);

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [isPendingUpdate, startTransitionUpdate] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || '',
    },
  });

  useEffect(() => {
    startTransitionUpdate(() =>
      getLatestUpdates().then((data) => {
        setmeetingUpdates(data);
        router.refresh();
      })
    );
  }, []);

  useEffect(() => {
    form.setValue('username', user?.username || '');
  }, [isLoaded, form, user?.username]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      updateUsername(values)
        .then(() => toast.success('Username updated!'))
        .catch((error) => toast.error(error.message));
    });
  };

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Welcome {user?.firstName}</CardTitle>
        </CardHeader>
        <CardContent>
          {!isPendingUpdate ? (
            <div>
              {meetingUpdates && meetingUpdates.length > 0 ? (
                <ul>
                  {meetingUpdates.map((meeting) => (
                    <li key={meeting.id}>
                      {meeting.event.title} on{' '}
                      {format(
                        new Date(meeting.startTime),
                        'MMM d, yyyy h:mm a'
                      )}{' '}
                      With {meeting.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming meeting</p>
              )}
            </div>
          ) : (
            <p>No upcoming meetings</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your unique link</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                name='username'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center gap-2'>
                      <span>
                        {typeof window !== 'undefined' &&
                          window.location.origin}
                        /
                      </span>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder='username'
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isPending}>
                Update Username
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
