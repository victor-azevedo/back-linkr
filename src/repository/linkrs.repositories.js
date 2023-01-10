import connection, { hashLinkrsTb, hashtagsTb, linkrsTb, usersTb } from "../database/db.js";

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
        `SELECT l.*, users."username", users."pictureUrl" AS "userPictureUrl"
        FROM linkrs l
        JOIN users ON l."userId" = users.id
        ORDER BY l.id DESC LIMIT 20`,
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
    `SELECT likes."linkId", array_agg(u1."username") AS "likers" 
    FROM likes
      LEFT JOIN users u1 ON likes."likerId" = u1.id
      GROUP BY likes."linkId"
      ORDER BY likes."linkId" DESC LIMIT 20`
  );
}

export function linkrsFilteredByUserId (userPageId){
    return connection.query(
        `
        SELECT l.*, json_agg(h."hashtag") as "hashtags", u.username, u."pictureUrl"
        FROM ${linkrsTb} l
        LEFT JOIN ${hashLinkrsTb} hl ON l.id = hl."linkId"
        LEFT JOIN ${hashtagsTb} h ON hl."hashtagId" = h.id
        LEFT JOIN ${usersTb} u ON u.id = l."userId"
        WHERE l."userId" = $1
        GROUP BY l.id, u.username, u."pictureUrl"
        
        `,
      [userPageId]
      )
}

export function linkrsFilteredByHashtagName (hashtagName) {
    return connection.query(
        `
    SELECT l.*, array_agg(h.hashtag) AS hashtags, u.username, u."pictureUrl", u.id as "userId"
    FROM ${linkrsTb} l
    LEFT JOIN ${hashLinkrsTb} hl ON l.id = hl."linkId"
    LEFT JOIN ${hashtagsTb} h ON hl."hashtagId" = h.id
    LEFT JOIN ${usersTb} u ON l."userId" = u.id
    GROUP BY l.id, u.username, u."pictureUrl", u.id
    HAVING $1 = ANY(array_agg(h.hashtag))
    `,
        [hashtagName]
    );
}