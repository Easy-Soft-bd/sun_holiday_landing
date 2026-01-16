'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/src/lib/redux/hooks';
import { increment, decrement } from '@/src/lib/redux/features/counter/counterSlice';

const Counter = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col items-center gap-4 max-w-xs mx-auto my-8">
      <h2 className="text-xl font-bold">Redux Store Test</h2>
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          -
        </button>
        <span className="text-2xl font-semibold w-12 text-center">{count}</span>
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          +
        </button>
      </div>
      <p className="text-sm text-gray-500">
        If you can change this number, Redux is working correctly!
      </p>
    </div>
  );
};

export default Counter;
