import { oauthProviders } from "@/lib/oauthConfig";
import { AuthorizationCode } from "simple-oauth2";

export default async function handler(req, res) {
  const { provider, state } = req.query;
  const config = oauthProviders[provider];

  if (!config) {
    return res.status(400).json({ error: "Unknown provider" });
  }

  const { code } = req.query;

  try {
    let tokens;

    // 🔹 TikTok requires manual token exchange (uses client_key)
    if (provider === "tiktok") {
      const tokenResponse = await fetch(
        `${config.auth.tokenHost}${config.auth.tokenPath}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_key: config.client.id,
            client_secret: config.client.secret,
            code,
            grant_type: "authorization_code",
            redirect_uri: config.redirectUri,
          }),
        }
      );

      tokens = await tokenResponse.json();
    }
    // 🔹 Twitter (with PKCE)
    else if (provider === "x") {
      const cookies = req.headers.cookie || "";
      const pkceVerifier = cookies
        .split(";")
        .find((c) => c.trim().startsWith("pkce_verifier="))
        ?.split("=")[1];

      if (!pkceVerifier) {
        return res.status(400).json({ error: "Missing PKCE verifier" });
      }

      const client = new AuthorizationCode({
        http: { json: "force" },
        auth: config.auth,
        client: config.client,
      });

      const tokenParams = {
        code,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
        code_verifier: pkceVerifier,
      };

      const accessToken = await client.getToken(tokenParams);
      tokens = accessToken.token;
    }
    else if (provider === "huggingface") {
      const cookies = req.headers.cookie || "";
      const pkceVerifier = cookies
        .split(";")
        .find((c) => c.trim().startsWith("pkce_verifier="))
        ?.split("=")[1];

      if (!pkceVerifier) {
        return res.status(400).json({ error: "Missing PKCE verifier" });
      }

      const client = new AuthorizationCode({
        http: { json: "force" },
        auth: config.auth,
        client: config.client,
      });

      const tokenParams = {
        code,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
        code_verifier: pkceVerifier,
      };

      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(`${config.client.id}:${config.client.secret}`).toString("base64")
      }

      const accessToken = await client.getToken(tokenParams, headers);
      tokens = accessToken.token;
    }
    // 🔹 Default: Hugging Face, GitHub, Google, etc.
    else {
      const client = new AuthorizationCode({
        http: { json: "force" },
        auth: config.auth,
        client: config.client,
      });

      const tokenParams = {
        code,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
        scope: config.scope,
        state
      };

      const accessToken = await client.getToken(tokenParams);
      tokens = accessToken.token;
    }

    console.log(`[${provider}] Tokens:`, tokens);

    // 🔹 Set secure cookies for access/refresh tokens
    const cookiesData = [
      `${provider}_access_token=${tokens.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${tokens.expires_in || 3600}`,
    ];

    if (tokens.refresh_token) {
      cookiesData.push(
        `${provider}_refresh_token=${tokens.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict`
      );
    }

    res.setHeader("Set-Cookie", cookiesData);
    res.redirect(`/dashboard/chatbots/manage?state=${state}&code=${code}&provider=${provider}`);
  } catch (error) {
    console.error(`[${provider}] Auth Error:`, error.message, error.data);
    res.redirect(`/dashboard/chatbots/manage?state=${state}`);
  }
}
