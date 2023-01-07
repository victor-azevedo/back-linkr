import joi from "joi";

export const linkSchema = joi.object({
  linkUrl: joi
    .string()
    .min(10)
    .uri({ scheme: [/http/, /https/, /data/] })
    .required(),
  text: joi.string().empty(""),
});


export const linkrIdSchema = joi.string().regex(/^[0-9]+$/).required();

export const linkrEditSchema = joi.string().min(3).max(10000).required();