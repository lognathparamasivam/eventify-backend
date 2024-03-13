export class ErrorResponse extends Error {
    message: string;
    status: number;
    constructor(
      status: number,
      message: string,
    ) {
      super(message);
      this.status = status;
      this.message = message;
    }
  }
export const throwError = (errors: {
    errorCategory: string;
    message: string;
  }) => {
    switch (errors.errorCategory) {
        case 'RESOURCE_NOT_FOUND': {
          throw new ErrorResponse(404,errors.message)
        }
        case 'UNAUTHORIZED': {
          throw new ErrorResponse(401,errors.message)
        }
        case 'INTERNAL_SERVER_ERROR': {
          throw new ErrorResponse(500,errors.message)
        }
        case 'BAD_REQUEST': {
          throw new ErrorResponse(402,errors.message)
        }
        case 'FORBIDDEN': {
          throw new ErrorResponse(403,errors.message)
        }
  }
}