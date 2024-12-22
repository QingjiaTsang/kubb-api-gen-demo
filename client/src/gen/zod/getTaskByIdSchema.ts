import { z } from 'zod'

export const getTaskByIdPathParamsSchema = z
  .object({
    id: z.number().nullable().nullish(),
  })
  .optional()

export type GetTaskByIdPathParamsSchema = z.infer<typeof getTaskByIdPathParamsSchema>

/**
 * @description The requested task
 */
export const getTaskById200Schema = z.object({
  id: z.number().int().min(0),
  name: z.string().min(1).max(500),
  done: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

export type GetTaskById200Schema = z.infer<typeof getTaskById200Schema>

/**
 * @description Task not found
 */
export const getTaskById404Schema = z.object({
  message: z.string(),
})

export type GetTaskById404Schema = z.infer<typeof getTaskById404Schema>

/**
 * @description Invalid id error
 */
export const getTaskById422Schema = z.object({
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

export type GetTaskById422Schema = z.infer<typeof getTaskById422Schema>

export const getTaskByIdQueryResponseSchema = z.lazy(() => getTaskById200Schema)

export type GetTaskByIdQueryResponseSchema = z.infer<typeof getTaskByIdQueryResponseSchema>