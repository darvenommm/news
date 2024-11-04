import { HttpStatus } from 'http-enums';

export type Errors = unknown[];

export class InternalServerError extends Error {
  public readonly status = HttpStatus.INTERNAL_SERVER_ERROR;
}

export class HttpError extends Error {
  public readonly status: number;
  public readonly errors: Errors;

  public constructor(message: string, status: number, errors: Errors) {
    super(message);

    this.status = status;
    this.errors = errors;
  }
}
