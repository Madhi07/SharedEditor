export const oauthProviders = {
    facebook: {
        client: {
            id: "1367377281391195",
            secret: "4e58d551668ddf51235c6e64c37cb194",
        },
        auth: {
            authorizeHost: "https://www.facebook.com",
            authorizePath: "/v23.0/dialog/oauth",
            tokenHost: "https://graph.facebook.com",
            tokenPath: "/v23.0/oauth/access_token",
        },
        scope: "pages_messaging pages_manage_metadata pages_show_list pages_read_engagement business_management",
        redirectUri: `${process.env.WEB_URL}/api/oauth/callback/facebook`,
    },
    instagram: {
        client: {
            id: "1367377281391195",
            secret: "4e58d551668ddf51235c6e64c37cb194",
        },
        auth: {
            authorizeHost: "https://www.facebook.com",
            authorizePath: "/v23.0/dialog/oauth",
            tokenHost: "https://graph.facebook.com",
            tokenPath: "/v23.0/oauth/access_token",
        },
        scope: "instagram_basic instagram_manage_messages pages_messaging pages_manage_metadata pages_show_list pages_read_engagement business_management",
        redirectUri: `${process.env.WEB_URL}/api/oauth/callback/instagram`,
    },
    whatsapp: {
        client: {
            id: "773038332298691",
            secret: "99af04f5816a29543d8aea1abb204c04",
        },
        auth: {
            authorizeHost: "https://www.facebook.com",
            authorizePath: "/v23.0/dialog/oauth",
            tokenHost: "https://graph.facebook.com",
            tokenPath: "/v23.0/oauth/access_token",
        },
        scope: "whatsapp_business_management,whatsapp_business_messaging",
        redirectUri: `${process.env.WEB_URL}/api/oauth/callback/whatsapp`,
    },
    discord: {
        client: {
            id: "1424616095200968787",
            secret: "pgJ-_1UZ5Wk2Nc56alBQjALMAuAH5O1p",
        },
        auth: {
            authorizeHost: "https://discord.com",
            authorizePath: "/oauth2/authorize",
            tokenHost: "https://discord.com",
            tokenPath: "/api/oauth2/token",
        },
        scope: "applications.commands bot",
        redirectUri: `${process.env.WEB_URL}/api/oauth/callback/discord`,
    },
    slack: {
        client: {
            id: "9636130310275.9640491178470",
            secret: "b67b59c9c9333bf9ad805f4e3762b702",
        },
        auth: {
            authorizeHost: "https://slack.com",
            authorizePath: "/oauth/v2/authorize",
            tokenHost: "https://slack.com",
            tokenPath: "/api/oauth.v2.access",
        },
        scope: "app_mentions:read,channels:read,chat:write,conversations.connect:write,im:history",
        redirectUri: `https://app.agentzee.ai/api/oauth/callback/slack`,
    },
};
