import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
  const bearerToken = request.header("Authorization")?.split(" ")[1];

  if (!bearerToken) {
    response
      .status(401)
      .json({ error: "Access denied, bearer token is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(
      bearerToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    response.locals.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      response.status(401).json({ message: error.message });
    } else {
      throw error;
    }
  }
};
