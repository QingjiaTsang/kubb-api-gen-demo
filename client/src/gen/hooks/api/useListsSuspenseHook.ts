import client from '@/lib/customAxiosClient'
import type { ListsQueryResponse } from '../../models/Lists.ts'
import type { RequestConfig } from '@/lib/customAxiosClient'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { listsQueryResponseSchema } from '../../zod/listsSchema.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const listsSuspenseQueryKey = () => ['v5', { url: '/' }] as const

export type ListsSuspenseQueryKey = ReturnType<typeof listsSuspenseQueryKey>

/**
 * {@link /}
 */
async function listsHook(config: Partial<RequestConfig> = {}) {
  const res = await client<ListsQueryResponse, Error, unknown>({ method: 'GET', url: `/`, baseURL: '/api', ...config })
  return listsQueryResponseSchema.parse(res.data)
}

export function listsSuspenseQueryOptionsHook(config: Partial<RequestConfig> = {}) {
  const queryKey = listsSuspenseQueryKey()
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
export function useListsSuspenseHook<TData = ListsQueryResponse, TQueryData = ListsQueryResponse, TQueryKey extends QueryKey = ListsSuspenseQueryKey>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<ListsQueryResponse, Error, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listsSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(listsSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}