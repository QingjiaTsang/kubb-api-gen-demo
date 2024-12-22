import { z } from 'zod'

export const updateTaskByIdPathParamsSchema = z
  .object({
    id: z.number().nullable().nullish(),
  })
  .optional()

export type UpdateTaskByIdPathParamsSchema = z.infer<typeof updateTaskByIdPathParamsSchema>

/**
 * @description The updated task
 */
export const updateTaskById200Schema = z.object({
  id: z.number().int().min(0),
  name: z.string().min(1).max(500),
  done: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

export type UpdateTaskById200Schema = z.infer<typeof updateTaskById200Schema>

/**
 * @description Task not found
 */
export const updateTaskById404Schema = z.object({
  message: z.string(),
})

export type UpdateTaskById404Schema = z.infer<typeof updateTaskById404Schema>

/**
 * @description The validation error(s)
 */
export const updateTaskById422Schema = z.union([
  z
    .object({
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
    .strict(),
  z
    .object({
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
    .strict(),
])

export type UpdateTaskById422Schema = z.infer<typeof updateTaskById422Schema>

/**
 * @description The task updates
 */
export const updateTaskByIdMutationRequestSchema = z.object({
  name: z.string().min(1).max(500).optional(),
  done: z.boolean().optional(),
})

export type UpdateTaskByIdMutationRequestSchema = z.infer<typeof updateTaskByIdMutationRequestSchema>

export const updateTaskByIdMutationResponseSchema = z.lazy(() => updateTaskById200Schema)

export type UpdateTaskByIdMutationResponseSchema = z.infer<typeof updateTaskByIdMutationResponseSchema>