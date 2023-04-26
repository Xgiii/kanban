'use client';

import React, { useState } from 'react';
import EllipsisVertical from './EllipsisVertical';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils';
import { useSWRConfig } from 'swr';

function BoardHeader({
  boardName,
  onClick,
}: {
  boardName: string;
  onClick: () => void;
}) {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function deleteBoardHandler() {
    setLoading(true);
    const response = await fetch(`/api/boards`, {
      method: 'PUT',
      body: JSON.stringify({
        href: '/' + slugify(boardName),
        uid: session?.user?._id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    mutate('/api/boards');
    router.replace('/');
    setLoading(false);
  }

  return (
    <header className='bg-gray-700 h-16 fixed w-full md:w-[80%] py-3 px-8 border-b border-b-gray-600'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='font-bold text-2xl text-white'>{boardName}</h1>
        <div className='flex items-center space-x-4'>
          <button
            onClick={onClick}
            className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full'
          >
            + Add New Task
          </button>
          <EllipsisVertical
            onClick={() => setOpenMenu((prevState) => !prevState)}
            className='cursor-pointer relative hover:text-gray-400'
          />
          {openMenu && (
            <div className='absolute top-16 right-0 bg-gray-700 p-4 rounded-lg shadow-2xl'>
              <button onClick={deleteBoardHandler} className='text-red-500'>
                {loading ? 'Loading...' : 'Delete Board'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default BoardHeader;
