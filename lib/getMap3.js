import prisma from "./prisma";
import checkRange from "./checkRange";

export default async function getMap(input, next) {
  try {
    const storeGame = await prisma.map.findMany({
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

    let game = JSON.parse(storeGame[0].game);
    game.shift();
    const newRange = [input].concat(game.map((e) => e[1]));
    newRange[newRange.length - 1] = newRange[newRange.length - 1] + next;
    const nextMoves = newRange[newRange.length - 1];
    const check = checkRange(newRange, nextMoves);
    console.log(storeGame[0].game, "\n", check, "\n", newRange);
    if (check == false) {
      // Nova profundidade
      game = JSON.parse(storeGame[0].game);
      game.push([0, 0]);


      // Verirficar sé alguem está fazendo esse movimento
      // Incompleto
      console.log("32",game)
      try {
        await prisma.in_progress.create({
          data: {
            game: JSON.stringify(game),
          },
          select: {
            game: true,
            time: true,
          },
        });

        return { status: 200, data: { game } };
      } catch (error) {
        console.error(error);
        return {
          status: 500,
          data: { message: "in_progress.create", error: error },
        };
      }
    } else {
      game = JSON.parse(storeGame[0].game);
      game[game.length - 1][1] = game[game.length - 1][1] + next;

      // Verirficar sé alguem está fazendo esse movimento
      try {
        const in_progress = await prisma.in_progress.findMany({
          where: {
            AND: [
              {
                game: {
                  in: [JSON.stringify(game)],
                },
              },
            ],
          },
        });

        if (in_progress[0]) {
          const diffTime = Math.abs(in_progress[0].time - new Date());
          console.log("diffTime", diffTime);
          if (diffTime < 300000) {
            // Esse range está alguem a menos 5 minutos
            console.log("Esse range está alguem a menos 5 minutos");
            // Testar outro range
            return await getMap(input, next + 1);
          }
        } else {
          try {
            await prisma.in_progress.create({
              data: {
                game: JSON.stringify(game),
              },
              select: {
                game: true,
                time: true,
              },
            });

            return {
              status: 200,
              data: game,
            };
          } catch (error) {
            console.error(error);
            return {
              status: 500,
              data: { message: "in_progress.create", error: error },
            };
          }
        }
        // Testar outro range
        return await getMap(input, next +1 );
      } catch (error) {
        console.error(error);

        return {
          status: 500,
          data: { message: "in_progress.findMany", error: error },
        };
      }
    }
  } catch (error) {
    console.error(error);
    return { status: 500, data: { message: "map.findMany", error: error } };
  }
}
