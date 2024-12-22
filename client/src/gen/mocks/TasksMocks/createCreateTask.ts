import type { CreateTask200, CreateTask422, CreateTaskMutationRequest, CreateTaskMutationResponse } from '../../models/CreateTask.ts'
import { faker } from '@faker-js/faker'

/**
 * @description The created task
 */
export function createCreateTask200(data?: Partial<CreateTask200>) {
  return {
    ...{ id: faker.number.int(), name: faker.string.alpha(), done: faker.datatype.boolean(), createdAt: faker.string.alpha(), updatedAt: faker.string.alpha() },
    ...(data || {}),
  }
}

/**
 * @description The validation error(s)
 */
export function createCreateTask422(data?: Partial<CreateTask422>) {
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

/**
 * @description The task to create
 */
export function createCreateTaskMutationRequest(data?: Partial<CreateTaskMutationRequest>) {
  return {
    ...{ name: faker.string.alpha(), done: faker.datatype.boolean() },
    ...(data || {}),
  }
}

export function createCreateTaskMutationResponse(data?: Partial<CreateTaskMutationResponse>) {
  return data || faker.helpers.arrayElement<any>([createCreateTask200()])
}