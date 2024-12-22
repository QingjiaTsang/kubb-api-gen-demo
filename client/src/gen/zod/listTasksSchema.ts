import { z } from 'zod'

export const listTasksQueryParamsSchema = z
  .object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  })
  .optional()

export type ListTasksQueryParamsSchema = z.infer<typeof listTasksQueryParamsSchema>

/**
 * @description The list of tasks
 */
export const listTasks200Schema = z.object({
  data: z.array(
    z.object({
      id: z.number().int().min(0),
      name: z.string().min(1).max(500),
      done: z.boolean(),
      createdAt: z.string().nullable(),
      updatedAt: z.string().nullable(),
    }),
  ),
  total: z.number().int().min(0),
  page: z.number().int().min(0),
  pageSize: z.number().int().min(0),
  totalPages: z.number().int().min(0),
})

export type ListTasks200Schema = z.infer<typeof listTasks200Schema>

export const listTasksQueryResponseSchema = z.lazy(() => listTasks200Schema)

export type ListTasksQueryResponseSchema = z.infer<typeof listTasksQueryResponseSchema>