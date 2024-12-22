import { z } from 'zod'

/**
 * @description The created task
 */
export const createTask200Schema = z.object({
  id: z.number().int().min(0),
  name: z.string().min(1).max(500),
  done: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

export type CreateTask200Schema = z.infer<typeof createTask200Schema>

/**
 * @description The validation error(s)
 */
export const createTask422Schema = z.object({
  success: z.boolean(),
  error: z.object({
    issues: z.array(
      z.object({
        code: z.string(),
        path: z.array(z.union([z.string(), z.number()])),
        message: z.string().optional(),
      }),
    ),
    name: z.string(),
  }),
})

export type CreateTask422Schema = z.infer<typeof createTask422Schema>

/**
 * @description The task to create
 */
export const createTaskMutationRequestSchema = z.object({
  name: z.string().min(1).max(500),
  done: z.boolean(),
})

export type CreateTaskMutationRequestSchema = z.infer<typeof createTaskMutationRequestSchema>

export const createTaskMutationResponseSchema = z.lazy(() => createTask200Schema)

export type CreateTaskMutationResponseSchema = z.infer<typeof createTaskMutationResponseSchema>