import { clearLocalStorageExceptKeys, clearSessionStorageExceptKeys, localStorageUpdateUserData } from "@/utils";
import { signOut } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
    const [loginUser, setLoginUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userToken = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (userToken) {
            // setLoginUser(localStorage);
            initialUpdateLoginUser();
        }

        setLoading(false);
    }, []);

    // Initial Update loginUser
    const initialUpdateLoginUser = () => {
        const parseStorage = (storage) => {
            return Object.fromEntries(
                Object.entries(storage).map(([key, value]) => {
                    try {
                        return [key, JSON.parse(value)];
                    } catch {
                        return [key, value];
                    }
                })
            );

        }

        const sessionData = parseStorage(sessionStorage);
        const localData = parseStorage(localStorage);

        const finalData = sessionData?.token ? sessionData : localData;

        setLoginUser(finalData);
    }


    // Logout function
    // const logout = async () => {
    //     await signOut({ redirect: false });

    //     clearLocalStorageExceptKeys(["offerShown"]);
    //     clearSessionStorageExceptKeys(["offerShown"]);
    //     setLoginUser(null);
    // };
    const logout = async () => {
        await signOut({ redirect: false });

        if (!sessionStorage.getItem("token")) {
            
            clearLocalStorageExceptKeys(["offerShown"]);
        }

        // Always clear session storage (except "offerShown")
        clearSessionStorageExceptKeys(["offerShown"]);

        setLoginUser(null);
    };

    // update localStorage and context as well
    const updateLoginUser = (userData = {}) => {
        if (Object.values(userData).length === 0 || !userData) return;

        setLoginUser(prev => ({
            ...prev,
            ...userData
        }));
        for (const property in userData) {
            if (userData[property] instanceof Object) {
                localStorage.setItem(property, JSON.stringify(userData[property]));
            }
            else {
                localStorage.setItem(property, userData[property]);
            }
        }

        localStorageUpdateUserData({
            ...loginUser,
            ...userData
        });
    }

    const updateSessionLoginUser = (userData = {}) => {
        if (Object.values(userData).length === 0 || !userData) return;

        setLoginUser(prev => ({
            ...prev,
            ...userData
        }));
        for (const property in userData) {
            if (userData[property] instanceof Object) {
                sessionStorage.setItem(property, JSON.stringify(userData[property]));
            }
            else {
                sessionStorage.setItem(property, userData[property]);
            }
        }
    }

    const deleteLoginUser = (keys = []) => {
        if (keys.length === 0 || !loginUser) return;

        let newData = { ...loginUser };
        for (const key of keys) {
            delete newData[key];
            localStorage.removeItem(key);
        }

        setLoginUser(newData);
    }

    return (
        <AuthContext.Provider value={{ loginUser, updateLoginUser, updateSessionLoginUser, deleteLoginUser, logout, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuthContext = () => useContext(AuthContext);
