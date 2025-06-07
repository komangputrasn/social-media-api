import connection from "@/helpers/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import { FieldPacket, ResultSetHeader } from "mysql2";

const login = async (
  request: Request<{}, {}, LoginBody>,
  response: Response
) => {
  const result = validationResult(request);
  const { email, password } = request.body;

  if (!result.isEmpty()) {
    response.status(400).json({
      errors: result.array(),
    });

    return;
  }

  const [userResult] = await connection
    .query("select * from account where email = ?", [email])
    .then((res) => res as [any[], FieldPacket[]]);

  const isPasswordMatch = await bcrypt.compare(
    password,
    userResult[0].password
  );

  if (!isPasswordMatch) {
    response.status(401).json({
      message: "Incorrect password",
    });
    return;
  }

  const accessToken = jwt.sign(
    {
      email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "10m",
    }
  );

  const refreshToken = jwt.sign(
    {
      email,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  // insert into access token tables
  await connection.query(
    "insert into refresh_token (email, refresh_token) values (?, ?)",
    [email, refreshToken]
  );

  response.json({
    message: "Login success!",
    accessToken,
    refreshToken: refreshToken,
  });
};

const register = async (
  request: Request<{}, {}, RegisterBody>,
  response: Response
) => {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    response.status(400).json({
      errors: result.array(),
    });
    return;
  }

  const { email, password } = request.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const insertResult = connection.query(
    "insert into account (email, password) values (?, ?)",
    [email, hashedPassword]
  );

  response.json({
    message: "Register Success!",
    result: insertResult,
  });
};

const accessToken = async (
  request: Request<{}, {}, AccessTokenBody>,
  response: Response
) => {
  const { refreshToken } = request.body;

  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as JwtPayload;

  const accessToken = jwt.sign(
    {
      email: payload.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string
  );

  response.json({
    accessToken,
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
  login,
  accessToken,
  root,
};
