import { useRouter } from "next/router"
import ChatsSection from "./ChatsSection";
import ManageSection from "./ManageSection";
import ChatbotsPanel from "./ChatbotsPanel";
import AnalyticsSection from "./Analytics";
import CreateSection from "./CreateSection";
import { useEffect, useState } from "react";

export default function ChatbotsSection() {
    const router = useRouter();

    const [showCreateSection, setShowCreateSection] = useState(true);

    const [formChatbotData, setFormChatbotData] = useState({
        chatbotId: "",
        type: "Create",
        name: "",
        platforms: []
    });

    useEffect(() => {
        initialRequirements();
    }, [])

    useEffect(() => {
        if (!router?.query?.id) {
            if (!showCreateSection) {
                setShowCreateSection(true);
                setFormChatbotData(prev => ({
                    ...prev,
                    chatbotId: "",
                    type: "Create",
                    name: "",
                    platforms: []
                }));
            }
        }
    }, [router.query]);


    const initialRequirements = () => {
        if (router?.query?.state) {
            // if (router?.query?.code) {
            router.push({
                pathname: router.pathname,
                query: {
                    id: router?.query?.state,
                    ...router?.query,
                }
            });
            // }
            setShowCreateSection(false);
        }
    }


    const secondPath = `/${router?.query?.index?.[1]}`;

    return (
        <div className="w-full h-full transition-all duration-300 overflow-hidden relative flex">

            <ChatbotsPanel
                setShowCreateSection={setShowCreateSection}
                setFormChatbotData={setFormChatbotData}
            />

            {showCreateSection ? (
                <CreateSection
                    setShowCreateSection={setShowCreateSection}
                    formChatbotData={formChatbotData}
                    setFormChatbotData={setFormChatbotData}
                />
            ) : (
                <div className="flex-1 overflow-hidden">
                    {(secondPath === "/analytics") && (
                        <AnalyticsSection />
                    )}
                    {(secondPath === "/conversations") && (
                        <ChatsSection />
                    )}
                    {(secondPath === "/manage") && (
                        <ManageSection />
                    )}
                </div>
            )
            }
        </div >
    )
}
