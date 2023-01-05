import connection from "../database/db.js";

async function getPostsByHashtag(hashtag) {
    const hashtagID = await connection.query(`
        SELECT id FROM hashtags WHERE hashtag = $1`
        , [hashtag]);

    const linkrID = await connection.query(`
        SELECT "linkId" FROM hashlinkrs WHERE "hashtagId" = $1`
        , [hashtagID.rows[0].id]);
    const posts = [];    
    for (let i = 0; i < linkrID.rows.length; i++) {
        const post = await connection.query(`
            SELECT * FROM linkrs WHERE id = $1`
            , [linkrID.rows[i].linkId]);
        posts.push(post.rows[0]);
    }
    return posts;
    
}

export { getPostsByHashtag };

