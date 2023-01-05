import { signInSchema } from "../models/signIn.model.js";

export function signInSchemaValidation(req, res, next) {
  const user = req.body;

  const { error } = signInSchema.validate(user, { abortEarly: false });
  if (error) {
    const message = error.details.map((detail) => detail.message);
   
    res.status(422).send({ message });
    return;
  }
  
  next();
}