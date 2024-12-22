import client from '@/lib/customAxiosClient'
import type { DeleteTaskByIdMutationResponse, DeleteTaskByIdPathParams, DeleteTaskById404, DeleteTaskById422 } from '../../../models/DeleteTaskById.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { UseMutationOptions } from '@tanstack/react-query'
import { deleteTaskByIdMutationResponseSchema } from '../../../zod/deleteTaskByIdSchema.ts'
import { useMutation } from '@tanstack/react-query'

export const deleteTaskByIdMutationKey = () => [{ url: '/tasks/{id}' }] as const

export type DeleteTaskByIdMutationKey = ReturnType<typeof deleteTaskByIdMutationKey>

/**
 * {@link /tasks/:id}
 */
async function deleteTaskByIdHook({ id }: { id: DeleteTaskByIdPathParams['id'] }, config: Partial<RequestConfig> = {}) {
  const res = await client<DeleteTaskByIdMutationResponse, DeleteTaskById404 | DeleteTaskById422, unknown>({
    method: 'DELETE',
    url: `/tasks/${id}`,
    baseURL: '/api',
    ...config,
  })
  return deleteTaskByIdMutationResponseSchema.parse(res.data)
}

/**
 * {@link /tasks/:id}
 */
export function useDeleteTaskByIdHook(
  options: {
    mutation?: UseMutationOptions<DeleteTaskByIdMutationResponse, DeleteTaskById404 | DeleteTaskById422, { id: DeleteTaskByIdPathParams['id'] }>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteTaskByIdMutationKey()

  return useMutation<DeleteTaskByIdMutationResponse, DeleteTaskById404 | DeleteTaskById422, { id: DeleteTaskByIdPathParams['id'] }>({
    mutationFn: async ({ id }) => {
      return deleteTaskByIdHook({ id }, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}