import Chess from "chess.js"

/*
let test = [
  2, 1, 14, 3, 12, 9, 9, 25, 24, 19, 2, 2, 11, 8, 14, 7, 30, 0, 7, 15, 16, 26,
  1, 12, 16, 14, 0, 22, 3, 3, 21, 9, 14, 0, 18, 25, 26, 27, 20, 29, 1, 1, 7,
];

// Difinculdade 2^Deep

let chess = new Chess();
test.forEach((e) => {
  let moves = chess.moves();
  chess.move(moves[e]);
});

const result = genGame(chess.history(), test, 4);
console.log(result);
console.log(result.length);
*/

export default function genGame(history, initialMoves, range) {
  let index = 0;
  let gamesMate = [];
  const deep = initialMoves.length + 11;

  runGame(history, initialMoves);
  return gamesMate;

  function runGame(game, play) {
    index++;
    if (index % 10 == 0) {
      console.log(index, play.length);
    }

    let gameA = new Chess();
    let gameB = new Chess();

    game.forEach((move) => {
      gameA.move(move);
      gameB.move(move);
    });

    moves = gameA.moves();
    if (moves[range] == undefined) {
      return;
    }
    gameA.move(moves[range]);

    moves = gameB.moves();
    if (moves[range + 1] == undefined) {
      return;
    }
    gameB.move(moves[range + 1]);

    if (gameA.in_checkmate() == true) {
      let newPlay = [...play];
      newPlay.push(range);

      gamesMate.push(newPlay);
    } else if (!gameA.game_over() && play.length < deep) {
      let newPlay = [...play];
      newPlay.push(range);

      runGame(gameA.history(), newPlay);
    }

    if (gameB.in_checkmate() == true) {
      let newPlay = [...play];
      newPlay.push(range + 1);

      gamesMate.push(newPlay);
    } else if (!gameB.game_over() && play.length < deep) {
      let newPlay = [...play];
      newPlay.push(range + 1);

      runGame(gameB.history(), newPlay);
    }
  }
}
