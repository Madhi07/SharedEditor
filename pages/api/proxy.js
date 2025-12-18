export default async function handler(req, res) {
    const { url } = req.query;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: "Fetch failed" });
        }

        const contentType = response.headers.get("Content-Type") || "application/octet-stream";
        const buffer = await response.arrayBuffer();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", contentType);
        res.send(Buffer.from(buffer));
    } catch (error) {
        res.status(500).json({ error: "Server error", detail: error.message });
    }
}