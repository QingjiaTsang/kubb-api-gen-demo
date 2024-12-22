import type { ListsQueryResponse } from '../../../models/Lists.ts'
import { createListsQueryResponse } from '../../IndexMocks/createLists.ts'
import { http } from 'msw'

export function listsHandler(data?: ListsQueryResponse | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Response)) {
  return http.get('*/', function handler(info) {
    if (typeof data === 'function') return data(info)

    return new Response(JSON.stringify(data || createListsQueryResponse(data)), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}