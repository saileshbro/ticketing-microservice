import CustomError from './custom_error'

export default class NotAuthorizedError extends CustomError {
  statusCode = 401

  constructor() {
    super('Not authorized')
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }
  serializeErrors() {
    return [{ message: 'Not authorized' }]
  }
}
