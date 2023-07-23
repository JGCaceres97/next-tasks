'use client';

import { Props } from '@/types/app';
import { SessionProvider } from 'next-auth/react';

function Providers({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default Providers;
