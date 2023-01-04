import dayjs from "dayjs";
import { insertLinkDB } from "../repository/linkrs.repositories.js";

export async function insertLink(req, res) {
  const userId = req.userId;
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
