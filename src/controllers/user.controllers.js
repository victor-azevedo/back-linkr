import chalk from "chalk";
import dayjs from "dayjs";
import urlMetadata from "url-metadata";
import connection, {
    followsTb,
    usersTb,
} from "../database/db.js";
import {
    insertLikesIntoLinkrCard,
    insertMetadataIntoLinkrCard,
} from "../helpers/linkrCard.helper.js";
import { linkrsFilteredByUserId } from "../repository/linkrs.repositories.js";
import { getUserThatIsFollowing, insertFollow, removeFollow } from "../repository/users.repositories.js";

export async function searchUserQuery(req, res) {
    try {
        const { searchText } = res.locals;

        const { rows: users } = await connection.query(
            ` 
            SELECT id, username, "pictureUrl"
            FROM ${usersTb}
            WHERE username ILIKE CONCAT($1::text, '%') 
        `,
            [searchText]
        );

        res.status(200).send(users);
    } catch (error) {
        console.log(chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message));
        return res.send(error);
    }
}

export async function getUserInUserPage(req, res) {
    try {
        const { userPageId, user } = res.locals;

        const { rows: linkrs } = await linkrsFilteredByUserId(userPageId);
        const linkrsWithMetadata = await insertMetadataIntoLinkrCard(linkrs);
        const linkrsWithMetadataAndLikes = await insertLikesIntoLinkrCard(
            linkrsWithMetadata,
            user.username
        );

        res.status(200).send(linkrsWithMetadataAndLikes);
    } catch (error) {
        console.log(chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message));
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
        const { rows: userFollowing } = await getUserThatIsFollowing(user.id, userThatMayBeFollowing)
        const isFollowing = userFollowing.length !== 0;
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
