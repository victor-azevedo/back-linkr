import connection, { followsTb } from "../database/db.js";

export function getUserThatIsFollowing(followerId, followingId) {
    return connection.query(
        `
    SELECT * 
    FROM ${followsTb}
    WHERE "followerId" = $1 AND ($2::integer IS NULL OR "followingId" = $2::integer)
    `,
        [followerId, followingId]
    );
}

export function removeFollow(followerId, followingId) {
    return connection.query(
        `
        DELETE FROM ${followsTb}
        WHERE "followerId" = $1 AND "followingId" = $2
    `,
        [followerId, followingId]
    );
}

export function insertFollow(followerId, followingId) {
    return connection.query(
        `
INSERT INTO ${followsTb} ("followerId", "followingId")
VALUES ($1, $2)
`,
        [followerId, followingId]
    );
}
