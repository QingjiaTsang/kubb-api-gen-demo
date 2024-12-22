import client from '@/lib/customAxiosClient'
import type { ListTasksQueryResponse, ListTasksQueryParams } from '../../../models/ListTasks.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { listTasksQueryResponseSchema } from '../../../zod/listTasksSchema.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const listTasksSuspenseQueryKey = (params?: ListTasksQueryParams) => ['v5', { url: '/tasks' }, ...(params ? [params] : [])] as const

export type ListTasksSuspenseQueryKey = ReturnType<typeof listTasksSuspenseQueryKey>

/**
 * {@link /tasks}
 */
async function listTasksHook(params?: ListTasksQueryParams, config: Partial<RequestConfig> = {}) {
  const res = await client<ListTasksQueryResponse, Error, unknown>({ method: 'GET', url: `/tasks`, baseURL: '/api', params, ...config })
  return listTasksQueryResponseSchema.parse(res.data)
}

export function listTasksSuspenseQueryOptionsHook(params?: ListTasksQueryParams, config: Partial<RequestConfig> = {}) {
  const queryKey = listTasksSuspenseQueryKey(params)
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
export function useListTasksSuspenseHook<
  TData = ListTasksQueryResponse,
  TQueryData = ListTasksQueryResponse,
  TQueryKey extends QueryKey = ListTasksSuspenseQueryKey,
>(
  params?: ListTasksQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<ListTasksQueryResponse, Error, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listTasksSuspenseQueryKey(params)

  const query = useSuspenseQuery({
    ...(listTasksSuspenseQueryOptionsHook(params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}