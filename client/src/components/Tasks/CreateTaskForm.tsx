import { useState } from 'react';
import { listTasksInfiniteQueryKey, useCreateTaskHook } from '@/gen/hooks/api/tasks';
import { useQueryClient } from '@tanstack/react-query';
import type { ListTasks200 } from '@/gen/models/ListTasks';
import type { InfiniteData } from '@tanstack/react-query';

// Define the context type
type CreateTaskContext = {
  previousData: InfiniteData<ListTasks200> | undefined;
};

const DEFAULT_QUERY_KEY_PARAMS = {
  limit: '10',
} as const;

type TaskWithOptimistic = ListTasks200['data'][number] & {
  isOptimistic?: boolean;
};

export default function CreateTaskForm() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const { mutate: createTask, isPending: isCreatingTask } = useCreateTaskHook({
    mutation: {
      onMutate: async ({ data }) => {
        const queryKey = listTasksInfiniteQueryKey(DEFAULT_QUERY_KEY_PARAMS);

        await queryClient.cancelQueries({ queryKey });

        const previousData = queryClient.getQueryData<InfiniteData<ListTasks200>>(queryKey);

        // Optimistically update the cache
        queryClient.setQueryData<InfiniteData<ListTasks200>>(queryKey, old => {
          if (!old) {
            return previousData;
          }

          // 添加 isOptimistic 标记
          const newTask: TaskWithOptimistic = {
            id: Date.now(),
            name: data.name,
            done: data.done,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isOptimistic: true,
          };

          // Update the first page data
          const updatedFirstPage = {
            ...old.pages[0],
            data: [newTask, ...old.pages[0].data],
            total: old.pages[0].total + 1,
          };

          return {
            ...old,
            pages: [updatedFirstPage, ...old.pages.slice(1)],
          };
        });

        return { previousData };
      },

      onError: (_err, _variables, context) => {
        // Roll back to the previous state when an error occurs
        if ((context as CreateTaskContext)?.previousData) {
          const queryKey = listTasksInfiniteQueryKey(DEFAULT_QUERY_KEY_PARAMS);
          queryClient.setQueryData(queryKey, (context as CreateTaskContext).previousData);
        }
      },

      onSettled: () => {
        // After completion, re-fetch data to ensure synchronization
        const queryKey = listTasksInfiniteQueryKey(DEFAULT_QUERY_KEY_PARAMS);
        queryClient.invalidateQueries({ queryKey });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createTask({
      data: {
        name: name.trim(),
        done: false,
      },
    });

    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter a new task..."
        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        disabled={isCreatingTask}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isCreatingTask ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
