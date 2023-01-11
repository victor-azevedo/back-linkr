import connection from "../database/db.js";

async function createRepost(repost) {
    const { userId, postId } = repost;
    const { rows } = await connection.query(`
        INSERT INTO reposts ("userId", "linkId") VALUES ($1, $2) RETURNING *;
    `, [userId, postId]);
    return rows[0];
}

export { createRepost };