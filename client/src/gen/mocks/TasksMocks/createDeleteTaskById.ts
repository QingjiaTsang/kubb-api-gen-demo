import type { DeleteTaskByIdPathParams, DeleteTaskById404, DeleteTaskById422, DeleteTaskByIdMutationResponse } from '../../models/DeleteTaskById.ts'
import { faker } from '@faker-js/faker'

export function createDeleteTaskByIdPathParams(data?: Partial<DeleteTaskByIdPathParams>) {
  return {
    ...{ id: faker.number.float() },
    ...(data || {}),
  }
}

/**
 * @description Task deleted
 */
export function createDeleteTaskById204() {
  return undefined
}

/**
 * @description Task not found
 */
export function createDeleteTaskById404(data?: Partial<DeleteTaskById404>) {
  return {
    ...{ message: faker.string.alpha() },
    ...(data || {}),
  }
}

/**
 * @description Invalid id error
 */
export function createDeleteTaskById422(data?: Partial<DeleteTaskById422>) {
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

export function createDeleteTaskByIdMutationResponse(data?: Partial<DeleteTaskByIdMutationResponse>) {
  return data || faker.helpers.arrayElement<any>([createDeleteTaskById204()])
}