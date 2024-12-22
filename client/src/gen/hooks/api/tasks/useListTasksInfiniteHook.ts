import client from '@/lib/customAxiosClient'
import type { ListTasksQueryResponse, ListTasksQueryParams } from '../../../models/ListTasks.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { listTasksQueryResponseSchema } from '../../../zod/listTasksSchema.ts'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const listTasksInfiniteQueryKey = (params?: ListTasksQueryParams) => ['v5', { url: '/tasks' }, ...(params ? [params] : [])] as const

export type ListTasksInfiniteQueryKey = ReturnType<typeof listTasksInfiniteQueryKey>

/**
 * {@link /tasks}
 */
async function listTasksHook(params?: ListTasksQueryParams, config: Partial<RequestConfig> = {}) {
  const res = await client<ListTasksQueryResponse, Error, unknown>({ method: 'GET', url: `/tasks`, baseURL: '/api', params, ...config })
  return listTasksQueryResponseSchema.parse(res.data)
}

export function listTasksInfiniteQueryOptionsHook(params?: ListTasksQueryParams, config: Partial<RequestConfig> = {}) {
  const queryKey = listTasksInfiniteQueryKey(params)
  return infiniteQueryOptions({
    queryKey,
    queryFn: async ({ signal, pageParam }) => {
      config.signal = signal

      if (params) {
        params['page'] = pageParam as unknown as ListTasksQueryParams['page']
      }
      return listTasksHook(params, config)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => (Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1),
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => (firstPageParam <= 1 ? undefined : firstPageParam - 1),
  })
}

/**
 * {@link /tasks}
 */
export function useListTasksInfiniteHook<
  TData = InfiniteData<ListTasksQueryResponse>,
  TQueryData = ListTasksQueryResponse,
  TQueryKey extends QueryKey = ListTasksInfiniteQueryKey,
>(
  params?: ListTasksQueryParams,
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ListTasksQueryResponse, Error, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listTasksInfiniteQueryKey(params)

  const query = useInfiniteQuery({
    ...(listTasksInfiniteQueryOptionsHook(params, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}