'use client';

import BoardHeader from '@/components/BoardHeader';
import Modal from '@/components/Modal';
import { Column } from '@/models';
import { fetcher, unslugify } from '@/utils';
import { useEffect, useState } from 'react';
import useSwr from 'swr';

const colors = [
  { color: 'bg-red-400' },
  { color: 'bg-blue-400' },
  { color: 'bg-purple-400' },
  { color: 'bg-teal-400' },
  { color: 'bg-yellow-400' },
  { color: 'bg-pink-400' },
];

export default function Board({ params }: { params: { slug: string } }) {
  const { data, isLoading } = useSwr(`/api/boards/${params.slug}`, fetcher);

  const [columns, setColumns] = useState<Column[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [columnName, setColumnName] = useState('');
  const [activeColor, setActiveColor] = useState(colors[0].color);

  useEffect(() => {
    setColumns(data || []);
  }, [data]);

  async function addColumnHandler() {
    setLoading(true);

    const newColumn = {
      name: columnName,
      color: activeColor,
      tasks: [],
    };

    const res = await fetch(`/api/boards/${params.slug}`, {
      method: 'POST',
      body: JSON.stringify({ column: newColumn }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    setColumns((prevCols) => [
      ...prevCols,
      { ...newColumn, _id: data.insertedId },
    ]);
    setShowModal(false);
    setLoading(false);
  }

  return (
    <>
      <div className='flex flex-col overflow-scroll'>
        <BoardHeader boardName={unslugify(params.slug)} />
        {!isLoading ? (
          <div className='flex space-x-2 mx-4 mt-20'>
            {columns?.map((column: Column) => (
              <div
                key={column._id?.toString()}
                className='flex flex-col min-w-[20rem]'
              >
                <div className='flex items-center'>
                  <span
                    className={`${column.color} rounded-full inline-block w-4 h-4 mx-2`}
                  />
                  <h1>{column.name}</h1>
                </div>

                {column.tasks?.map((task) => (
                  <div
                    key={task.id}
                    className='flex items-center mx-2 bg-gray-700 p-4 rounded-md my-2'
                  >
                    {task.name}
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={() => setShowModal(true)}
              className='bg-gray-700 hover:bg-gray-600 flex min-w-[14rem] min-h-[60vh] p-6 items-center justify-center rounded-md'
            >
              + Add Column
            </button>
          </div>
        ) : (
          <p className='fixed top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 animate-pulse'>
            Loading...
          </p>
        )}
      </div>
      {showModal && (
        <Modal
          closeHandler={() => setShowModal(false)}
          submitHandler={addColumnHandler}
          loading={loading}
          title='Add New Column'
          buttonLabel='Add Column'
        >
          <label className='mb-2'>Column Name</label>
          <input
            onChange={(e) => setColumnName(e.target.value)}
            value={columnName}
            type='text'
            placeholder='e.g. To Do'
            className='w-full mb-4 p-2 border border-gray-500 rounded-md outline-none bg-gray-700'
          />
          <label className='mb-12'>Color</label>
          <div className='flex items-center justify-center space-x-6 flex-wrap'>
            {colors.map(({ color }) => (
              <div
                key={color}
                onClick={() => setActiveColor(color)}
                className={`${color} w-6 h-6 rounded-full cursor-pointer ${
                  activeColor === color ? 'ring-2 ring-blue-500' : ''
                }`}
              />
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
