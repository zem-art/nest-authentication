import { HttpException, HttpStatus } from '@nestjs/common';

export function throwHttpException(
  title: string,
  message: string,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  response?: object
): void {
  throw new HttpException(
    {
      title,
      status,
      message,
      response,
    },
    status,
  );
}
