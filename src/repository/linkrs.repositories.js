import connection, { linkrsTb } from "../database/db.js";

export function insertLinkDB(linkUrl, text, userId) {
    return connection.query(
        `INSERT INTO linkrs ("linkUrl", "text", "userId") VALUES
  ($1, $2, $3) RETURNING id;`,
        [linkUrl, text, userId]
        //INSERT INTO persons (lastname,firstname) VALUES ('Smith', 'John') RETURNING id;
    );
}

export function selectLastLinks() {
    return connection.query(
        `SELECT linkrs.id, "linkUrl", "text", users."username", users."pictureUrl" AS "userPictureUrl"
        FROM linkrs
      JOIN users ON linkrs."userId" = users.id
      ORDER BY linkrs.id DESC LIMIT 20`,
        []
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

export function usersLikedLinks() {
  return connection.query(
    `SELECT likes."linkId", array_agg(u1."username") AS "likers" FROM likes
      LEFT JOIN users u1 ON likes."likerId" = u1.id
      GROUP BY likes."linkId"
      ORDER BY likes."linkId" DESC LIMIT 20`
  );
}
