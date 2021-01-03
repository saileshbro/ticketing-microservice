import CustomError from './custom_error'

export default class BadRequestError extends CustomError {
  statusCode = 400
  constructor(public reason: string) {
    super(reason)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
  serializeErrors() {
    return [{ message: this.reason }]
  }
}
