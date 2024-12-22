import type { ListTasksQueryParams, ListTasks200, ListTasksQueryResponse } from '../../models/ListTasks.ts'
import { faker } from '@faker-js/faker'

export function createListTasksQueryParams(data?: Partial<ListTasksQueryParams>) {
  return {
    ...{ page: faker.helpers.fromRegExp(new RegExp('^\\d+$')), limit: faker.helpers.fromRegExp(new RegExp('^\\d+$')) },
    ...(data || {}),
  }
}

/**
 * @description The list of tasks
 */
export function createListTasks200(data?: Partial<ListTasks200>) {
  return {
    ...{
      data: faker.helpers.multiple(() => ({
        id: faker.number.int(),
        name: faker.string.alpha(),
        done: faker.datatype.boolean(),
        createdAt: faker.string.alpha(),
        updatedAt: faker.string.alpha(),
      })) as any,
      total: faker.number.int(),
      page: faker.number.int(),
      pageSize: faker.number.int(),
      totalPages: faker.number.int(),
    },
    ...(data || {}),
  }
}

export function createListTasksQueryResponse(data?: Partial<ListTasksQueryResponse>) {
  return data || faker.helpers.arrayElement<any>([createListTasks200()])
}