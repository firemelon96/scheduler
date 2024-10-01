'use client';

import { z } from 'zod';
import { availabilitySchema } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectValue } from './ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import { timeSlots } from '@/app/(main)/availability/data';
import { useTransition } from 'react';
import { updateAvailability } from '@/actions/availability';
import { toast } from 'sonner';
import { Day } from '@/types/types';

type Props = {
  initialData: Record<string, any>;
};

const DAY_OF_THE_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as Day[];

export const AvailabilityForm = ({ initialData }: Props) => {
  const form = useForm<z.infer<typeof availabilitySchema>>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof availabilitySchema>) => {
    startTransition(() => {
      updateAvailability(values)
        .then(() => toast.success('Updated availability'))
        .catch((error) => toast.error(error.message));
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col items-start gap-2'
      >
        {DAY_OF_THE_WEEK.map((day) => (
          <div key={day} className='flex items-center space-x-4 '>
            <FormField
              name={`${day}.isAvailable`}
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex space-y-0 items-center space-x-4 h-9'>
                  <FormControl>
                    <Checkbox
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormLabel>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </FormLabel>
                </FormItem>
              )}
            />
            {form.watch(`${day}.isAvailable`) && (
              <>
                <FormField
                  name={`${day}.startTime`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='space-y-0 flex items-center gap-2'>
                      <FormLabel className='text-xs'>Start Time</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger disabled={isPending}>
                            <SelectValue placeholder='Start time' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  name={`${day}.endTime`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='space-y-0 flex items-center gap-2'>
                      <FormLabel className='text-xs'>End Time</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger disabled={isPending}>
                            <SelectValue placeholder='End time' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        ))}

        <FormField
          name='timeGap'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center gap-2'>
                <FormLabel className='w-48'>
                  Minimum gap before booking (minutes)
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder='gap'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className='w-32'
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant='default' disabled={isPending} type='submit'>
          submit
        </Button>
      </form>
    </Form>
  );
};
