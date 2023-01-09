import {
  getPostsByHashtag,
  getUsersById,
  rankingHashtags,
} from "../repository/hashtag.repositories.js";
import urlMetadata from "url-metadata";
import chalk from "chalk";
import dayjs from "dayjs";

async function getPostsByHashtags(req, res) {
  const { hashtag } = req.params;
  try {
    const posts = await getPostsByHashtag(hashtag);

    if (posts.rowCount === 0) {
      return res.status(200).send("There are no post yet");
    }

    const object = [];
    for (let i = 0; i < posts.length; i++) {
      const users = await getUsersById(posts[i].userId);
      const linkMetadata = await urlMetadata(posts[i].linkUrl);
      const { title, description, image } = linkMetadata;
      let post = {
        userid: users[0].id,
        username: users[0].username,
        userPictureUrl: users[0].pictureUrl,
        link: posts[i].linkUrl,
        text: posts[i].text,
        linkMetadata: { title, description, image },
        linkIsliked: posts[i].linkIsliked,
      };

      object.push(post);
    }
    return res.status(200).send(object);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.status(500).send(error);
  }
}

async function getRankingHashtags(req, res) {
  try {
    const hashtags = await rankingHashtags();
    return res.status(200).send(hashtags);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.status(500).send(error);
  }
}

export { getPostsByHashtags, getRankingHashtags };

// id,
// username,
// userPictureUrl,
// link,
// text,
// linkMetadata,
// linkIsliked,
