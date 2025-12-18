import { signOut } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://media-v2.episyche.com";

export const apiFetchWrapper = async (method, apiPath, isUserAuthorized, payload = null) => {
    try {
        const fullUrl = `${API_BASE_URL}${apiPath}`;
        
        const config = {
            method: method.toUpperCase(),
            headers: {},
        };

        // --- Payload Handling ---
        if (payload) {
            if (payload instanceof FormData) {
                config.body = payload;
            } else if (typeof payload === 'object') {
                config.headers["Content-Type"] = "application/json";
                config.body = JSON.stringify(payload);
            }
        }

        if (isUserAuthorized) {
            const userToken = typeof window !== "undefined"
                ? (sessionStorage.getItem("token") || localStorage.getItem("token"))
                : null;

            if (userToken) {
                config.headers["Authorization"] = `Token ${userToken}`;
            }
        }

        const response = await fetch(fullUrl, config);

        if (response.status === 401) {
            return {
                ok: false,
                status: 401,
                data: null,
                error: "Unauthorized"
            };
        }

        let data = null;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            return {
                ok: false,
                status: response.status,
                data: null,
                error: data || response.statusText
            };
        }

        return { ok: true, status: response.status, data: data, error: null };

    } catch (error) {
        console.error("API Fetch Error:", error);
        return {
            ok: false,
            status: 500,
            data: null,
            error: "Network error. Please check your connection."
        };
    }
};

// --- Helper Exports ---

export const retrieveOrRemove = (method, apiPath, isUserAuthorized) => apiFetchWrapper(method, apiPath, isUserAuthorized);

export const createOrUpdate = (payload, method, apiPath, isUserAuthorized) => apiFetchWrapper(method, apiPath, isUserAuthorized, payload);