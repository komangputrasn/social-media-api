import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, validationResult } from "express-validator";

const register = (request: Request, response: Response) => {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    return response.status(403).json({
      errors: result.array({ onlyFirstError: true }),
    });
  }
  return response.json({
    message: "Register Success!",
    status: "success",
    data: request.body,
  });
};

const root = (request: Request, response: Response) => {
  console.log(request.body);
  response.json({
    message: "Hello, there!",
  });
};

export default {
  register,
  root,
};
