import { TestimonialCarousel } from '@/components/testimonial-carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, Clock, LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: Calendar,
    title: 'Create Events',
    description: 'Easily set up and customize your event types',
  },
  {
    icon: Clock,
    title: 'Manage Availability',
    description: 'Define your availability to streamline scheduling',
  },
  {
    icon: LinkIcon,
    title: 'Custom Links',
    description: 'Share your personalized scheduling link',
  },
];

const howItWorks = [
  { step: 'Sign Up', description: 'Create your free Schedulrr account' },
  {
    step: 'Set Availability',
    description: "Define when you're available for meetings",
  },
  {
    step: 'Share Your Link',
    description: 'Send your scheduling link to clients or colleagues',
  },
  {
    step: 'Get Booked',
    description: 'Receive confirmations for new appointments automatically',
  },
];

export default function Home() {
  return (
    <main className='container mx-auto px-4 py-16'>
      <div className='flex flex-col lg:flex-row items-center justify-between gap-12 mb-24'>
        <div className='lg:w-1/2 '>
          <h1 className='text-7xl font-extrabold pb-6 gradient-title'>
            Simplify appointment booking
          </h1>
          <p className='text-xl text-gray-600 mb-10'>
            Scheduler helps you manage your time eeffectively. Create events,
            set your availabillity, abd let others book time with you seemessly.
          </p>
          <Link href='/dashboard'>
            <Button size='lg' className='text-lg'>
              Get started <ArrowRight className='ml-2 size-5' />
            </Button>
          </Link>
        </div>
        <div className='lg:w-1/2 flex justify-center'>
          <div className='relative w-full max-w-md aspect-square'>
            <Image
              src='/team.png'
              layout='fill'
              alt='Team illustration'
              className='object-fit aspect-square'
            />
          </div>
        </div>
      </div>

      <div className='mb-24'>
        <h2 className='text-3xl font-bold text-center mb-12 text-blue-600'>
          Features
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className='size-12 text-blue-500 mb-4 mx-auto' />
                <CardTitle className='text-center text-gray-600'>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-center text-gray-600'>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className='mb-24'>
        <h2 className='text-3xl font-bold text-center mb-12 text-blue-600'>
          What our users say
        </h2>
        <TestimonialCarousel />
      </div>

      <div className='mb-24'>
        <h2 className='text-3xl font-bold text-center mb-12 text-blue-600'>
          How it works
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {howItWorks.map((how, index) => (
            <div key={index} className='text-center'>
              <div className='bg-blue-100 rounded-full size-16 flex items-center justify-center mx-auto mb-4'>
                <span className='text-blue-600 font-bold text-xl'>
                  {index + 1}
                </span>
              </div>
              <h3 className='text-lg font-semibold mb-2'>{how.step}</h3>
              <p className='text-gray-600'>{how.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-blue-600 text-white rounded-lg p-8 text-center'>
        <h2 className='text-3xl font-bold mb-4'>
          Ready too simplify your Scheduling?
        </h2>
        <p className='text-xl mb-6'>
          Join thousands of professionals who trust scheduler for efficient time
          management.
        </p>
        <Link href='/dashboard'>
          <Button size='lg' variant='secondary' className='text-blue-600'>
            Start for free <ArrowRight className='ml-2 size-5' />
          </Button>
        </Link>
      </div>
    </main>
  );
}
