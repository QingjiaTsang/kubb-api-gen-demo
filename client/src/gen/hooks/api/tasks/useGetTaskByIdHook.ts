import client from '@/lib/customAxiosClient'
import type { GetTaskByIdQueryResponse, GetTaskByIdPathParams, GetTaskById404, GetTaskById422 } from '../../../models/GetTaskById.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getTaskByIdQueryResponseSchema } from '../../../zod/getTaskByIdSchema.ts'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getTaskByIdQueryKey = ({ id }: { id: GetTaskByIdPathParams['id'] }) => ['v5', { url: '/tasks/:id', params: { id: id } }] as const

export type GetTaskByIdQueryKey = ReturnType<typeof getTaskByIdQueryKey>

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

export function getTaskByIdQueryOptionsHook({ id }: { id: GetTaskByIdPathParams['id'] }, config: Partial<RequestConfig> = {}) {
  const queryKey = getTaskByIdQueryKey({ id })
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
export function useGetTaskByIdHook<TData = GetTaskByIdQueryResponse, TQueryData = GetTaskByIdQueryResponse, TQueryKey extends QueryKey = GetTaskByIdQueryKey>(
  { id }: { id: GetTaskByIdPathParams['id'] },
  options: {
    query?: Partial<QueryObserverOptions<GetTaskByIdQueryResponse, GetTaskById404 | GetTaskById422, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getTaskByIdQueryKey({ id })

  const query = useQuery({
    ...(getTaskByIdQueryOptionsHook({ id }, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, GetTaskById404 | GetTaskById422> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}