import connection, { linkrsTb } from "../database/db.js";

export function insertLinkDB(linkUrl, text, userId) {
    return connection.query(
        `INSERT INTO linkrs ("linkUrl", "text", "userId") VALUES
  ($1, $2, $3);`,
        [linkUrl, text, userId]
    );
}

export function selectLastLinks(userId) {
    return connection.query(
        `SELECT linkrs.id, "linkUrl", "text", users."username", users."pictureUrl" AS "userPictureUrl", likes."likerId" FROM linkrs
      JOIN users ON linkrs."userId" = users.id
      LEFT JOIN likes ON linkrs.id = likes."linkId" AND likes."likerId" = $1
      ORDER BY linkrs.id DESC LIMIT 20`,
        [userId]
    );
}

export function insertLikeLinkDB(likerId, linkId) {
    return connection.query(`INSERT INTO likes ("likerId", "linkId") VALUES ($1, $2);`, [
        likerId,
        linkId,
    ]);
}

export function removeLikeLinkDB(likerId, linkId) {
    return connection.query(`DELETE FROM likes WHERE "likerId" = $1 AND "linkId" = $2;`, [
        likerId,
        linkId,
    ]);
}

export async function checkUserLinkPossession(linkrId, userId) {
    return await connection.query(
        `
      SELECT id 
      FROM ${linkrsTb}
      WHERE id = $1 AND "userId" = $2
    `,
        [linkrId, userId]
    );
}
