import connection from "../database/db.js";

export async function insertHashtag(hashtag, linkId) {
    let hashtagID = 0;
    const hashtagExists = await connection.query(
      `SELECT * FROM hashtags WHERE "hashtag" = $1; `,
      [hashtag]
    );
    if (hashtagExists.rowCount === 0) {
      const hashtagID1 = await connection.query(
        `INSERT INTO hashtags ("hashtag", "counter") VALUES ($1, $2) RETURNING id;`,
        [hashtag, 1]
      );
      hashtagID = hashtagID1.rows[0].id;
    } else {
      const hashtagID2 = await connection.query(
        `UPDATE hashtags SET "counter" = "counter" + 1 WHERE "hashtag" = $1 RETURNING id;`,
        [hashtag]
      );
      hashtagID = hashtagID2.rows[0].id;
    }
    await connection.query(
      `INSERT INTO hashlinkrs ("hashtagId", "linkId") VALUES ($1, $2);`,
      [hashtagID, linkId]
    );
  }

  export function filterHashtags(text) {
    const words = text.split(" ");
    const hashtags = words
      .filter((word) => word.startsWith("#"))
      .map((word) => word.substring(1));
    return hashtags;
  }