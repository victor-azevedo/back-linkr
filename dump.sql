CREATE TABLE IF NOT EXISTS users (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) UNIQUE NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "pictureUrl" TEXT NOT NULL
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
  UNIQUE ("likerId","linkId"),
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
    "hashtag" VARCHAR(255) UNIQUE NOT NULL,
    "counter" BIGINT NOT NULL
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

CREATE TABLE IF NOT EXISTS follows (
  "id" SERIAL PRIMARY KEY,
  "followerId" BIGINT NOT NULL,
  "followingId" BIGINT NOT NULL,
  CONSTRAINT fk_followerId
    FOREIGN KEY("followerId") 
	    REFERENCES users("id")
	    ON DELETE CASCADE,
  CONSTRAINT fk_followingId
    FOREIGN KEY("followingId") 
	    REFERENCES users("id")
	    ON DELETE CASCADE
);

INSERT INTO users ("username", "email", "password", "pictureUrl") VALUES
('pele', 'pele@uol.com', '123456', 'https://m.media-amazon.com/images/M/MV5BNGE0MjRkMWYtZGJlMi00YmZiLWJiY2QtMGRlMjRlNDU4MjFjXkEyXkFqcGdeQXVyNjc5NjEzNA@@._V1_.jpg');

INSERT INTO users ("username", "email", "password", "pictureUrl") VALUES
('didi', 'didi@uol.com', '123456', 'https://upload.wikimedia.org/wikipedia/pt/thumb/a/a2/Didi-RenatoArag%C3%A3o.jpg/250px-Didi-RenatoArag%C3%A3o.jpg');

INSERT INTO linkrs ("linkUrl", "text", "userId") VALUES
('https://www.uol.com.br', 'Uol Teste', '1');

INSERT INTO linkrs ("linkUrl", "text", "userId") VALUES
('https://g1.globo.com/', 'G1 Teste', '2');

INSERT INTO hashtags ("hashtag") VALUES
('hello-hashtag');

INSERT INTO hashtags ("hashtag") VALUES
('secondhashtag');

INSERT INTO hashlinkrs ("hashtagId", "linkId") VALUES
(1, 1);

INSERT INTO hashlinks ("hashtagId", "linkId") VALUES
(2, 1);