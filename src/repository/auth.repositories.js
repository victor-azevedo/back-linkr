import connection from "../database/db.js";

export function insertUser(email, passwordHash, username, pictureUrl){
    return connection.query(
        `INSERT INTO users ("username", "email", "password", "pictureUrl") VALUES ($1, $2, $3, $4)`,
        [username, email, passwordHash, pictureUrl]
    );
};