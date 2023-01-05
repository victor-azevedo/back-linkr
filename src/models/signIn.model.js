import joi from "joi";

export const signInSchema = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().min(6).max(16).trim().required(),
});