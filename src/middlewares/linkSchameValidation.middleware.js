import dayjs from "dayjs";
import { linkSchema } from "../models/linkrs.model.js";

export function linkSchemaValidation(req, res, next) {
  const body = req.body;

  const { error } = linkSchema.validate(body, { abortEarly: false });
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
