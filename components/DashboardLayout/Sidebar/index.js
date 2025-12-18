import clsx from "clsx";
import { useRouter } from "next/router";
import Link from "next/link";
import { mainLeftNavs } from "../constants";
import SubmenuTootip from "./SubmenuTooltip";
import { useState } from "react";

export default function Sidebar({ showSidebar, setShowSidebar }) {
    const router = useRouter();

    const [tooltipData, setTooltipData] = useState({
        id: null,
        data: []
    })

    const handleMouseEnterMenu = (id = null, data = []) => {
        if (!id || data.length === 0) return;

        setTooltipData(prev => ({
            ...prev,
            id,
            data
        }))
    }

    const handleTooltipMouseLeave = () => {
        setTooltipData(prev => ({
            ...prev,
            id: null,
            data: []
        }))
    }


    return (
        <div className="h-full px-4 py-8 flex flex-col overflow-hidden bg-gray-200 shadow-sm w-24 border-r border-light-border-primary">
            <div className="space-y-6 w-full relative">
                {mainLeftNavs.map((nav, navIndex) => (
                    <Link
                        href={nav.href}
                        onMouseEnter={() => handleMouseEnterMenu(nav.id, nav.submenu)}
                        onClick={() => router.push(nav.href)}
                        key={navIndex}
                        data-tooltip-id={`submenu-tooltip-${nav.id}`}
                        className="flex flex-col items-center justify-center group cursor-pointer"
                    >
                        <span
                            className={clsx("py-1 px-4 rounded-full inline-flex items-center justify-center bg-gradient-to-r",
                                (router.query?.index?.[0] === nav.id) ? "from-primary to-secondary" : "group-hover:from-primary/80 group-hover:to-secondary/80"
                            )}
                        >
                            <nav.icon
                                className={clsx("mb-1 size-6 flex-shrink-0",
                                    (router.query?.index?.[0] === nav.id) ? "text-white" : "group-hover:text-white"
                                )}
                            />
                        </span>
                        <span
                            className={clsx("block text-sm",
                                (router.query?.index?.[0] === nav.id) ? "text-primary font-[500]" : "group-hover:text-primary group-hover:font-[500]"
                            )}
                        >
                            {nav.name}
                        </span>

                    </Link>
                ))}


            </div>

            {tooltipData.data.length > 0 && (
                <SubmenuTootip
                    onMouseLeave={handleTooltipMouseLeave}
                    id={`submenu-tooltip-${tooltipData.id}`}
                    data={tooltipData.data}
                />
            )}
        </div>
    )
}

