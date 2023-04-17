import React from 'react';

function BoardHeader({ boardName }: { boardName: string }) {
  return (
    <header className='bg-gray-700 h-16 fixed w-[80%] py-3 px-8 border-b border-b-gray-600'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='font-bold text-2xl text-white'>{boardName}</h1>
        <button className='bg-indigo-600 text-white px-4 py-2 rounded-full'>
          + Add New Task
        </button>
      </div>
    </header>
  );
}

export default BoardHeader;
