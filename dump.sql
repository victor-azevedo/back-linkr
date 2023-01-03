CREATE TABLE IF NOT EXISTS users (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) UNIQUE NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "pictureUrl" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  "id" SERIAL PRIMARY KEY,
  "userId" BIGINT UNIQUE NOT NULL,
  "token" VARCHAR(255) NOT NULL,
  CONSTRAINT fk_users
    FOREIGN KEY("userId") 
	    REFERENCES users("id")
	    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS linkrs (
  "id" SERIAL PRIMARY KEY,
  "linkUrl" TEXT NOT NULL,
  "text" TEXT,
  "userId" BIGINT NOT NULL,
  CONSTRAINT fk_users
    FOREIGN KEY("userId") 
	    REFERENCES users("id")
	    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
  "id" SERIAL PRIMARY KEY,
  "likerId" BIGINT NOT NULL,
  "linkId" BIGINT NOT NULL,
  CONSTRAINT fk_liker
    FOREIGN KEY("likerId") 
	    REFERENCES users("id")
	    ON DELETE CASCADE,
  CONSTRAINT fk_link
    FOREIGN KEY("linkId") 
	    REFERENCES linkrs("id")
	    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hashtags (
  "id" SERIAL PRIMARY KEY,
  "hashtag" VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS hashLinkrs (
  "id" SERIAL PRIMARY KEY,
  "hashtagId" BIGINT NOT NULL,
  "linkId" BIGINT NOT NULL,
  CONSTRAINT fk_hashtagId
    FOREIGN KEY("hashtagId") 
	    REFERENCES hashtags("id")
	    ON DELETE CASCADE,
  CONSTRAINT fk_link
    FOREIGN KEY("linkId") 
	    REFERENCES linkrs("id")
	    ON DELETE CASCADE
);