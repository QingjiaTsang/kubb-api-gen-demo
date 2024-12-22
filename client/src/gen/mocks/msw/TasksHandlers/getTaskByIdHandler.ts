import type { GetTaskByIdQueryResponse } from '../../../models/GetTaskById.ts'
import { createGetTaskByIdQueryResponse } from '../../TasksMocks/createGetTaskById.ts'
import { http } from 'msw'

export function getTaskByIdHandler(data?: GetTaskByIdQueryResponse | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Response)) {
  return http.get('*/tasks/:id', function handler(info) {
    if (typeof data === 'function') return data(info)

    return new Response(JSON.stringify(data || createGetTaskByIdQueryResponse(data)), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}