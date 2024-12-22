import { z } from 'zod'

/**
 * @description Tasks API Index
 */
export const lists200Schema = z.object({
  message: z.string(),
})

export type Lists200Schema = z.infer<typeof lists200Schema>

export const listsQueryResponseSchema = z.lazy(() => lists200Schema)

export type ListsQueryResponseSchema = z.infer<typeof listsQueryResponseSchema>