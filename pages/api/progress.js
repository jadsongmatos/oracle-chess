import getProgress from "../../lib/getProgress";
import postProgress from "../../lib/postProgress";

export default async function progress(req, res) {
  if (req.method === "GET") {
    const result = await getProgress();
    res.status(result.status).json(result.data);
  } else if (req.method === "POST") {
    console.log(req.body)
    const result = await postProgress(req.body);
    res.status(result.status).json(result.data);
  } else {
    res.status(404).json({ method: ["GET", "POST"] });
  }
}
