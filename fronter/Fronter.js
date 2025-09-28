export default async function handler(req, res) {
  try {
    const token = process.env.SP_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "SP_TOKEN not set" });
    }

    const upstream = await fetch("https://api.apparyllis.com/v1/fronters/", {
      headers: { Authorization: token }
    });

    const text = await upstream.text();

    // Pass through status + content-type; add cache for speed (optional)
    res
      .status(upstream.status)
      .setHeader(
        "Content-Type",
        upstream.headers.get("content-type") || "application/json"
      )
      .setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300")
      .send(text);
  } catch (e) {
    res.status(500).json({ error: "Proxy error", details: String(e) });
  }
}
