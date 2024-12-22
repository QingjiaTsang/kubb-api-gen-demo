import type { UpdateTaskByIdMutationResponse } from '../../../models/UpdateTaskById.ts'
import { createUpdateTaskByIdMutationResponse } from '../../TasksMocks/createUpdateTaskById.ts'
import { http } from 'msw'

export function updateTaskByIdHandler(data?: UpdateTaskByIdMutationResponse | ((info: Parameters<Parameters<typeof http.patch>[1]>[0]) => Response)) {
  return http.patch('*/tasks/:id', function handler(info) {
    if (typeof data === 'function') return data(info)

    return new Response(JSON.stringify(data || createUpdateTaskByIdMutationResponse(data)), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}