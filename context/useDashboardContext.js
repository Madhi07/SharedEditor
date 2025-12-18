import { createContext, useContext, useState } from "react";

// Create Context
const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {

    const [sitemapProcessingData, setSitemapProcessingData] = useState({});
    const [descriptionTemplates, setDescriptionTemplates] = useState([]);
    const [chatbotAvatars, setChatbotAvatars] = useState([]);
    const [chatpanelImages, setChatpanelImages] = useState([]);
    const [chatpanelVideos, setChatpanelVideos] = useState([]);
    const [chatSessions, setChatSessions] = useState([]);
    const [chatConversations, setChatConversations] = useState({});
    const [chatbots, setChatbots] = useState([]);
    const [chatbotCustomizationData, setChatbotCustomizationData] = useState({});
    const [chatbotConfigurations, setChatbotConfigurations] = useState({});
    const [chatbotStepper, setChatbotStepper] = useState([]);
    const [agentChatSessions, setAgentChatSessions] = useState([]);
    const [agentChatData, setAgentChatData] = useState([]);
    const [chatbotSitemapProcessingStatus, setChatbotSitemapProcessingStatus] = useState({});
    const [agentIntegrations, setAgentIntegrations] = useState([]);
    const [chatbotDashboardData, setChatbotDashboardData] = useState({});
    const [chatbotFacebookPages, setChatbotFacebookPages] = useState([]);
    const [chatbotInstagramPages, setChatbotInstagramPages] = useState([]);


    return (
        <DashboardContext.Provider value={{
            sitemapProcessingData,
            setSitemapProcessingData,
            chatbotAvatars,
            setChatbotAvatars,
            descriptionTemplates,
            setDescriptionTemplates,
            chatpanelImages,
            setChatpanelImages,
            chatpanelVideos,
            setChatpanelVideos,
            chatSessions,
            setChatSessions,
            chatConversations,
            setChatConversations,
            chatbots,
            setChatbots,
            chatbotCustomizationData,
            setChatbotCustomizationData,
            chatbotConfigurations,
            setChatbotConfigurations,
            chatbotStepper,
            setChatbotStepper,
            agentChatData,
            setAgentChatData,
            chatbotSitemapProcessingStatus,
            setChatbotSitemapProcessingStatus,
            agentChatSessions,
            setAgentChatSessions,
            agentIntegrations,
            setAgentIntegrations,
            chatbotDashboardData,
            setChatbotDashboardData,
            chatbotFacebookPages,
            setChatbotFacebookPages,
            chatbotInstagramPages,
            setChatbotInstagramPages
        }}>
            {children}
        </DashboardContext.Provider>
    );
}


// Custom hook for using auth context
export const useDashboardContext = () => useContext(DashboardContext);