import type { CreateTaskMutationResponse } from '../../../models/CreateTask.ts'
import { createCreateTaskMutationResponse } from '../../TasksMocks/createCreateTask.ts'
import { http } from 'msw'

export function createTaskHandler(data?: CreateTaskMutationResponse | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Response)) {
  return http.post('*/tasks', function handler(info) {
    if (typeof data === 'function') return data(info)

    return new Response(JSON.stringify(data || createCreateTaskMutationResponse(data)), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}