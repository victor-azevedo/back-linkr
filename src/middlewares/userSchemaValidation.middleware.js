import { userIdSchema, userQueryStringSchema } from "../models/user.model.js";

export async function validateUserQuery (req, res, next) {
    try {
        const {userQuery : userQueryTextToValidate} = req.body;
        const userQueryTextValid = await userQueryStringSchema.validateAsync(userQueryTextToValidate);

        res.locals.searchText = userQueryTextValid;
        next();

    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}

export async function validateIdForUserPage (req, rex, next) {
    try {
        const userIdToValidate = req.params.id;
        const userIdValidated = await userIdSchema.validateAsync(userIdToValidate);
        res.locals.userId = userIdValidated;
        next();
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}