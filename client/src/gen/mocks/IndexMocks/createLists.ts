import type { Lists200, ListsQueryResponse } from '../../models/Lists.ts'
import { faker } from '@faker-js/faker'

/**
 * @description Tasks API Index
 */
export function createLists200(data?: Partial<Lists200>) {
  return {
    ...{ message: faker.string.alpha() },
    ...(data || {}),
  }
}

export function createListsQueryResponse(data?: Partial<ListsQueryResponse>) {
  return data || faker.helpers.arrayElement<any>([createLists200()])
}