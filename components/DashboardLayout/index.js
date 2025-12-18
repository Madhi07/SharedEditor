import { useMemo, useState } from "react";
import Header from "./Header";
import AuthGuard from "./AuthGuard";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import SubmenuPanel from "./SubmenuPanel";
import { mainLeftNavs } from "./constants";

export default function DashboardLayout({ children }) {
    const [showSidebar, setShowSidebar] = useState(false);

    const router = useRouter();

    const currentSubmenuData = useMemo(() => {
        return mainLeftNavs.find(item => item.id === router?.query?.index?.[0])?.submenu || []
    }, [router?.query]);

    return (
        <div className="flex flex-col w-screen h-screen overflow-hidden dark:bg-dark-bg-primary bg-light-bg-primary dark:text-dark-text-primary text-light-text-primary">
            <AuthGuard>
                <Header
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />
                <div className="flex-1 flex overflow-hidden relative">
                    <Sidebar />
                    {currentSubmenuData.length > 0 && (
                        <SubmenuPanel
                            data={currentSubmenuData}
                        />
                    )}
                    <div className="overflow-hidden flex-1">
                        {children}
                    </div>
                </div>
            </AuthGuard>
        </div>
    )
}
