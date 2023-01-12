import connection from "../database/db.js";

async function createRepost(repost) {
    const { userId, postId } = repost;
    const { rows } = await connection.query(`
        INSERT INTO reposts ("linkrId", "reposterId") VALUES ($1, $2) RETURNING "linkrId";
    `, [postId, userId]);
    return rows[0];
}

async function getRepostsByLinkrId() {
    const reposts = await connection.query(`
        SELECT "linkrId", COUNT(*) FROM reposts GROUP BY "linkrId";
    `);
    return reposts.rows;
}

export { createRepost, getRepostsByLinkrId };
