export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export function notFound(what: string): HttpError {
  return new HttpError(404, `${what} not found.`);
}
