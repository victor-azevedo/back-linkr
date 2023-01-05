import dayjs from "dayjs";
import urlMetadata from "url-metadata";
import {
  insertLinkDB,
  selectLastLinks,
} from "../repository/linkrs.repositories.js";

export async function insertLink(req, res) {
  const userId = 1;
  const { linkUrl, text } = req.body;

  try {
    const queryResult = await insertLinkDB(linkUrl, text, userId);

    if (queryResult.rowCount === 0) {
      console.log(
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        "- BAD_REQUEST: inserted none"
      );
      res.status(401).send("inserted none");
      return;
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message);
    return res.sendStatus(500);
  }
}

export async function getLinks(req, res) {
  try {
    const queryResult = await selectLastLinks();

    if (queryResult.rowCount === 0) {
      res.status(200).send("There are no post yet");
      return;
    }

    const links = [...queryResult.rows];

    const linksWithMetadata = await Promise.all(
      links.map(async (link) => {
        try {
          const linkMetadata = await urlMetadata(link.linkUrl);
          const { title, description, image } = linkMetadata;
          const linkWithMetadata = {
            ...link,
            linkMetadata: { title, description, image },
          };
          return linkWithMetadata;
        } catch (error) {
          return {
            ...link,
            linkMetadata: {
              title: "",
              description: "",
              image:
                "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
            },
          };
        }
      })
    );

    res.send(linksWithMetadata);
  } catch (error) {
    console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message);
    return res.sendStatus(500);
  }
}
