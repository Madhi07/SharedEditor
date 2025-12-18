import { signOut } from "next-auth/react";
import { clearLocalStorageExceptKeys } from ".";

// Methods => GET, DELETE
export const retrieveOrRemove = async (method, apiPath, isUserAuthorized) => {
    try {
        let headers = {
            "Content-Type": "application/json",
        };

        if (isUserAuthorized) {
            let userToken = sessionStorage.getItem("token") || localStorage.getItem("token");
            headers["Authorization"] = `Token ${userToken || ''}`;
        }

        const response = await fetch(`${process.env.API_URL}${apiPath}`,
            {
                method: method,
                headers,
            }
        );

        if (response?.status === 401) {
            await signOut({ redirect: false });
            clearLocalStorageExceptKeys(["offerShown"]);
            window.location.pathname = '/login';
            return;
        }

        return response;

    }
    catch (error) {
        // console.log(error)
        return {
            status: 500,
            message: "Network error. Please check your connection and try again"
        };
    }
}

// Methods => POST, PUT, PATCH
export const createOrUpdate = async (payload, method, apiPath, isUserAuthorized) => {
    try {
        let headers = {};
        let body;

        if (payload instanceof FormData) {
            body = payload;
        }
        else if (payload instanceof Object) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(payload);
        }

        if (isUserAuthorized) {
            let userToken = sessionStorage.getItem("token") || localStorage.getItem("token");
            headers["Authorization"] = `Token ${userToken}`;
        }

        const response = await fetch(`${process.env.API_URL}${apiPath}`,
            {
                method,
                headers,
                body
            }
        );

        if (response?.status === 401) {
            await signOut({ redirect: false });
            clearLocalStorageExceptKeys(["offerShown"]);
            window.location.pathname = '/login';
            return;
        }

        return response;

    }
    catch (error) {
        return {
            status: 500,
            message: "Network error. Please check your connection and try again"
        };
    }

}