import prisma from "./prisma";
import checkRange from "./checkRange";

export default async function getMap(input) {
  try {
    const storeGame = await prisma.in_progress.findMany({
      where: {
        AND: [
          {
            game: {
              startsWith: `["${String("000" + input).slice(-3)}",["`,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 1,
      skip: 0,
      select: {
        game: true,
        time: true,
      },
      orderBy: [
        {
          game: "desc",
        },
      ],
    });

    if (storeGame.length == 0) {
      const newProgress = [String("000" + input).slice(-3), ["000", "001"]];
      console.log("newProgress", newProgress);

      try {
        await prisma.in_progress.create({
          data: {
            game: JSON.stringify(newProgress),
          },
          select: {
            game: true,
          },
        });

        return {
          status: 200,
          data: { newProgress },
        };
      } catch (error) {
        console.error("in_progress.create", error);
        return {
          status: 500,
          data: { message: "in_progress.create", error: error },
        };
      }
    }

    const diffTime = Math.abs(storeGame[0].time - new Date());
    //console.log("diffTime", diffTime);
    if (diffTime > 300000) {
      // Algume demorou muito pra calcular
      console.log("Max 5 min");
      return {
        status: 200,
        data: storeGame[0].game,
      };
    }

    // Novo processo
    let game = JSON.parse(storeGame[0].game);
    game.shift();

    const newRange = [String("000" + input).slice(-3)].concat(
      game.map((deep) => {
        return deep.map((e) => String("000" + (Number(e) + 1)).slice(-3));
      })
    );

    try {
      await prisma.in_progress.create({
        data: {
          game: JSON.stringify(newRange),
        },
        select: {
          game: true,
        },
      });

      return {
        status: 200,
        data: newRange,
      };
    } catch (error) {
      console.error("in_progress.create", error);
      return {
        status: 500,
        data: { message: "in_progress.create", error: error },
      };
    }
  } catch (error) {
    console.error("in_progress.findMany", error);
    return {
      status: 500,
      data: { message: "in_progress.findMany", error: error },
    };
  }
}
