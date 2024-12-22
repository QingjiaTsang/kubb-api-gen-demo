/**
 * @description The created task
 */
export type CreateTask200 = {
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
 * @description The validation error(s)
 */
export type CreateTask422 = {
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

/**
 * @description The task to create
 */
export type CreateTaskMutationRequest = {
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
}

export type CreateTaskMutationResponse = CreateTask200

export type CreateTaskMutation = {
  Response: CreateTask200
  Request: CreateTaskMutationRequest
  Errors: CreateTask422
}