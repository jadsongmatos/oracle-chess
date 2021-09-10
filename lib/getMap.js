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
      take: 1,
      skip: 0,
      select: {
        game: true,
      },
    });

    let game = JSON.parse(storeGame[0].game);
    game.shift();

    const newRange = [String("000" + input).slice(-3)].concat(
      game.map((e) => [
        String("000" + e[0]).slice(-3),
        String("000" + e[1]).slice(-3),
      ])
    );

    console.log(newRange);
    return {
      status: 500,
      data: { message: "map.find", game: newRange },
    };
  } catch (error) {
    console.error("map.find", error);
    return {
      status: 500,
      data: { message: "map.find", error: error },
    };
  }
}
