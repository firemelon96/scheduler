'use client';

import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { EventForm } from './event-form';

export const CreateEvent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const create = searchParams.get('create');
    if (create === 'true') {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    if (searchParams.get('create') === 'true') {
      router.replace(window.location.pathname);
    }
  };

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Event</DrawerTitle>
        </DrawerHeader>
        <EventForm onSubmitClose={handleClose} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline' onClick={handleClose}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
