import joi from "joi";

export const commentSchema = joi.object({
  commentText: joi.string().min(0).required(),
});
