import getMap from "../../../lib/getMap";

export default async function mapDB(req, res) {
  if (req.method === "GET") {
    if (req.query.start) {
      const input = Number(req.query.start);
      if (input != NaN) {
        if (input <= 19 && input >= 0) {
          const result = await getMap(input,1)
          res.status(result.status).json(result.data)
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
