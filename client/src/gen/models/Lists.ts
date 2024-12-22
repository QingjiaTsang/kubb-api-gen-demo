/**
 * @description Tasks API Index
 * @example [object Object]
 */
export type Lists200 = {
  /**
   * @type string
   */
  message: string
}

export type ListsQueryResponse = Lists200

export type ListsQuery = {
  Response: Lists200
  Errors: any
}