"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { contentGeneratorsConfig } from "../constant/contentGenerators";

const MediaStateContext = createContext();

export const MediaStateProvider = ({ children }) => {
    const router = useRouter();
    const { index } = router.query

    const [mediaList, setMediaList] = useState([]);
    const [mediaData, setMediaData] = useState(null);
    const [selectedMediaId, setSelectedMediaId] = useState(null);
    const [showCreateSection, setShowCreateSection] = useState(true);


    const [loading, setLoading] = useState(true);

    const [numSlides, setNumSlides] = useState(4);
    const [chats, setChats] = useState([]);
    const [showChat, setShowChat] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [generatingPrompt, setGeneratingPrompt] = useState(false);


    // Prompt States
    const [prompt, setPrompt] = useState("");

    // Upload / Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("preview");
    const [modalImageUrl, setModalImageUrl] = useState(null);

    const [previewUploadData, setPreviewUploadData] = useState(null);
    const [isUploading, setIsUploading] = useState(false);


    const [resMessages, setResMessages] = useState({
        status: null,
        message: null,
    });

    const [createOptions, setCreateOptions] = useState({
        // UI Controls
        showDescription: true,
        showSlides: true,
        showPlatforms: true,

        // Text Labels
        title: "Select Platforms to Generate Video",
        subtitle: "Choose the platforms you want your video formatted for",

        // Placeholders (Dynamic)
        placeholders: {
            description: "Enter your video description...",
            slides: "Enter number of slides"
        },

        // Actual Form Values
        form: {
            description: "",
            slides: 4,
            platform: null
        }
    });


    


    useEffect(() => {
        // console.log("the index ",index?.[1] )
        setCreateOptions((prev) => ({
            ...prev,
            ...contentGeneratorsConfig[index?.[1]]
        }))


    }, [index])






    const clearAll = (type) => {
        if (type == 'all') {
            setMediaList([]);
        }
        setMediaData(null);
        setSelectedMediaId(null);
        setShowCreateSection(true);
        setShowChat(true)
        setCurrentStep(1)
        setGeneratingPrompt(false)
        setChats([])
        router.push({ pathname: router.pathname, query: {} }, undefined, { shallow: true });
    };

    return (
        <MediaStateContext.Provider value={{
            mediaList,
            setMediaList,
            mediaData,
            setMediaData,
            selectedMediaId,
            setSelectedMediaId,
            showCreateSection,
            setShowCreateSection,
            resMessages,
            setResMessages,

            numSlides,
            setNumSlides,
            chats,
            setChats,
            showChat,
            setShowChat,
            currentStep,
            setCurrentStep,
            generatingPrompt,
            setGeneratingPrompt,
            loading, setLoading,



            prompt, setPrompt,
            isModalOpen, setIsModalOpen,
            modalMode, setModalMode,
            modalImageUrl, setModalImageUrl,
            previewUploadData, setPreviewUploadData,
            isUploading, setIsUploading,

            createOptions, setCreateOptions,
            clearAll,
        }}>
            {children}
        </MediaStateContext.Provider>
    );
};

export const useMediaState = () => useContext(MediaStateContext);
