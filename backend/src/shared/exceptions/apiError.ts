class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: any[];
  data: any;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    data: any = null,
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.data = data;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;