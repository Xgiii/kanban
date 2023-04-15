'use client';

import { useState } from 'react';

const initialBoards = [
  { id: 1, name: 'Platform Launch' },
  { id: 2, name: 'Marketing Plan' },
  { id: 3, name: 'Roadmap' },
];

function Sidebar() {
  const [boards, setBoards] = useState(initialBoards);
  const [activeBoard, setActiveBoard] = useState(boards[0].id);
  const [openNewBoardModal, setOpenNewBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  function addBoardHandler() {
    if (newBoardName.length === 0) {
      return;
    }
    const newBoard = {
      id: boards.length + 1,
      name: newBoardName,
    };
    setBoards((prevBoards) => [...prevBoards, newBoard]);
    setActiveBoard(newBoard.id);
    setOpenNewBoardModal(false);
    setNewBoardName('');
  }

  return (
    <>
      <aside className='bg-gray-700 w-1/5 h-screen flex flex-col space-y-8'>
        <h1 className='text-white text-2xl font-bold pt-4 px-8'>kanban</h1>
        <p className='uppercase text-xs text-gray-400 tracking-wider px-8'>
          all boards ({boards.length})
        </p>
        <div className='space-y-1 text-gray-300'>
          {boards.map((board) => (
            <p
              key={board.id}
              className={`${
                activeBoard === board.id ? 'bg-indigo-500 ' : 'bg-gray-700'
              } rounded-r-full px-8 mr-4 py-2 cursor-pointer hover:bg-indigo-500 transition-all`}
              onClick={() => setActiveBoard(board.id)}
            >
              {board.name}
            </p>
          ))}
          <p
            onClick={() => setOpenNewBoardModal(true)}
            className='text-indigo-500 px-8 hover:text-indigo-600 cursor-pointer'
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
                    Add Board
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
