import joi from "joi";


export const userQueryStringSchema = joi.string().min(3).max(20);