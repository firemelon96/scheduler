import React, { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex items-center pt-20 justify-center'>{children}</div>
  );
};

export default AuthLayout;
