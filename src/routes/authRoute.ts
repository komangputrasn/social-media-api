import authHandler from "@/handlers/authHandler";
import connection from "@/helpers/db";
import { RequestHandler, Router } from "express";
import { body } from "express-validator";
import { FieldPacket } from "mysql2";

const authRoute = Router();

const registerValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Email format is incorrect"),
  body("email").custom(async (email) => {
    const [result] = await connection
      .query("select email from account where email = ?", [email])
      .then((res) => res as [any[], FieldPacket[]]);
    if (result.length != 0) {
      throw new Error("Email is already in use");
    }
  }),
  body("password").notEmpty().withMessage("Password is required"),
  body("password")
    .isLength({ min: 10 })
    .withMessage("Password must have at least 10 characters"),
  body("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required"),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password confirmation does not match"),
];

authRoute.post("/register", registerValidator, authHandler.register);

export default authRoute;
