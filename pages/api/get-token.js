// pages/api/get-token.js
export default function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const { provider } = req.query;
  const query = provider ?? "google";

  // Build regex for both access & refresh tokens
  const accessRegex = new RegExp(`${query}_access_token=([^;]+)`);
  const refreshRegex = new RegExp(`${query}_refresh_token=([^;]+)`);

  const accessMatch = cookie.match(accessRegex);
  const refreshMatch = cookie.match(refreshRegex);

  res.json({
    accessToken: accessMatch ? accessMatch[1] : null,
    refreshToken: refreshMatch ? refreshMatch[1] : null,
  });
}
