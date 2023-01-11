import connection from "../database/db.js";

async function createRepost(repost) {
    const { userId, postId } = repost;
    const { rows } = await connection.query(`
        INSERT INTO reposts ("linkrId", "reposterId") VALUES ($1, $2) RETURNING *;
    `, [postId, userId]);
    return rows[0];
}

export { createRepost };