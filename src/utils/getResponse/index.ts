import { Response } from 'express';

const getResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any,
  total?: any
): Response => res
  .status(statusCode)
  .json({
    code: statusCode,
    status: statusCode < 400 ? 'success' : 'failed',
    message,
    data,
    total : total ? total : null
  })

  .end();

export default getResponse;
