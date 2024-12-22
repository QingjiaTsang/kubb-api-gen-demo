import client from '@/lib/customAxiosClient'
import type { GetTaskByIdQueryResponse, GetTaskByIdPathParams, GetTaskById404, GetTaskById422 } from '../../../models/GetTaskById.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getTaskByIdQueryResponseSchema } from '../../../zod/getTaskByIdSchema.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getTaskByIdSuspenseQueryKey = ({ id }: { id: GetTaskByIdPathParams['id'] }) => ['v5', { url: '/tasks/:id', params: { id: id } }] as const

export type GetTaskByIdSuspenseQueryKey = ReturnType<typeof getTaskByIdSuspenseQueryKey>

/**
 * {@link /tasks/:id}
 */
async function getTaskByIdHook({ id }: { id: GetTaskByIdPathParams['id'] }, config: Partial<RequestConfig> = {}) {
  const res = await client<GetTaskByIdQueryResponse, GetTaskById404 | GetTaskById422, unknown>({
    method: 'GET',
    url: `/tasks/${id}`,
    baseURL: '/api',
    ...config,
  })
  return getTaskByIdQueryResponseSchema.parse(res.data)
}

export function getTaskByIdSuspenseQueryOptionsHook({ id }: { id: GetTaskByIdPathParams['id'] }, config: Partial<RequestConfig> = {}) {
  const queryKey = getTaskByIdSuspenseQueryKey({ id })
  return queryOptions({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getTaskByIdHook({ id }, config)
    },
  })
}

/**
 * {@link /tasks/:id}
 */
export function useGetTaskByIdSuspenseHook<
  TData = GetTaskByIdQueryResponse,
  TQueryData = GetTaskByIdQueryResponse,
  TQueryKey extends QueryKey = GetTaskByIdSuspenseQueryKey,
>(
  { id }: { id: GetTaskByIdPathParams['id'] },
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetTaskByIdQueryResponse, GetTaskById404 | GetTaskById422, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getTaskByIdSuspenseQueryKey({ id })

  const query = useSuspenseQuery({
    ...(getTaskByIdSuspenseQueryOptionsHook({ id }, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, GetTaskById404 | GetTaskById422> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}