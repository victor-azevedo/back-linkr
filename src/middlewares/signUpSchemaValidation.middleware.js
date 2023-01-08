import { signUpSchema } from "../models/signUp.model.js";

export function signUpSchemaValidation(req, res, next){
    const newUser = req.body;

    const {error} = signUpSchema.validate(newUser, {abortEarly: false});
    if(error){
        const message = error.details.map((detail) => detail.message);
        return res.status(422).send({message})
    }

    next();

}   