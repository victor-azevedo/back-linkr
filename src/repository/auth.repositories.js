import connection from "../database/db.js";

export function insertUser(email, passwordHash, username, pictureUrl){
    return connection.query(
        `INSERT INTO users ("username", "email", "password", "pictureUrl") VALUES ($1, $2, $3, $4)`,
        [username, email, passwordHash, pictureUrl]
    );
};

export function selectUser(email){
    return connection.query(
        `SELECT id, email, password, "pictureUrl" FROM users WHERE email=$1`, 
        [email] 
    );
};