import React from 'react';

function Modal({
  children,
  closeHandler,
  submitHandler,
  loading,
  title,
  buttonLabel,
}: {
  children: React.ReactNode;
  closeHandler: () => void;
  submitHandler: () => void;
  loading: boolean;
  title: string;
  buttonLabel: string;
}) {
  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          {/*content*/}
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none'>
            {/*header*/}
            <div className='flex items-center justify-between p-5 border-b border-solid border-gray-500 rounded-t text-white'>
              <h3 className='text-2xl font-semibold'>{title}</h3>
            </div>
            {/*body*/}
            <div className='relative p-6 flex-auto text-gray-300'>
              {children}
            </div>
            {/*footer*/}
            <div className='flex items-center justify-between px-6 py-4 border-t border-solid border-slate-500 rounded-b'>
              <button
                className='text-red-500 background-transparent font-bold uppercase text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={closeHandler}
              >
                Close
              </button>
              <button
                className='bg-indigo-500 text-white font-bold uppercase text-sm px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={submitHandler}
              >
                {loading ? (
                  <p className='font-bold animate-pulse'>Loading...</p>
                ) : (
                  buttonLabel
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-40 fixed inset-0 z-40 bg-black'></div>
    </>
  );
}

export default Modal;
