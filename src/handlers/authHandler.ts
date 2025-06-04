import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import connection from "@/helpers/db";

interface RegisterBody {
  email: string;
  password: string;
  confirmPassword: string;
}

const register = async (
  request: Request<{}, {}, RegisterBody>,
  response: Response
) => {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    return response.status(403).json({
      errors: result.array(),
    });
  }

  const { email, password } = request.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const insertResult = connection.query(
    "insert into account (email, password) values (?, ?)",
    [email, hashedPassword]
  );

  return response.json({
    message: "Register Success!",
    status: "success",
    result: insertResult,
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
