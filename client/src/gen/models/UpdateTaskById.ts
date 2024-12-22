export type UpdateTaskByIdPathParams = {
  /**
   * @type number
   */
  id?: number | null
}

/**
 * @description The updated task
 */
export type UpdateTaskById200 = {
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
export type UpdateTaskById404 = {
  /**
   * @type string
   */
  message: string
}

/**
 * @description The validation error(s)
 */
export type UpdateTaskById422 =
  | {
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
  | {
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
 * @description The task updates
 */
export type UpdateTaskByIdMutationRequest = {
  /**
   * @minLength 1
   * @maxLength 500
   * @type string | undefined
   */
  name?: string
  /**
   * @type boolean | undefined
   */
  done?: boolean
}

export type UpdateTaskByIdMutationResponse = UpdateTaskById200

export type UpdateTaskByIdMutation = {
  Response: UpdateTaskById200
  Request: UpdateTaskByIdMutationRequest
  PathParams: UpdateTaskByIdPathParams
  Errors: UpdateTaskById404 | UpdateTaskById422
}