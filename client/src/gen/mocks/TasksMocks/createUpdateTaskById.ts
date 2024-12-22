import type {
  UpdateTaskByIdPathParams,
  UpdateTaskById200,
  UpdateTaskById404,
  UpdateTaskById422,
  UpdateTaskByIdMutationRequest,
  UpdateTaskByIdMutationResponse,
} from '../../models/UpdateTaskById.ts'
import { faker } from '@faker-js/faker'

export function createUpdateTaskByIdPathParams(data?: Partial<UpdateTaskByIdPathParams>) {
  return {
    ...{ id: faker.number.float() },
    ...(data || {}),
  }
}

/**
 * @description The updated task
 */
export function createUpdateTaskById200(data?: Partial<UpdateTaskById200>) {
  return {
    ...{ id: faker.number.int(), name: faker.string.alpha(), done: faker.datatype.boolean(), createdAt: faker.string.alpha(), updatedAt: faker.string.alpha() },
    ...(data || {}),
  }
}

/**
 * @description Task not found
 */
export function createUpdateTaskById404(data?: Partial<UpdateTaskById404>) {
  return {
    ...{ message: faker.string.alpha() },
    ...(data || {}),
  }
}

/**
 * @description The validation error(s)
 */
export function createUpdateTaskById422(data?: Partial<UpdateTaskById422>) {
  return (
    data ||
    faker.helpers.arrayElement<any>([
      {
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
      {
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
    ])
  )
}

/**
 * @description The task updates
 */
export function createUpdateTaskByIdMutationRequest(data?: Partial<UpdateTaskByIdMutationRequest>) {
  return {
    ...{ name: faker.string.alpha(), done: faker.datatype.boolean() },
    ...(data || {}),
  }
}

export function createUpdateTaskByIdMutationResponse(data?: Partial<UpdateTaskByIdMutationResponse>) {
  return data || faker.helpers.arrayElement<any>([createUpdateTaskById200()])
}