import type { DeleteTaskByIdMutationResponse } from '../../../models/DeleteTaskById.ts'
import { createDeleteTaskByIdMutationResponse } from '../../TasksMocks/createDeleteTaskById.ts'
import { http } from 'msw'

export function deleteTaskByIdHandler(data?: DeleteTaskByIdMutationResponse | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Response)) {
  return http.delete('*/tasks/:id', function handler(info) {
    if (typeof data === 'function') return data(info)

    return new Response(JSON.stringify(data || createDeleteTaskByIdMutationResponse(data)), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}