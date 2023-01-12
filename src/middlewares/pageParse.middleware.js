import chalk from "chalk";
import dayjs from "dayjs";

export async function pageParse(req, res, next) {
  try {
    const { page } = req.query;

    let offset = 0;
    let limit = 10;

    if (page > 0) {
      offset = (Number(page) - 1) * 10 || 0;
      limit = Number(page) * 10 || 10;
    }

    res.locals.offset = offset;
    res.locals.limit = limit;
    next();
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(500).send(error);
    return;
  }
}
