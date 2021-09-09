import prisma from "../../../lib/prisma";

export default async function mapDB(req, res) {
  if (req.method === "GET") {
    if (req.query.start) {
      if (req.query.start <= 19 && req.query.start >= 0) {
        console.log(req.query.start);
        try {
          const result = await prisma.map.findMany({
            where: {
              AND: [
                {
                  start: {
                    in: [Number(req.query.start)],
                  },
                },
              ],
            },
          });
          res.status(200).json(result);
        } catch (error) {
          console.error(error);
          res.status(500).json(error);
        }
      } else {
        res.status(500).json({ start: "0 - 19" });
      }
    } else {
      res.status(500).json({ start: undefined });
    }
  } else if (req.method === "POST") {
  } else {
    res.status(404);
  }
}
