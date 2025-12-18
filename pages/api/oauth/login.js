import { AuthorizationCode } from "simple-oauth2";
import { oauthProviders } from "@/lib/oauthConfig";
import { generatePKCE } from "@/lib/pkce";

export default async function handler(req, res) {
  const { provider, state = Math.random().toString(36).substring(7) } = req.query;
  const config = oauthProviders[provider];
  if (!config) return res.status(400).json({ error: "Unknown provider" });

  // const state = Math.random().toString(36).substring(7);

  // 🔹 Special cases by provider
  if (provider === "tiktok") {
    // TikTok requires client_key
    const baseUrl = `${config.auth.authorizeHost}${config.auth.authorizePath}`;
    const pkce = await generatePKCE();
    res.setHeader(
      "Set-Cookie",
      `pkce_verifier=${pkce.verifier}; Path=/; HttpOnly; SameSite=Lax`
    );
    const params = new URLSearchParams({
      client_key: config.client.id,
      response_type: "code",
      scope: Array.isArray(config.scope) ? config.scope.join(" ") : config.scope,
      redirect_uri: config.redirectUri,
      state,
      code_challenge: pkce.challenge,
      code_challenge_method: "S256",
    });
    return res.redirect(`${baseUrl}?${params.toString()}`);
  }

  if (provider === "x" || provider === "huggingface") {
    // Twitter requires PKCE
    const client = new AuthorizationCode({
      http: { json: 'force' },
      auth: config.auth,
      client: config.client
    });
    const pkce = await generatePKCE();

    res.setHeader(
      "Set-Cookie",
      `pkce_verifier=${pkce.verifier}; Path=/; HttpOnly; SameSite=Lax`
    );

    const authorizationUri = client.authorizeURL({
      redirect_uri: config.redirectUri,
      state,
      scope: Array.isArray(config.scope)
        ? config.scope.join(" ")
        : config.scope,
      code_challenge: pkce.challenge,
      code_challenge_method: "S256",

    });

    return res.redirect(authorizationUri);
  }

  // 🔹 Default: Hugging Face, GitHub, Google, etc.
  const client = new AuthorizationCode({
    http: { json: 'force' },
    auth: config.auth,
    client: config.client
  });

  const authorizationUri = client.authorizeURL({
    redirect_uri: config.redirectUri,
    state,
    access_type: "offline",
    prompt: "consent",
    scope: Array.isArray(config.scope)
      ? config.scope.join(" ")
      : config.scope,
  });

  res.redirect(authorizationUri);
}
