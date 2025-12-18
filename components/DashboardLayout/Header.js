import { useRouter } from "next/router";
import { FaBars, FaBell, FaCreditCard, FaMoon, FaSun } from "react-icons/fa";
import { headerTitles } from "./constants";
import { useMemo, useState } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import LoggedInPopover from "./LoggedInPopover";
import { logoutApiPath } from "@/constants/apiPaths";
import { createOrUpdate } from "@/utils/fetchUtils";
import CreditsRecharge from "../Modals/CreditsRecharge";
import { AgentZeeHead } from "../SVG";
import clsx from "clsx";
import Image from "next/image";
import NotificationPopover from "./NotificationPopover";

export default function Header({ showSidebar, setShowSidebar }) {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { loginUser, logout } = useAuthContext();

    // const headTitle = router.query?.index?.length > 0 ? headerTitles.find(item => router.asPath.includes(item.path)).title : 'Dashboard';

    const toggleTheme = () => {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }
        else {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        }
    }

    const onLogout = async () => {
        const payload = {
            key: loginUser?.token || localStorage.getItem("token")
        }
        await createOrUpdate(payload, "POST", logoutApiPath);
        logout();
        router.push("/");
    }

    const handleClickCredits = () => {
        if (loginUser?.user_plan === "free") {
            router.push("/dashboard/settings?tab=billing");
            return;
        }
        else {
            router.push({
                pathname: router.pathname,
                query: {
                    ...router.query,
                    ["credits-recharge"]: "show"
                }
            });
            return;
        }
    };


    const headTitle = useMemo(() => {
        const match = headerTitles
            .filter(item => router.asPath.startsWith(item.path))
            .sort((a, b) => b.path.length - a.path.length)[0];

        return match?.title || "";
    }, [router.asPath]);



    return (
        <header
            id="header"
            className="sticky w-full z-10 bg-gray-200 border-b border-light-border-primary h-20 flex items-center justify-between px-4 lg:px-8"
        >
            <div className="inline-flex items-center justify-center">
                <Image
                    alt="Agentzee AI"
                    src="/agentzee-logo-black.png"
                    width={1024}
                    height={1024}
                    quality={100}
                    className="h-auto w-36 object-fill"
                />
            </div>

            <div className="flex items-center space-x-4">

                <button
                    onClick={handleClickCredits}
                    id="credits-button"
                    className="px-4 py-2 from-primary to-secondary bg-gradient-to-r hover:from-primary/90 hover:to-secondary/90 text-white text-sm font-medium rounded-full transition-colors flex items-center cursor-pointer"
                >
                    <FaCreditCard className="mr-2" />
                    {`Credits: ${(!loginUser?.credits || loginUser?.credits === "null") ? 0 : loginUser?.credits}`}
                </button>


                {/* <button
                    onClick={toggleTheme}
                    title="Toggle Theme"
                    className="p-2 rounded-full group relative"
                >
                    {isDarkMode ?
                        <FaMoon className="text-lg group-hover:opacity-80" /> :
                        <FaSun className="text-lg group-hover:opacity-80" />
                    }
                </button> */}

                <NotificationPopover>
                    gjvnjgbngnbnjgb
                </NotificationPopover>


                <LoggedInPopover
                    onLogout={() => { onLogout() }}
                />
            </div>

            {(router.query?.["credits-recharge"] === "success" ||
                router.query?.["credits-recharge"] === "failed" ||
                router.query?.["credits-recharge"] === "show") && (
                    <CreditsRecharge />
                )}
        </header>
    )
}
