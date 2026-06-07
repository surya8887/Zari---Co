import type { Request, Response, RequestHandler, NextFunction } from "express";

const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;

const tryCatch = async (fn: RequestHandler) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export {tryCatch, asyncHandler}