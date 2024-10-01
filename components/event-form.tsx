import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { eventSchema } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useTransition } from 'react';
import { createEvent } from '@/actions/events';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
  onSubmitClose: () => void;
};

export const EventForm = ({ onSubmitClose }: Props) => {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: 30,
      isPrivate: true,
    },
  });

  const router = useRouter();

  const [isPending, setTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof eventSchema>) => {
    setTransition(() => {
      createEvent(values)
        .then(() => toast.success('Event created!'))
        .catch((error) => toast.error(error.message))
        .finally(() => {
          onSubmitClose();
          router.refresh();
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='px-4 space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input disabled={isPending} placeholder='title...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder='description...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='duration'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder='description...'
                  disabled={isPending}
                  type='number'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isPrivate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event privacy</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={(value) => field.onChange(value === 'true')}
                defaultValue={field.value ? 'true' : 'false'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select privacy' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='true'>Private</SelectItem>
                  <SelectItem value='false'>Public</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} className='w-full' type='submit'>
          Create
        </Button>
      </form>
    </Form>
  );
};
