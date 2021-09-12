import getProgress from "../../../lib/getProgress";

export default async function mapDB(req, res) {
  if (req.method === "GET") {
    const result = await getProgress();
    res.status(result.status).json(result.data);
  } else if (req.method === "POST") {
  } else {
    res.status(404).json({ method: ["GET", "POST"] });
  }
}
