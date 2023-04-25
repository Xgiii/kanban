'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function AuthCheck({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: any;
}) {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <p className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
        Loading...
      </p>
    );
  }

  return status === 'authenticated' ? (
    <>{children}</>
  ) : (
    fallback || (
      <Link
        className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400'
        href='/enter'
      >
        You must be signed in
      </Link>
    )
  );
}

export default AuthCheck;
