import joi from "joi";


export const userQueryStringSchema = joi.string().min(3).max(20).required();

export const userIdSchema = joi.string().regex(/^[0-9]+$/).required();