import prisma from "../../../lib/prisma";
import checkRange from "../../../lib/checkRange";

export default async function mapDB(req, res) {
  if (req.method === "GET") {
    if (req.query.start) {
      const input = Number(req.query.start);
      if (input != NaN) {
        if (input <= 19 && input >= 0) {
          try {
            const result = await prisma.map.findMany({
              where: {
                AND: [
                  {
                    start: {
                      in: [input],
                    },
                  },
                ],
              },
            });

            const game = JSON.parse(result[0].game);
            game.shift();
            const newRange = [input].concat(game.map((e) => e[1]));
            const nextMoves = newRange[newRange.length-1]++ 
            const check = checkRange(newRange,nextMoves)
            console.log(result[0].game, "\n",check,"\n", newRange);
            if(check == false){
              // Nova profundidade
              res.status(200).json([1808]);
            } else {
              res.status(200).json(newRange);
            }
          } catch (error) {
            console.error(error);
            res.status(500).json(error);
          }
        } else {
          res.status(500).json({ start: "0 - 19" });
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
