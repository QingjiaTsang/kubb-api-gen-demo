import { setupWorker } from 'msw/browser';
import { tasksHandlers } from '@/customMocks/handlers/taskHandlers';

export const worker = setupWorker(...tasksHandlers);
