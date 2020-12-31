import CustomError from './custom_error'

export default class NotFoundError extends CustomError {
  statusCode = 404
  constructor() {
    super('Route not found')
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: 'Not found' }]
  }
}
