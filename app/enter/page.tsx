'use client';

import { signIn } from 'next-auth/react';
import React from 'react';

function EnterPage() {
  return (
    <button
      onClick={() => signIn('google', {callbackUrl: '/'})}
      className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded'
    >
      Sing in with google
    </button>
  );
}

export default EnterPage;
