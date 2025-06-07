import connection from "@/helpers/db";
import { body } from "express-validator";
import { FieldPacket } from "mysql2";

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
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password confirmation does not match"),
];

const loginValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email").custom(async (email) => {
    const [result] = await connection
      .query("select email from account where email = ?", [email])
      .then((res) => res as [any[], FieldPacket[]]);
    if (result.length == 0) {
      throw new Error("Email is not registered");
    }
  }),
  body("password").notEmpty().withMessage("Password is required"),
];

const logoutValidator = [
  body("accessToken").notEmpty().withMessage("Access Token is required"),
];

export default {
  registerValidator,
  loginValidator,
  logoutValidator,
};
