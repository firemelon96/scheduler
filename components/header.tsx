import Image from 'next/image';
import Link from 'next/link';
import { PenBox } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { UserMenu } from './user-menu';
import { checkUser } from '@/lib/check-user';

export const Header = async () => {
  await checkUser();
  return (
    <nav className='mx-auto py-2 flex justify-between px-4 items-center border-b-2 shadow-sm'>
      <Link href={'/'} className='flex items-center'>
        <Image
          src='/logo.svg'
          alt='logo'
          width={30}
          height={30}
          className='h-16 w-auto'
        />
      </Link>

      <div className='flex items-center gap-4'>
        <Link href='/events?create=true'>
          <Button>
            <PenBox className='mr-2 size-4' /> Create event
          </Button>
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl='/dashboard'>
            <Button variant='outline'>Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  );
};
