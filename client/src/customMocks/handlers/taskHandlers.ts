import {
  listTasksHandler,
  createTaskHandler,
  updateTaskByIdHandler,
  deleteTaskByIdHandler,
  getTaskByIdHandler,
} from '@/gen/mocks/msw';
import { mockTasks, PAGE_SIZE, createMockTask } from '@/customMocks/data/tasks';

export const tasksHandlers = [
  listTasksHandler(() => {
    const paginatedData = mockTasks.slice(0, PAGE_SIZE);

    return new Response(
      JSON.stringify({
        data: paginatedData,
        total: mockTasks.length,
        page: 1,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(mockTasks.length / PAGE_SIZE),
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),

  createTaskHandler(info => {
    return (async () => {
      const taskData = (await info.request.json()) as Partial<(typeof mockTasks)[number]>;

      const newTask = createMockTask(taskData);

      mockTasks.unshift(newTask);

      return new Response(JSON.stringify(newTask), {
        headers: { 'Content-Type': 'application/json' },
      });
    })() as unknown as Response;
  }),

  updateTaskByIdHandler(info => {
    const promise = (async () => {
      const id = Number(info.params.id);
      const taskIndex = mockTasks.findIndex(t => t.id === id);

      if (taskIndex === -1) {
        return new Response(JSON.stringify({ message: 'Task not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const updates = (await info.request.json()) as Partial<(typeof mockTasks)[number]>;

      mockTasks[taskIndex] = {
        ...mockTasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return new Response(JSON.stringify(mockTasks[taskIndex]), {
        headers: { 'Content-Type': 'application/json' },
      });
    })();

    return promise as unknown as Response;
  }),

  deleteTaskByIdHandler((info: any) => {
    const id = Number(info.params.id);
    const index = mockTasks.findIndex(t => t.id === id);
    if (index > -1) {
      mockTasks.splice(index, 1);
    }

    return new Response(null, { status: 204 });
  }),

  getTaskByIdHandler(info => {
    const id = Number(info.params.id);
    const task = mockTasks.find(t => t.id === id);

    if (!task) {
      return new Response(JSON.stringify({ message: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(task), { headers: { 'Content-Type': 'application/json' } });
  }),
];
