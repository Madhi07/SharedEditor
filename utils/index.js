import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import { createOrUpdate } from "./fetchUtils";
import { conversionTrackingApiPath } from "@/constants/apiPaths";
import { encryptedkeys, userInfoKeys } from "@/constants";

export function formatLabel(input = "") {
    return input
        .toLowerCase()
        .replace(/[-_]/g, ' ') // replace - and _ with space
        .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letter of each word
}

export const getDateRange = (filterType = "") => {
    const now = new Date();
    let start, end;

    const formatDate = (date) =>
        date.toLocaleDateString("en-GB").split("/").join("-"); // DD-MM-YYYY

    switch (filterType) {
        case "Today":
            start = end = now;
            break;

        case "Week":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay()); // Sunday (or adjust to Monday)
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6); // Saturday
            start = weekStart;
            end = weekEnd;
            break;

        case "Month":
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            start = monthStart;
            end = monthEnd;
            break;

        default:
            return null;
    }

    return {
        start_date: formatDate(start),
        end_date: formatDate(end),
    };
};

export function getRelativeTime(dateInput) {
    const now = new Date();
    const inputDate = new Date(dateInput);

    const diffMs = now - inputDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 30) return "Just now";
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;

    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;

    // Else fallback to formatted date (e.g. "on 04 Jun 2025")
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return `${inputDate.toLocaleDateString("en-US", options)}`;
}

export const slugify = (text = "") => {
    if (!text) return;

    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "") // remove non-alphanumeric except spaces
        .replace(/\s+/g, "-");
}

export function clearLocalStorageExceptKeys(keysToKeep = []) {
    const saved = {};

    keysToKeep.forEach(key => {
        const value = localStorage.getItem(key);
        saved[key] = value;
    });

    localStorage.clear();

    Object.keys(saved).forEach(key => {
        localStorage.setItem(key, saved[key]);
    });
}

export function clearSessionStorageExceptKeys(keysToKeep = []) {
    const saved = {};

    keysToKeep.forEach(key => {
        const value = sessionStorage.getItem(key);
        saved[key] = value;
    });

    sessionStorage.clear();

    Object.keys(saved).forEach(key => {
        sessionStorage.setItem(key, saved[key]);
    });
}

export const localStorageUpdateUserData = (userProfileResponse) => {
    let localStorageKeys = { ...userInfoKeys }

    delete localStorageKeys['encrypted'] // encrypted key delete 

    for (const key in localStorageKeys) {
        if (userProfileResponse.hasOwnProperty(key)) {
            let data;
            if (encryptedkeys.includes(key)) {
                data = webdataencrypt(String(userProfileResponse[key]))
            } else {
                if (key === 'profile_image') {
                    data = userProfileResponse[key] + "?key=" + uuidv4()
                } else {
                    data = userProfileResponse[key]
                }
            }
            if (data) {
                localStorage.setItem(key, data)
            }
        }
        localStorage.setItem("encrypted", true)
    }


    // const session to userconvert 

    let visit = localStorage.getItem("visit_id")
    let last_page = localStorage.getItem("visit_page_id")
    let visitor = localStorage.getItem("visitor_id")

    if (visit && last_page && visitor) {
        let payload = {
            "conversion_type": "signup",
            "user": userProfileResponse['user_id'],
            visitor,
            last_page,
            visit,
        }
        const response = createOrUpdate(payload, "POST", conversionTrackingApiPath, false)
        if (response) {

        }
    }

}

export const sleepTimeIntervel = async (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); }

const isEncryptionEnabled = process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION === "true";

export const webdataencrypt = (data) => {
    if (!isEncryptionEnabled) return data; // Return original data if encryption is disabled
    return CryptoJS.AES.encrypt(data, ACTIVITY_ENCRYPT_KEY).toString();
}

export const webdatadecrypt = (data) => {
    if (!isEncryptionEnabled) return data; // Return original data if encryption is disabled
    var bytes = CryptoJS.AES.decrypt(data, ACTIVITY_ENCRYPT_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
