import { useRef, useEffect, Fragment } from 'react';

import TaskItem from '@/components/Tasks/TaskItem';
import { useListTasksHook, useListTasksInfiniteHook } from '@/gen/hooks/api/tasks';

export const TaskList = () => {
  const { data: tasks, isLoading, error } = useListTasksHook();

  console.log({ tasks });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-8 h-8 rounded-full border-b-2 border-gray-900 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Loading failed: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Task List</h2>
      <div className="space-y-2">
        {tasks?.data?.map(task => <TaskItem key={task.id} task={task} />)}
      </div>
    </div>
  );
};

export const TaskListInfinite = () => {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useListTasksInfiniteHook(
      { limit: '10' },
      {
        query: {
          getNextPageParam: lastPage => {
            console.log({ lastPage });
            if (lastPage.page >= lastPage.totalPages) {
              return undefined;
            }
            return lastPage.page + 1;
          },
        },
      }
    );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  console.log({
    hasNextPage,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current && hasNextPage) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-8 h-8 rounded-full border-b-2 border-gray-900 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Loading failed: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Task List</h2>
      <div className="space-y-2">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.data.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </Fragment>
        ))}
      </div>

      <div ref={loadMoreRef} className="flex justify-center h-8">
        {isFetchingNextPage ? (
          <div className="w-6 h-6 rounded-full border-b-2 border-gray-900 animate-spin"></div>
        ) : hasNextPage ? (
          <span className="text-gray-500">Scroll down to load more</span>
        ) : (
          <span className="text-gray-500">No more data</span>
        )}
      </div>
    </div>
  );
};
