import connection, { usersTb } from "../database/db.js";

export async function searchUserQuery(req, res) {
    try {
        const { searchText } = res.locals;

        const {rows: users} = await connection.query(` 
            SELECT id, username, "profileUrl"
            FROM ${usersTb}
            WHERE username ILIKE CONCAT($1, '%') 
        `, [searchText]);

        res.status(200).send(users)

    } catch (err) {
        res.send(err);
        console.log(err);
    }
}
