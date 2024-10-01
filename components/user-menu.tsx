'use client';
import { UserButton } from '@clerk/nextjs';
import { ChartNoAxesGantt } from 'lucide-react';

export const UserMenu = () => {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: 'w-10 h-10',
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label='My events'
          labelIcon={<ChartNoAxesGantt size={18} />}
          href='/events'
        />
        <UserButton.Action label='manageAccount' />
      </UserButton.MenuItems>
    </UserButton>
  );
};
