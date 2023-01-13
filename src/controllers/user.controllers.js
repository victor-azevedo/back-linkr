import chalk from "chalk";
import dayjs from "dayjs";
import urlMetadata from "url-metadata";
import connection, { followsTb, usersTb } from "../database/db.js";
import {
  insertLikesIntoLinkrCard,
  insertMetadataIntoLinkrCard,
  insertRepostsNumberIntoLinkrCard,
} from "../helpers/linkrCard.helper.js";
import { linkrsFilteredByUserId } from "../repository/linkrs.repositories.js";
import {
  getUserThatIsFollowing,
  insertFollow,
  removeFollow,
} from "../repository/users.repositories.js";

export async function searchUserQuery(req, res) {
  try {
    const { searchText } = res.locals;
    const { user } = res.locals;

    const { rows: users } = await connection.query(
      ` 
            SELECT u.id, u.username, u."pictureUrl", 
            (CASE
                WHEN f."followerId" = $2 THEN TRUE
                ELSE FALSE
            END) 
            AS "isFollowing"
            FROM ${usersTb} u
            LEFT JOIN ${followsTb} f ON f."followingId" = u.id AND f."followerId" = $2
            WHERE username ILIKE CONCAT($1::text, '%')
            ORDER BY "isFollowing" DESC, username ASC
        `,
      [searchText, user.id]
    );

    res.status(200).send(users);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.send(error);
  }
}

export async function getUserInUserPage(req, res) {
  try {
    const { userPageId, user } = res.locals;
    const offset = res.locals.offset;
    const limit = res.locals.limit;

    const { rows: linkrs } = await linkrsFilteredByUserId(
      userPageId,
      limit,
      offset
    );

    const linkrsWithMetadata = await insertMetadataIntoLinkrCard(linkrs);
    const linkrsWithMetadataAndLikes = await insertLikesIntoLinkrCard(
      linkrsWithMetadata,
      user.username
    );
    const linkrsWithMetatadataLikesAndReposts =
      await insertRepostsNumberIntoLinkrCard(linkrsWithMetadataAndLikes);

    res.status(200).send(linkrsWithMetatadataLikesAndReposts);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(400).send(error);
  }
}

export async function followUser(req, res) {
  try {
    const { user } = res.locals;
    const { id: userToFollow } = req.params;
    await insertFollow(user.id, userToFollow);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
}

export async function isFollowing(req, res) {
  try {
    const { user } = res.locals;
    const { id: userThatMayBeFollowing } = req.params;
    const { rows: userFollowing } = await getUserThatIsFollowing(
      user.id,
      userThatMayBeFollowing
    );
    let isFollowing = false;
    if (userThatMayBeFollowing) {
      isFollowing = userFollowing.length !== 0;
    } else {
      isFollowing = userFollowing;
    }
    res.status(200);
    res.send(isFollowing);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
}

export async function unfollowUser(req, res) {
  try {
    const { user } = res.locals;
    const { id: userToUnfollow } = req.params;
    await removeFollow(user.id, userToUnfollow);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
}
