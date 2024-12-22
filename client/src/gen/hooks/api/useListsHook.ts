import client from '@/lib/customAxiosClient'
import type { ListsQueryResponse } from '../../models/Lists.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { listsQueryResponseSchema } from '../../zod/listsSchema.ts'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const listsQueryKey = () => ['v5', { url: '/' }] as const

export type ListsQueryKey = ReturnType<typeof listsQueryKey>

/**
 * {@link /}
 */
async function listsHook(config: Partial<RequestConfig> = {}) {
  const res = await client<ListsQueryResponse, Error, unknown>({ method: 'GET', url: `/`, baseURL: '/api', ...config })
  return listsQueryResponseSchema.parse(res.data)
}

export function listsQueryOptionsHook(config: Partial<RequestConfig> = {}) {
  const queryKey = listsQueryKey()
  return queryOptions({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listsHook(config)
    },
  })
}

/**
 * {@link /}
 */
export function useListsHook<TData = ListsQueryResponse, TQueryData = ListsQueryResponse, TQueryKey extends QueryKey = ListsQueryKey>(
  options: {
    query?: Partial<QueryObserverOptions<ListsQueryResponse, Error, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listsQueryKey()

  const query = useQuery({
    ...(listsQueryOptionsHook(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}