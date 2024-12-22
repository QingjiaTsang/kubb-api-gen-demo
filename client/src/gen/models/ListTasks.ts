export type ListTasksQueryParams = {
  /**
   * @pattern ^\d+$
   * @type string | undefined
   */
  page?: string
  /**
   * @pattern ^\d+$
   * @type string | undefined
   */
  limit?: string
}

/**
 * @description The list of tasks
 */
export type ListTasks200 = {
  /**
   * @type array
   */
  data: {
    /**
     * @minLength 0
     * @type integer
     */
    id: number
    /**
     * @minLength 1
     * @maxLength 500
     * @type string
     */
    name: string
    /**
     * @type boolean
     */
    done: boolean
    /**
     * @type string
     */
    createdAt: string | null
    /**
     * @type string
     */
    updatedAt: string | null
  }[]
  /**
   * @minLength 0
   * @type integer
   */
  total: number
  /**
   * @minLength 0
   * @type integer
   */
  page: number
  /**
   * @minLength 0
   * @type integer
   */
  pageSize: number
  /**
   * @minLength 0
   * @type integer
   */
  totalPages: number
}

export type ListTasksQueryResponse = ListTasks200

export type ListTasksQuery = {
  Response: ListTasks200
  QueryParams: ListTasksQueryParams
  Errors: any
}