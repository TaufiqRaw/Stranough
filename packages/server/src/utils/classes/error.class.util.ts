import * as Constants from "../../constants";

export class ExpressError extends Error {
  statusCode: number;
  context : {[key : string] : any};
  constructor(message: string, statusCode: number, context : {[key : string] : any} = {}) {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
  }

  get error() {
    return {
      message: this.message,
      context : this.context
    };
  }
}

export class BadRequestError extends ExpressError {
  constructor(messages : string[] | string, context?: {[key : string] : any}) {
    if(typeof messages === 'string')
      messages = [messages];
    super(Constants.errorMessage[400], 400, {messages, ...context});
  }
}

export class UnauthorizedError extends ExpressError {
  constructor(context?: {[key : string] : any}) {
    super(Constants.errorMessage[401], 401, context);
  }
}

export class ForbiddenError extends ExpressError {
  constructor(context?: {[key : string] : any}) {
    super(Constants.errorMessage[403], 403, context);
  }
}

export class NotFoundError extends ExpressError {
  constructor(context?: {[key : string] : any}) {
    super(Constants.errorMessage[404], 404, context);
  }
}