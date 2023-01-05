import { userQueryStringSchema } from "../models/user.model.js";

export async function validateUserQuery (req, res, next) {
    try {
        const userQueryTextToValidate = req.body;
        const userQueryTextValid = await userQueryStringSchema.validateAsync(userQueryTextToValidate);

        res.locals.searchText = userQueryTextValid;
        next();

    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}