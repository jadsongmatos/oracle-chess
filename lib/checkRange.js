import {Chess} from "chess.js"

export default function checkRange(initialMoves, range) {
  let chess = new Chess();
  let moves = chess.moves();
  initialMoves.forEach((e) => {
    moves = chess.moves();
    chess.move(moves[e]);
  });

  moves = chess.moves();
  console.log(moves.length, range ,moves[range]);

  if (moves[range] == undefined) {
    return false;
  }

  return true;
}