import client from '@/lib/customAxiosClient'
import type { CreateTaskMutationRequest, CreateTaskMutationResponse, CreateTask422 } from '../../../models/CreateTask.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { UseMutationOptions } from '@tanstack/react-query'
import { createTaskMutationResponseSchema } from '../../../zod/createTaskSchema.ts'
import { useMutation } from '@tanstack/react-query'

export const createTaskMutationKey = () => [{ url: '/tasks' }] as const

export type CreateTaskMutationKey = ReturnType<typeof createTaskMutationKey>

/**
 * {@link /tasks}
 */
async function createTaskHook(data: CreateTaskMutationRequest, config: Partial<RequestConfig<CreateTaskMutationRequest>> = {}) {
  const res = await client<CreateTaskMutationResponse, CreateTask422, CreateTaskMutationRequest>({
    method: 'POST',
    url: `/tasks`,
    baseURL: '/api',
    data,
    ...config,
  })
  return createTaskMutationResponseSchema.parse(res.data)
}

/**
 * {@link /tasks}
 */
export function useCreateTaskHook(
  options: {
    mutation?: UseMutationOptions<CreateTaskMutationResponse, CreateTask422, { data: CreateTaskMutationRequest }>
    client?: Partial<RequestConfig<CreateTaskMutationRequest>>
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createTaskMutationKey()

  return useMutation<CreateTaskMutationResponse, CreateTask422, { data: CreateTaskMutationRequest }>({
    mutationFn: async ({ data }) => {
      return createTaskHook(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}