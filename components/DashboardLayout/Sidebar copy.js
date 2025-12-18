import clsx from "clsx";
import { sidebarBottomNavs, sidebarNavs } from "./constants";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaChartLine, FaChevronDown, FaTimes } from "react-icons/fa";
import { useAuthContext } from "@/context/useAuthContext";
import { AgentZeeHead } from "../SVG";

export default function Sidebar({ showSidebar, setShowSidebar }) {
    const router = useRouter();

    const { loginUser } = useAuthContext();

    console.log(router)

    return (
        <div
            id="sidebar"
            className={clsx("flex-col transition-all duration-300 ease-in-out dark:bg-dark-card-primary bg-light-card-primary border-r dark:border-dark-border-primary border-light-border-primary h-full group text-nowrap whitespace-nowrap",
                showSidebar ? "fixed z-20 inset-0 sm:w-72 w-full flex" : "hidden lg:flex w-64"
            )}

        >

            <div className={clsx("flex items-center h-16 border-b dark:border-dark-border-primary border-light-border-primary px-6",
                showSidebar ? "justify-between" : "justify-center"
            )}>
                <div className="flex items-center justify-center">
                    <AgentZeeHead className="text-primary size-8 mr-2" />
                    <span
                        className={clsx("font-semibold text-xl overflow-hidden")}
                    >
                        Agentzee AI
                    </span>
                </div>
                {showSidebar &&
                    <button
                        onClick={() => setShowSidebar(false)}
                        className="inline-flex items-center justify-center dark:text-dark-text-primary text-light-text-primary">
                        <FaTimes />
                    </button>
                }
            </div>

            <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
                <nav className="px-2 space-y-1">

                    {sidebarNavs.map((nav) => (
                        <div
                            key={nav.id}
                            id={nav.id}
                            className="space-y-1 transition-all duration-300"
                        >
                            <Link
                                // href={(nav.isSubscriptionRequired && loginUser?.user_plan !== "free") ? nav?.href : "/dashboard/billing"}
                                href={nav?.href}
                                onClick={() => setShowSidebar(false)}
                                className={clsx("w-full flex items-center justify-between px-2 py-3 text-sm font-[600] rounded-md",
                                    (router?.query?.index?.[0] === nav.id) ?
                                        'bg-primary/10 text-primary' :
                                        'hover:dark:bg-dark-border-primary hover:bg-light-border-primary'
                                )}
                            >
                                <div className="flex items-center">
                                    <nav.icon className="text-lg w-8 flex-shrink-0 mr-2" />
                                    <span className={"block"}>
                                        {nav.name}
                                    </span>
                                </div>

                                {nav.submenu.length > 0 && (
                                    <FaChevronDown
                                        className={clsx("mr-1.5 rotate-180")}
                                    />
                                )}
                            </Link>

                            {nav.submenu.map((submenu) => (
                                <Link
                                    href={submenu?.href}
                                    onClick={() => setShowSidebar(false)}
                                    className={clsx("ml-4 flex items-center p-2 text-sm font-[500] rounded-md",
                                        (router?.query?.index?.[1] === submenu.id) ?
                                            'bg-primary/10 text-primary' :
                                            'hover:dark:bg-dark-border-primary hover:bg-light-border-primary'
                                    )}
                                >
                                    <submenu.icon className="text-lg w-8 flex-shrink-0 mr-1.5" />
                                    <span className={"block"}>
                                        {submenu.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ))}

                </nav>
            </div>


            <div className="border-t dark:border-dark-border-primary border-light-border-primary py-4 px-2 space-y-1">
                {sidebarBottomNavs.map((nav) => (
                    <Link
                        key={nav.id}
                        href={nav.href}
                        onClick={() => setShowSidebar(false)}
                        className={clsx("flex items-center px-2 py-3 text-sm font-medium rounded-md cursor-pointer",
                            router?.query?.index?.includes(nav.id) ? "bg-primary/10 text-primary" : "hover:dark:bg-dark-border-primary hover:bg-light-border-primary"
                        )}
                    >
                        <nav.icon className="text-lg w-8 flex-shrink-0 mr-2" />
                        <span className={"block"}>
                            {nav.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
