'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetcher, slugify } from '@/utils';
import Link from 'next/link';
import { Board } from '@/models';
import useSwr from 'swr';
import Modal from './Modal';
import { ObjectId } from 'mongodb';

function Sidebar() {
  const { data, isLoading } = useSwr('/api/boards', fetcher);

  const pathname = usePathname();
  const router = useRouter();

  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState(pathname);
  const [openNewBoardModal, setOpenNewBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBoards(data || []);
  }, [data]);

  async function addBoardHandler() {
    setLoading(true);
    if (newBoardName.length === 0) {
      return;
    }
    const newBoard = {
      name: newBoardName,
      href: slugify(newBoardName),
    };

    const response = await fetch('/api/boards', {
      method: 'POST',
      body: JSON.stringify({ board: newBoard }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return;
    }

    setBoards((prevBoards) => [...prevBoards, newBoard]);
    setActiveBoard(slugify(newBoardName));
    setOpenNewBoardModal(false);
    setNewBoardName('');
    router.push(`/${slugify(newBoardName)}`);
    setLoading(false);
  }

  return (
    <>
      <aside className='hidden md:fixed bg-gray-700 min-w-[20vw] h-screen md:flex flex-col space-y-8 border-r border-r-gray-600 z-10'>
        <h1
          className='text-white text-2xl font-bold pt-4 px-8 cursor-pointer'
          onClick={() => router.push('/')}
        >
          kanban
        </h1>
        <p className='uppercase text-xs text-gray-400 tracking-wider px-8'>
          all boards ({boards?.length || 0})
        </p>
        <div className='flex flex-col space-y-1 text-gray-300'>
          {isLoading && (
            <p className='animate-pulse font-bold mx-8'>Loading...</p>
          )}
          {boards?.map((board) => (
            <Link
              href={board.href}
              key={board.href}
              className={`${
                activeBoard === board.href ? 'bg-indigo-600 ' : 'bg-gray-700'
              } rounded-r-full px-8 mr-4 py-2 cursor-pointer hover:bg-indigo-600 transition-all`}
              onClick={() => setActiveBoard(board.href)}
            >
              {board.name}
            </Link>
          ))}
          <p
            onClick={() => setOpenNewBoardModal(true)}
            className='text-indigo-600 px-8 hover:text-indigo-700 cursor-pointer'
          >
            + Create New Board
          </p>
        </div>
      </aside>
      {openNewBoardModal ? (
        <>
          <Modal
            closeHandler={() => setOpenNewBoardModal(false)}
            submitHandler={addBoardHandler}
            loading={loading}
            title='Create New Board'
            buttonLabel='Create Board'
          >
            <label>Board Name</label>
            <input
              onChange={(e) => setNewBoardName(e.target.value)}
              value={newBoardName}
              type='text'
              className='w-full p-2 border border-gray-500 rounded-md outline-none bg-gray-700'
            />
          </Modal>
        </>
      ) : null}
    </>
  );
}

export default Sidebar;
