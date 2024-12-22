import client from '@/lib/customAxiosClient'
import type { ListTasksQueryResponse, ListTasksQueryParams } from '../../../models/ListTasks.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { listTasksQueryResponseSchema } from '../../../zod/listTasksSchema.ts'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const listTasksQueryKey = (params?: ListTasksQueryParams) => ['v5', { url: '/tasks' }, ...(params ? [params] : [])] as const

export type ListTasksQueryKey = ReturnType<typeof listTasksQueryKey>

/**
 * {@link /tasks}
 */
async function listTasksHook(params?: ListTasksQueryParams, config: Partial<RequestConfig> = {}) {
  const res = await client<ListTasksQueryResponse, Error, unknown>({ method: 'GET', url: `/tasks`, baseURL: '/api', params, ...config })
  return listTasksQueryResponseSchema.parse(res.data)
}

export function listTasksQueryOptionsHook(params?: ListTasksQueryParams, config: Partial<RequestConfig> = {}) {
  const queryKey = listTasksQueryKey(params)
  return queryOptions({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listTasksHook(params, config)
    },
  })
}

/**
 * {@link /tasks}
 */
export function useListTasksHook<TData = ListTasksQueryResponse, TQueryData = ListTasksQueryResponse, TQueryKey extends QueryKey = ListTasksQueryKey>(
  params?: ListTasksQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<ListTasksQueryResponse, Error, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listTasksQueryKey(params)

  const query = useQuery({
    ...(listTasksQueryOptionsHook(params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}