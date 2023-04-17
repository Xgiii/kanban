import BoardHeader from '@/components/BoardHeader';
import { unslugify } from '@/utils';

export default function Board({ params }: { params: { slug: string } }) {
  const columns = [
    {
      id: 1,
      name: 'To Do',
      color: 'bg-blue-400',
      tasks: [
        { id: 1, name: 'Task 1' },
        { id: 2, name: 'Task 2' },
        { id: 3, name: 'Task 3' },
      ],
    },
    { id: 2, name: 'In Progress', color: 'bg-purple-400' },
    { id: 3, name: 'Done', color: 'bg-teal-400' },
  ];

  return (
    <div className='flex flex-col overflow-scroll'>
      <BoardHeader boardName={unslugify(params.slug)} />
      <div className='flex space-x-2 mx-6 mt-20'>
        {columns.map((column) => (
          <div
            key={column.id}
            className='flex flex-col min-w-[20rem]'
          >
            <div className='flex items-center'>
              <span
                className={`${column.color} rounded-full inline-block w-4 h-4 mx-2`}
              />
              <h1>{column.name}</h1>
            </div>

            {column.tasks?.map((task) => (
              <div key={task.id} className='flex items-center mx-2 bg-gray-700 p-4 rounded-md my-2'>
                {task.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
