import type { GetTaskByIdPathParams, GetTaskById200, GetTaskById404, GetTaskById422, GetTaskByIdQueryResponse } from '../../models/GetTaskById.ts'
import { faker } from '@faker-js/faker'

export function createGetTaskByIdPathParams(data?: Partial<GetTaskByIdPathParams>) {
  return {
    ...{ id: faker.number.float() },
    ...(data || {}),
  }
}

/**
 * @description The requested task
 */
export function createGetTaskById200(data?: Partial<GetTaskById200>) {
  return {
    ...{ id: faker.number.int(), name: faker.string.alpha(), done: faker.datatype.boolean(), createdAt: faker.string.alpha(), updatedAt: faker.string.alpha() },
    ...(data || {}),
  }
}

/**
 * @description Task not found
 */
export function createGetTaskById404(data?: Partial<GetTaskById404>) {
  return {
    ...{ message: faker.string.alpha() },
    ...(data || {}),
  }
}

/**
 * @description Invalid id error
 */
export function createGetTaskById422(data?: Partial<GetTaskById422>) {
  return {
    ...{
      success: faker.datatype.boolean(),
      error: {
        issues: faker.helpers.multiple(() => ({
          code: faker.string.alpha(),
          path: faker.helpers.multiple(() => faker.helpers.arrayElement<any>([faker.string.alpha(), faker.number.float()])) as any,
          message: faker.string.alpha(),
        })) as any,
        name: faker.string.alpha(),
      },
    },
    ...(data || {}),
  }
}

export function createGetTaskByIdQueryResponse(data?: Partial<GetTaskByIdQueryResponse>) {
  return data || faker.helpers.arrayElement<any>([createGetTaskById200()])
}