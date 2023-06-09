'use client';

import AuthCheck from '@/components/AuthCheck';
import BoardHeader from '@/components/BoardHeader';
import Modal from '@/components/Modal';
import TrashIcon from '@/components/TrashIcon';
import { Board, Column, Task } from '@/models';
import { fetcher, unslugify } from '@/utils';
import { useSession } from 'next-auth/react';
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
  const { data: boards } = useSwr(`/api/boards`, fetcher);
  const { data: session } = useSession();

  const [columns, setColumns] = useState<Column[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [columnName, setColumnName] = useState('');
  const [activeColor, setActiveColor] = useState(colors[0].color);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteColumnLoading, setDeleteColumnLoading] = useState<string | null>(null);

  useEffect(() => {
    setColumns(data || []);
    setStatus(data?.[0]?._id?.toString() || '');
  }, [data]);

  async function addColumnHandler() {
    if (columnName.length === 0) {
      setError('Column name cannot be empty');
      return;
    }

    setLoading(true);

    const newColumn = {
      name: columnName,
      color: activeColor,
      tasks: [],
    };

    const res = await fetch(`/api/boards/${params.slug}`, {
      method: 'POST',
      body: JSON.stringify({ column: newColumn, uid: session?.user?._id }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    setColumns((prevCols) => [
      ...prevCols,
      { ...newColumn, _id: data.insertedId },
    ]);
    setColumnName('');
    if (!status) {
      setStatus(data.insertedId);
    }
    setShowModal(false);
    setLoading(false);
  }

  async function addTaskHandler() {
    if (!taskTitle) {
      setError('Task title cannot be empty');
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/boards/${params.slug}/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        title: taskTitle,
        description: taskDescription,
        status: status,
        colId: status,
        uid: session?.user?._id,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const updatedData = await res.json();
    setColumns(updatedData);

    setShowTaskModal(false);
    setTaskTitle('');
    setTaskDescription('');
    setLoading(false);
  }

  async function updateTaskHandler() {
    setLoading(true);

    const res = await fetch(`/api/boards/${params.slug}/tasks`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: taskDetails?.title,
        description: taskDetails?.description,
        oldStatus: taskDetails?.status,
        newStatus: status,
        uid: session?.user?._id,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const updatedData = await res.json();
    setColumns(updatedData);
    setTaskDetails(null);
    setLoading(false);
  }

  async function deleteTaskHandler() {
    setDeleteLoading(true);

    const res = await fetch(`/api/boards/${params.slug}/tasks`, {
      method: 'PUT',
      body: JSON.stringify({
        title: taskDetails?.title,
        status: taskDetails?.status,
        uid: session?.user?._id,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const updatedData = await res.json();
    setColumns(updatedData);
    setTaskDetails(null);
    setDeleteLoading(false);
  }

  async function deleteColumnHandler(id: string) {
    setDeleteColumnLoading(id);

    const res = await fetch(`/api/boards/${params.slug}`, {
      method: 'PUT',
      body: JSON.stringify({ colId: id, uid: session?.user._id }),
      headers: { 'Content-Type': 'application/json' },
    });

    const updatedData = await res.json();
    setColumns(updatedData);
    setDeleteColumnLoading(null);
  }

  if (!boards?.find((board: Board) => board.href === '/' + params.slug)) {
    return (
      <>
        {!loading && !isLoading && (
          <div className='fixed text-center top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2'>
            <h1 className='text-3xl font-bold'>Board Not Found</h1>
            <p className='text-lg'>
              The board you are looking for does not exist.
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <AuthCheck>
      <div className='flex flex-col overflow-scroll'>
        <BoardHeader
          onClick={() => setShowTaskModal(columns.length > 0 ? true : false)}
          boardName={unslugify(params.slug)}
        />
        {!isLoading ? (
          <div className='flex space-x-2 mx-4 mt-20'>
            {columns?.map((column: Column) => (
              <div
                key={column._id?.toString()}
                className='flex flex-col min-w-[20rem]'
              >
                <div className='flex items-center justify-between pr-2'>
                  <div className='flex items-center'>
                    <span
                      className={`${column.color} rounded-full inline-block w-4 h-4 mx-2`}
                    />
                    <h1>{column.name}</h1>
                  </div>
                  {deleteColumnLoading === column._id.toString() ? (
                    <p className='animate-pulse'>...</p>
                  ) : (
                    <TrashIcon
                      onClick={() => deleteColumnHandler(column._id.toString())}
                      className='!w-4 !h-4 cursor-pointer'
                    />
                  )}
                </div>

                {column.tasks?.map((task, i) => (
                  <div
                    key={i}
                    className='flex items-center mx-2 bg-gray-700 p-4 rounded-md my-2 cursor-pointer'
                    onClick={() => setTaskDetails(task)}
                  >
                    {task.title}
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
            onChange={(e) => (setColumnName(e.target.value), setError(''))}
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
          {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
        </Modal>
      )}
      {showTaskModal && (
        <Modal
          closeHandler={() => setShowTaskModal(false)}
          submitHandler={addTaskHandler}
          loading={loading}
          title='Add New Task'
          buttonLabel='Add Task'
        >
          <div className='flex flex-col space-y-4 text-white'>
            <div>
              <label>Title</label>
              <input
                type='text'
                onChange={(e) => (setTaskTitle(e.target.value), setError(''))}
                value={taskTitle}
                placeholder='e.g. Learn React'
                className='w-full p-2 border border-gray-500 text-gray-400 rounded-md outline-none bg-gray-700'
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                rows={4}
                onChange={(e) => setTaskDescription(e.target.value)}
                value={taskDescription}
                placeholder='e.g. Learn React'
                className='w-full p-2 border border-gray-500 text-gray-400 rounded-md outline-none bg-gray-700'
              />
            </div>

            <div>
              <label>Status</label>
              <select
                value={status.toString()}
                onChange={(e) => setStatus(e.target.value)}
                className='w-full p-2 border border-gray-500 text-gray-400 rounded-md outline-none bg-gray-700'
              >
                {columns.map(({ name, _id }) => (
                  <option value={_id.toString()} key={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
          </div>
        </Modal>
      )}
      {taskDetails && (
        <Modal
          closeHandler={() => setTaskDetails(null)}
          submitHandler={updateTaskHandler}
          loading={loading}
          title={taskDetails.title}
          buttonLabel='Update Status'
        >
          <p className='text-gray-300/80 mb-5'>
            Description: {taskDetails.description || 'No description.'}
          </p>
          <div>
            <label>Status</label>
            <select
              defaultValue={taskDetails.status}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className='w-full p-2 border border-gray-500 text-gray-400 rounded-md outline-none bg-gray-700'
            >
              {columns.map(({ name, _id }) => (
                <option value={_id.toString()} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={deleteTaskHandler}
            className='mt-4 bg-red-600 py-1 px-2 rounded-md text-sm text-white font-bold '
          >
            {deleteLoading ? 'loading...' : 'delete task'}
          </button>
        </Modal>
      )}
    </AuthCheck>
  );
}
