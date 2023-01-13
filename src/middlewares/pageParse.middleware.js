import chalk from "chalk";
import dayjs from "dayjs";

export async function pageParse(req, res, next) {
  try {
    const { page, limit } = req.query;

    let offset = 0;

    if (page > 1) {
      offset = (Number(page) - 1) * 10 || 0;
    }

    res.locals.offset = offset;
    res.locals.limit = limit || 10;
    next();
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(500).send(error);
    return;
  }
}
