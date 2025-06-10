import connection from "@/helpers/db";
import { Request, Response } from "express";

const follow = async (
  request: Request<{ user_id: string }, {}, {}>,
  response: Response
) => {
  const currentUserId = response.locals.userId;
  if (request.params.user_id === currentUserId) {
    response.status(400).json({
      message: "Cannot self follow",
    });
    return;
  }
  await connection.query(
    "insert into follow(account_id, followed_by) values (?, ?)",
    [request.params.user_id, currentUserId]
  );
  response.json({ message: "Successfully followed another user!" });
};

export default { follow };
