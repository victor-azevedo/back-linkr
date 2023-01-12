import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const usersTb = "users";
export const sessionsTb = "sessions";
export const linkrsTb = "linkrs";
export const likesTb = "likes";
export const hashtagsTb = "hashtags";
export const hashLinkrsTb = "hashLinkrs";
export const followsTb = "follows";
export const repostsTb = "reposts";
export const commentsTb = "comments";

export default connection;
