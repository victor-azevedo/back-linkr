import joi from "joi";

export const signUpSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(20).required(),
    username: joi.string().min(3).required(),
    pictureUrl: joi.string().required(),
});