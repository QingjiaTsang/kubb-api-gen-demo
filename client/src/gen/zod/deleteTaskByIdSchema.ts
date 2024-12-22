import { z } from 'zod'

export const deleteTaskByIdPathParamsSchema = z
  .object({
    id: z.number().nullable().nullish(),
  })
  .optional()

export type DeleteTaskByIdPathParamsSchema = z.infer<typeof deleteTaskByIdPathParamsSchema>

/**
 * @description Task deleted
 */
export const deleteTaskById204Schema = z.unknown()

export type DeleteTaskById204Schema = z.infer<typeof deleteTaskById204Schema>

/**
 * @description Task not found
 */
export const deleteTaskById404Schema = z.object({
  message: z.string(),
})

export type DeleteTaskById404Schema = z.infer<typeof deleteTaskById404Schema>

/**
 * @description Invalid id error
 */
export const deleteTaskById422Schema = z.object({
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

export type DeleteTaskById422Schema = z.infer<typeof deleteTaskById422Schema>

export const deleteTaskByIdMutationResponseSchema = z.lazy(() => deleteTaskById204Schema)

export type DeleteTaskByIdMutationResponseSchema = z.infer<typeof deleteTaskByIdMutationResponseSchema>