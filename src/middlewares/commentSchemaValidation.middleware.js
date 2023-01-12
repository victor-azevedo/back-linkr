import dayjs from "dayjs";
import { commentSchema } from "../models/comment.model.js";

export function commentSchemaValidation(req, res, next) {
  const body = req.body;

  const { error } = commentSchema.validate(body, { abortEarly: false });
  if (error) {
    const message = error.details.map((detail) => detail.message);
    console.log(
      dayjs().format("YYYY-MM-DD HH:mm:ss"),
      "- BAD_REQUEST:",
      message
    );
    res.status(422).send({ message });
    return;
  }

  next();
}
