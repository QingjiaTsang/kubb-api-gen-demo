import type { ListTasks200 } from '@/gen/models/ListTasks';

import { useState } from 'react';
import {
  listTasksQueryKey,
  useUpdateTaskByIdHook,
  useDeleteTaskByIdHook,
} from '@/gen/hooks/api/tasks';

import { useQueryClient } from '@tanstack/react-query';

interface TaskItemProps {
  task: ListTasks200['data'][number];
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);

  const { mutate: updateTask } = useUpdateTaskByIdHook();
  const { mutate: deleteTask } = useDeleteTaskByIdHook();

  const queryClient = useQueryClient();

  const handleToggleDone = () => {
    updateTask(
      {
        id: task.id,
        data: { done: !task.done },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: listTasksQueryKey() });
        },
      }
    );
  };

  const handleUpdateName = () => {
    if (editedName.trim()) {
      updateTask(
        {
          id: task.id,
          data: { name: editedName },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: listTasksQueryKey() });
          },
        }
      );
      setIsEditing(false);
    }
  };

  const handleDeleteTask = () => {
    deleteTask(
      { id: task.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: listTasksQueryKey() });
        },
      }
    );
  };

  return (
    <div className="flex gap-3 items-center p-3 bg-white rounded-lg shadow">
      <input
        type="checkbox"
        checked={task.done}
        onChange={handleToggleDone}
        className="w-5 h-5 rounded border-gray-300"
      />

      {isEditing ? (
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
            className="flex-1 px-2 py-1 rounded border"
          />
          <button
            onClick={handleUpdateName}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-1 justify-between items-center">
          <span className={`${task.done ? 'line-through text-gray-400' : ''}`}>{task.name}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm text-blue-600 rounded hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteTask}
              className="px-3 py-1 text-sm text-red-600 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
