import prisma from "./prisma";
import checkGame from "./checkGame";
import {compressVec} from "./VecToString"

export default async function postProgress(body) {
  return await Promise.all(body.games.map((game) => postGames(game)))
    .then(async (values) => {
      try {
        const initial = await prisma.initial.update({
          where: {
            moves: body.moves, //"[0,0,0,0]",
          },
          data: {
            progress: body.progress, //"[0,0,0,0,0]",
            length: JSON.parse(body.progress).length,
            time: new Date(),
          },
          select: {
            progress: true,
            time: true,
            length: true,
          },
        });

        return {
          status: 200,
          data: { games: values, init: initial },
        };
      } catch (error) {
        console.error("checkmate.create", error);
        return {
          status: 500,
          data: { message: "checkmate.create", error: error },
        };
      }
    })
    .catch((error) => {
      console.error("initial.update", error);
      return {
        status: 500,
        data: { message: "initial.update", error: error },
      };
    });
}

async function postGames(game) {
  return new Promise(async (resolve, reject) => {
    try {
      if (checkGame(game) == false) {
        reject("game invalido");
      } else {
        try {
          const games = await prisma.checkmate.create({
            data: {
              game: compressVec(game), //"sa5f45ds4",
            },
            select: {
              game: true,
            },
          });
          resolve(games);
        } catch (error) {
          reject(error);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}
