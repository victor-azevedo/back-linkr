import joi from "joi";

export const linkSchema = joi.object({
  linkUrl: joi
    .string()
    .min(10)
    .uri({ scheme: [/http/, /https/, /data/] })
    .required(),
  text: joi.string().empty(""),
});
