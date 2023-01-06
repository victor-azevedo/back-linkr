import connection, { hashLinkrsTb, hashtagsTb, linkrsTb, usersTb } from "../database/db.js";

export async function searchUserQuery(req, res) {
    try {
        const { searchText } = res.locals;

        const { rows: users } = await connection.query(
            ` 
            SELECT id, username, "pictureUrl"
            FROM ${usersTb}
            WHERE username ILIKE CONCAT($1::text, '%') 
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
        SELECT l.id, l."linkUrl", l.text, l."userId", json_agg(h."hashtag") as "hashtags", u.username, u."pictureUrl"
        FROM ${linkrsTb} l
        LEFT JOIN ${hashLinkrsTb} hl ON l.id = hl."linkId"
        LEFT JOIN ${hashtagsTb} h ON hl."hashtagId" = h.id
        LEFT JOIN ${usersTb} u ON u.id = l."userId"
        WHERE l."userId" = $1
        GROUP BY l.id, l."linkUrl", l.text, l."userId", u.id
        
        `, [userId]);

        res.status(200).send(linkrs);
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
}
