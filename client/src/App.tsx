import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TaskList, TaskListInfinite } from '@/components/Tasks/TaskList';
import CreateTaskForm from '@/components/Tasks/CreateTaskForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <div className="px-4 py-8 mx-auto max-w-3xl">
          <h1 className="mb-8 text-2xl font-bold text-center">Task Management System</h1>
          <div className="space-y-6">
            <CreateTaskForm />
            {/* <TaskList /> */}
            <TaskListInfinite />
          </div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
