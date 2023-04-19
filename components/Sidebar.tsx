'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetcher, slugify } from '@/utils';
import Link from 'next/link';
import { Boards } from '@/models';
import useSwr from 'swr';

function Sidebar() {
  const { data, isLoading } = useSwr('/api/boards', fetcher);

  const pathname = usePathname();
  const router = useRouter();

  const [boards, setBoards] = useState<Boards[]>([]);
  const [activeBoard, setActiveBoard] = useState(pathname);
  const [openNewBoardModal, setOpenNewBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBoards(data);
  }, [data]);

  async function addBoardHandler() {
    setLoading(true);
    if (newBoardName.length === 0) {
      return;
    }
    const newBoard = {
      id: boards.length + 1,
      name: newBoardName,
      href: slugify(newBoardName),
      columns: [],
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
      <aside className='bg-gray-700 min-w-[20vw] h-screen flex flex-col space-y-8 border-r border-r-gray-600'>
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
              key={board.id}
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
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-3xl'>
              {/*content*/}
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none'>
                {/*header*/}
                <div className='flex items-center justify-between p-5 border-b border-solid border-gray-500 rounded-t text-white'>
                  <h3 className='text-2xl font-semibold'>Create New Board</h3>
                </div>
                {/*body*/}
                <div className='relative p-6 flex-auto text-gray-300'>
                  <label>Board Name</label>
                  <input
                    onChange={(e) => setNewBoardName(e.target.value)}
                    value={newBoardName}
                    type='text'
                    className='w-full p-2 border border-gray-500 rounded-md outline-none bg-gray-700'
                  />
                </div>
                {/*footer*/}
                <div className='flex items-center justify-between px-6 py-4 border-t border-solid border-slate-500 rounded-b'>
                  <button
                    className='text-red-500 background-transparent font-bold uppercase text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={() => setOpenNewBoardModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className='bg-indigo-500 text-white font-bold uppercase text-sm px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={addBoardHandler}
                  >
                    {loading ? (
                      <p className='font-bold animate-pulse'>Loading....</p>
                    ) : (
                      'Add Board'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-40 fixed inset-0 z-40 bg-black'></div>
        </>
      ) : null}
    </>
  );
}

export default Sidebar;
