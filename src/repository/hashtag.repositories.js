import connection from "../database/db.js";


async function rankingHashtags() {
    const hashtags = await connection.query(`
        SELECT * FROM hashtags ORDER BY "counter" DESC LIMIT 10`);
    return hashtags.rows;
}



export { rankingHashtags };


// link,
// text,
// linkMetadata,
// linkIsliked,
