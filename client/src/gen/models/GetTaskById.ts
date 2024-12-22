export type GetTaskByIdPathParams = {
  /**
   * @type number
   */
  id?: number | null
}

/**
 * @description The requested task
 */
export type GetTaskById200 = {
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
}

/**
 * @description Task not found
 * @example [object Object]
 */
export type GetTaskById404 = {
  /**
   * @type string
   */
  message: string
}

/**
 * @description Invalid id error
 */
export type GetTaskById422 = {
  /**
   * @type boolean
   */
  success: boolean
  /**
   * @type object
   */
  error: {
    /**
     * @type array
     */
    issues: {
      /**
       * @type string
       */
      code: string
      /**
       * @type array
       */
      path: (string | number)[]
      /**
       * @type string | undefined
       */
      message?: string
    }[]
    /**
     * @type string
     */
    name: string
  }
}

export type GetTaskByIdQueryResponse = GetTaskById200

export type GetTaskByIdQuery = {
  Response: GetTaskById200
  PathParams: GetTaskByIdPathParams
  Errors: GetTaskById404 | GetTaskById422
}