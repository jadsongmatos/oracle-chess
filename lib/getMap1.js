import prisma from "./prisma";

const result = await prisma.$queryRaw(
  Prisma.sql`select * from initial where length < 200 order by time;`
)

export default async function getMap(input) {
  try {
    // Procurando por cota com saida igual input
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
          time: "asc",
        },
      ],
    });

    // Verificando se existe alguma conta em andamento
    if (storeGame.length != 0) {
      // Tem alguma cota em andamento

      // Verirficando se passou mais 5 minutos
      const diffTime = Math.abs(storeGame[0].time - new Date());
      //console.log("diffTime", diffTime);
      if (diffTime > 300000) {
        // Algume demorou muito pra calcular
        console.log("Max 5 min");
        return {
          status: 200,
          data: storeGame[0].game,
        };
      } else {
        // Procura cota mais alta
        try {
          const cotaHigh = await prisma.in_progress.findMany({
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

          const cota =  stringToCota(storeGame[0].game)
          /*
          verificar cota mais alta bateu no limite
            se sim
              gerar nova profundidade
                entregar nova cota
            se não
              gerar nova cota
                entregar nova cota
          */
        } catch (error) {
          console.error("47 in_progress.findMany", error);
          return {
            status: 500,
            data: { message: "47 in_progress.findMany", error: error },
          };
        }
      }
    } else {
      // Não tem nenhum cota em andamento
      /*
        gerar nova cota
          pegar range jogas finalisadas
            verificar range bateu no limite
            se sim
              gerar nova profundidade
                entregar nova cota
            se não
              gerar nova cota
                entregar nova cota
      */
    }
  } catch (error) {
    console.error("5 in_progress.findMany", error);
    return {
      status: 500,
      data: { message: "5 in_progress.findMany", error: error },
    };
  }
}

function stringToCota(cota) {
  let game = JSON.parse(cota);
  const input = Number(game[0])
  game.shift();

  return [String("000" + input).slice(-3)].concat(
    game.map((deep) => {
      return deep.map((e) => String("000" + (Number(e))).slice(-3));
    })
  );
}
