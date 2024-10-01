'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Autoplay from 'embla-carousel-autoplay';
import { AvatarImage } from '@radix-ui/react-avatar';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Manager',
    content:
      "Schedulrr has transformed how I manage my team's meetings. It's intuitive and saves us hours every week!",
    image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'David Lee',
    role: 'Freelance Designer',
    content:
      'As a freelancer, Schedulrr helps me stay organized and professional. My clients love how easy it is to book time with me.',
    image: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Emily Chen',
    role: 'Startup Founder',
    content:
      'Schedulrr streamlined our hiring process. Setting up interviews has never been easier!',
    image: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'Michael Brown',
    role: 'Sales Executive',
    content:
      "I've seen a 30% increase in my meeting bookings since using Schedulrr. It's a game-changer for sales professionals.",
    image: 'https://i.pravatar.cc/150?img=4',
  },
];

export const TestimonialCarousel = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className='w-full mx-auto'
    >
      <CarouselContent>
        {testimonials.map((feed, index) => (
          <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
            <Card className='h-full'>
              <CardContent className='flex flex-col h-full justify-between p-6'>
                <p className='text-gray-600 mb-4'>&quot;{feed.content}&quot;</p>
                <div className='flex items-center mt-4'>
                  <Avatar>
                    <AvatarImage src={feed.image} />
                    <AvatarFallback>
                      {feed.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='ml-2'>
                    <p className='font-semibold'>{feed.name}</p>
                    <p className='text-sm text-gray-500'>{feed.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
