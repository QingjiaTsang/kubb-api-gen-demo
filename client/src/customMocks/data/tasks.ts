type Task = {
  id: number;
  name: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export const createMockTask = (data?: Partial<Task>) => ({
  id: data?.id ?? Math.floor(Math.random() * 1000000),
  name: data?.name ?? `Task ${data?.id ?? Math.floor(Math.random() * 1000000)}`,
  done: data?.done ?? false,
  createdAt: data?.createdAt ?? new Date(Date.now() - Math.random() * 10000000).toISOString(),
  updatedAt: data?.updatedAt ?? new Date().toISOString(),
  ...data,
});

export let mockTasks = Array.from({ length: 10 }, (_, i) => createMockTask({ id: i + 1 }));
export const PAGE_SIZE = 5;
