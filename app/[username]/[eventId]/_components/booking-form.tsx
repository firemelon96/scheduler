'use client';

import { createBooking } from '@/actions/bookings';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { bookingSchema } from '@/types/schema';
import { BookingWithoutMeta, UserWithoutMeta } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Event } from '@prisma/client';
import { format } from 'date-fns';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
  event: Event & {
    user: UserWithoutMeta;
  };
  availability: {
    date: string;
    slots: string[];
  }[];
};

const BookingForm = ({ event, availability }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [eventLink, setEventLink] = useState<string | undefined>(undefined);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  const availableDays = availability.map((day) => new Date(day.date));

  const timeSlots = selectedDate
    ? availability.find(
        (day) => day.date === format(selectedDate, 'yyyy-MM-dd')
      )?.slots || []
    : [];

  useEffect(() => {
    if (selectedDate) {
      form.setValue('date', format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      form.setValue('time', selectedTime);
    }
  }, [selectedTime]);

  const onSubmit = (values: z.infer<typeof bookingSchema>) => {
    if (!selectedDate || !selectedTime) return;

    const startTime = new Date(
      `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`
    );
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData: BookingWithoutMeta = {
      eventId: event.id,
      name: values.name,
      email: values.email,
      startTime: startTime,
      endTime: endTime,
      additionalInfo: values.additionallInfo || '',
    };

    startTransition(() => {
      createBooking(bookingData)
        .then((data) => {
          toast.info(`Join the meeting: ${data.meetLink}`);
          setEventLink(data?.meetLink);
          form.reset();
        })
        .catch((error) => toast.error(error.message));
    });
  };

  if (eventLink) {
    return (
      <div className='text-center bg-white p-10 h-96 border-l-2'>
        <h2 className='text-2xl font-semibold mb-4'>Booking successful!</h2>
        <p>
          Join the meeting:{' '}
          <a
            href={eventLink}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline'
          >
            {eventLink}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col  gap-8 w-full md:w-auto p-10 border bg-white'>
      <div className=' flex md:h-80 flex-col md:flex-row gap-5 '>
        <div className='w-full'>
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={[{ before: new Date() }]}
            modifiers={{
              available: availableDays,
            }}
            modifiersStyles={{
              available: {
                background: 'lightblue',
                borderRadius: 100,
              },
            }}
          />
        </div>
        <div className='w-full h-full md:overflow-scroll'>
          {selectedDate && (
            <div className='mb-4'>
              <h3 className='text-lg font-semibold mb-2'>
                Available time slots
              </h3>
              <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    variant={selectedTime === slot ? 'default' : 'outline'}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTime && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} placeholder='Name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder='Email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='additionallInfo'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      {...field}
                      placeholder='Additional info...'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Scheduling...' : 'Schedule event'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default BookingForm;
