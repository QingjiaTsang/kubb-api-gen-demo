export type DeleteTaskByIdPathParams = {
  /**
   * @type number
   */
  id?: number | null
}

/**
 * @description Task deleted
 */
export type DeleteTaskById204 = any

/**
 * @description Task not found
 * @example [object Object]
 */
export type DeleteTaskById404 = {
  /**
   * @type string
   */
  message: string
}

/**
 * @description Invalid id error
 */
export type DeleteTaskById422 = {
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

export type DeleteTaskByIdMutationResponse = DeleteTaskById204

export type DeleteTaskByIdMutation = {
  Response: DeleteTaskById204
  PathParams: DeleteTaskByIdPathParams
  Errors: DeleteTaskById404 | DeleteTaskById422
}