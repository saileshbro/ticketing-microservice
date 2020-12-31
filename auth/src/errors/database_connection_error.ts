import CustomError from './custom_error'

export default class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database'
  statusCode = 500
  constructor() {
    super('Error connecting to Database')
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
  serializeErrors() {
    return [{ message: this.reason }]
  }
}
