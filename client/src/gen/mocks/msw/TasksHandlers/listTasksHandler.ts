import type { ListTasksQueryResponse } from '../../../models/ListTasks.ts'
import { createListTasksQueryResponse } from '../../TasksMocks/createListTasks.ts'
import { http } from 'msw'

export function listTasksHandler(data?: ListTasksQueryResponse | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Response)) {
  return http.get('*/tasks', function handler(info) {
    if (typeof data === 'function') return data(info)

    return new Response(JSON.stringify(data || createListTasksQueryResponse(data)), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}