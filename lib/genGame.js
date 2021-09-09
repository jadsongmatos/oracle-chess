import Chess from "chess.js"

/*
const result = genGame([
  2, 1, 14, 3, 12, 9, 9, 25, 24, 19, 2, 2, 11, 8, 14, 7, 30, 0, 7, 15, 16, 26,
  1, 12, 16, 14, 0, 22, 3, 3, 21, 9, 14, 0, 18, 25, 26, 27, 20, 29, 1, 1, 7, 5,
], 4);
console.log(result);*/

export default function genGame(initialMoves, range) {
  if (checkRange(initialMoves, range)) {
    let index = 0;
    let gamesMate = [];

    runGame(initialMoves);
    return gamesMate;

    function runGame(play) {
      index++;
      console.log(index, play.length);

      let chess = new Chess();
      let moves = chess.moves();
      play.forEach((e) => {
        moves = chess.moves();
        chess.move(moves[e]);
      });

      chess.move(moves[play[play.length - 1]]);

      if (chess.in_checkmate() == true) {
        gamesMate.push([...play]);
      } else if (play.length < 100) {
        let newPlay = [...play];
        newPlay.push(range);
        runGame(newPlay);
      }
    }
  }
}

function checkRange(initialMoves, range) {
  let chess = new Chess();
  let moves = chess.moves();
  initialMoves.forEach((e) => {
    moves = chess.moves();
    chess.move(moves[e]);
  });

  moves = chess.moves();
  //console.log(moves.length, moves[moves.length]);
  //console.log(moves[range[0]], moves[range[1]]);

  if (moves[range] == undefined) {
    return false;
  }

  return true;
}