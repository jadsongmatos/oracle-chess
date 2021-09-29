import { Chess } from "chess.js";

export default function checkGames(body) {
  const cmpMoves = body.moves.slice(0, -1);
  for (let i = 0; i < body.gamesWins.length; i++) {
    if (body.progress.includes(cmpMoves)) {
      const chess = new Chess();
      let moves = chess.moves();
      for (let j = 0; j < body.gamesWins[i].length; j++) {
        if (moves[body.gamesWins[i][j]] != undefined) {
          chess.move(moves[body.gamesWins[i][j]]);
          moves = chess.moves();
        } else {
          return false;
        }
      }
      if (chess.in_checkmate() == false) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}
