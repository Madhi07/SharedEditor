"use client";

import { createContext, useContext, useState } from "react";

const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
    const [mediaList, setMediaList] = useState([]);
    const [showCreateSection, setShowCreateSection] = useState(true);
    const [formChatbotData, setFormChatbotData] = useState({
        chatbotId: "",
        type: "Create",
        name: "",
        platforms: [],
    });

    return (
        <MediaContext.Provider
            value={{
                mediaList,
                setMediaList,
                showCreateSection,
                setShowCreateSection,
                formChatbotData,
                setFormChatbotData,
            }}
        >
            {children}
        </MediaContext.Provider>
    );
};

export const useMediaContext = () => useContext(MediaContext);
