import connection from "@/helpers/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";

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
    .then((res) => res as [RowDataPacket[], FieldPacket[]]);

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
      userId: userResult[0].id,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "10m",
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: userResult[0].id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1h",
    }
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
  const postId = uuidv4();
  const insertResult = connection.query(
    "insert into account (id, email, password) values (?, ?, ?)",
    [postId, email, hashedPassword]
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
  const result = validationResult(request);

  if (!result.isEmpty()) {
    response.status(400).json({
      errors: result.array(),
    });
    return;
  }

  const { refreshToken } = request.body;
  try {
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
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      response.status(401).json({
        message: "Refresh token has expired",
        expiredAt: error.expiredAt,
      });
      return;
    }
    throw error;
  }
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
