import { useState } from 'react';
import { listTasksQueryKey, useCreateTaskHook } from '@/gen/hooks/api/tasks';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateTaskForm() {
  const [name, setName] = useState('');
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTaskHook();

  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createTask(
      {
        data: {
          name: name.trim(),
          done: false,
        },
      },
      {
        onSuccess: () => {
          setName('');
          queryClient.invalidateQueries({ queryKey: listTasksQueryKey() });
        },
      }
    );
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
