import client from '@/lib/customAxiosClient'
import type {
  UpdateTaskByIdMutationRequest,
  UpdateTaskByIdMutationResponse,
  UpdateTaskByIdPathParams,
  UpdateTaskById404,
  UpdateTaskById422,
} from '../../../models/UpdateTaskById.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { UseMutationOptions } from '@tanstack/react-query'
import { updateTaskByIdMutationResponseSchema } from '../../../zod/updateTaskByIdSchema.ts'
import { useMutation } from '@tanstack/react-query'

export const updateTaskByIdMutationKey = () => [{ url: '/tasks/{id}' }] as const

export type UpdateTaskByIdMutationKey = ReturnType<typeof updateTaskByIdMutationKey>

/**
 * {@link /tasks/:id}
 */
async function updateTaskByIdHook(
  { id }: { id: UpdateTaskByIdPathParams['id'] },
  data?: UpdateTaskByIdMutationRequest,
  config: Partial<RequestConfig<UpdateTaskByIdMutationRequest>> = {},
) {
  const res = await client<UpdateTaskByIdMutationResponse, UpdateTaskById404 | UpdateTaskById422, UpdateTaskByIdMutationRequest>({
    method: 'PATCH',
    url: `/tasks/${id}`,
    baseURL: '/api',
    data,
    ...config,
  })
  return updateTaskByIdMutationResponseSchema.parse(res.data)
}

/**
 * {@link /tasks/:id}
 */
export function useUpdateTaskByIdHook(
  options: {
    mutation?: UseMutationOptions<
      UpdateTaskByIdMutationResponse,
      UpdateTaskById404 | UpdateTaskById422,
      { id: UpdateTaskByIdPathParams['id']; data?: UpdateTaskByIdMutationRequest }
    >
    client?: Partial<RequestConfig<UpdateTaskByIdMutationRequest>>
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? updateTaskByIdMutationKey()

  return useMutation<
    UpdateTaskByIdMutationResponse,
    UpdateTaskById404 | UpdateTaskById422,
    { id: UpdateTaskByIdPathParams['id']; data?: UpdateTaskByIdMutationRequest }
  >({
    mutationFn: async ({ id, data }) => {
      return updateTaskByIdHook({ id }, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}