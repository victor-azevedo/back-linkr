import connection, { hashLinkrsTb, hashtagsTb, linkrsTb, usersTb } from "../database/db.js";

export async function searchUserQuery(req, res) {
    try {
        const { searchText } = res.locals;

        const { rows: users } = await connection.query(
            ` 
            SELECT id, username, "profileUrl"
            FROM ${usersTb}
            WHERE username ILIKE CONCAT($1, '%') 
        `,
            [searchText]
        );

        res.status(200).send(users);
    } catch (err) {
        res.send(err);
        console.log(err);
    }
}

export async function getUserInUserPage(req, res) {
    try {
        const { userId } = res.locals;
        const { rows: linkrs } = await connection.query(`
            SELECT 
            FROM ${linkrsTb} l
            LEFT JOIN ${hashLinkrsTb} hl ON l.id = hl."linkrId"
            LEFT JOIN ${hashtagsTb} h ON hl."hashtagId" = h.id
            WHERE l."userId" = $1
        `, [userId]);

        res.status(200).send(linkrs);
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}
