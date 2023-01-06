import dayjs from "dayjs";
import connection, { linkrsTb } from "../database/db.js";
import { linkrEditSchema, linkrIdSchema, linkSchema } from "../models/linkrs.model.js";
import { checkUserLinkPossession } from "../repository/linkrs.repositories.js";

export function linkSchemaValidation(req, res, next) {
    const body = req.body;

    const { error } = linkSchema.validate(body, { abortEarly: false });
    if (error) {
        const message = error.details.map((detail) => detail.message);
        console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"), "- BAD_REQUEST:", message);
        res.status(422).send({ message });
        return;
    }

    next();
}

export async function linkEditionAndDeletionIdValidation(req, res, next) {
    try {
        const { id: linkrIdToValidate } = req.params;
        const { user } = res.locals;
        const linkrValidatedId = await linkrIdSchema.validateAsync(linkrIdToValidate);

        const { rows } = await checkUserLinkPossession(linkrValidatedId, user.id);
        if (rows.length === 0) throw new Error("Unauthorized deletion");

        res.locals.linkrId = linkrValidatedId;
        next();
    } catch (err) {
        if (err.message === "Unauthorized deletion") res.status(401);
        else res.status(400);
        res.send(err);
        console.log(err);
    }
}

export async function linkEditionValidator(req, res, next) {
    try {
        const { updatedText: textToValidate } = req.body;
        const validatedText = await linkrEditSchema.validateAsync(textToValidate);
        res.locals.textToUpdate = validatedText;
        next();
    } catch (err) {
        res.status(400);
        res.send(err);
        console.log(err);
    }
}
