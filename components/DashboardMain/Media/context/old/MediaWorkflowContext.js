"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";
import { createOrUpdate, retrieveOrRemove } from "@/components/DashboardMain/Media/utils/apiFetchWrapper";
import { reelsPath } from "@/components/DashboardMain/Media/utils/apiPaths/reels";
import { getPath } from "../Data";

const MediaWorkFlowContext = createContext();

export const MediaWorkFlowProvider = ({ children }) => {
    const router = useRouter();

    // workflow states
    const [mediaData, setMediaData] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [numSlides, setNumSlides] = useState(3);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [generatingPrompt, setGeneratingPrompt] = useState(false);

    // ---------------------------------------
    // FETCH MEDIA
    // ---------------------------------------
    const fetchMediaData = async (subcategory, param = null) => {
        try {
            // setLoading(true);
            const response = await retrieveOrRemove("GET", getPath(subcategory, param), true)
            if (response?.data) {
                setMediaData(response?.data?.data ?? response.data);
                // setCurrentStep(1);
            }
        } catch (err) {
            console.error("Error fetching media:", err);
        } finally {
            setShowChat(true);
            setLoading(false);
        }
    };

    // ---------------------------------------
    // GENERATE PROMPT
    // ---------------------------------------
    const generatePrompt = async (bodyData, path, mediaType) => {
        if (!prompt.trim()) return;

        setGeneratingPrompt(true);
        setChats((prev) => [
            ...prev,
            {
                question: prompt,
                answer: "Generating prompt...",
                created_at: new Date().toISOString(),
            },
        ]);

        const oldPrompt = prompt;
        setPrompt("");

        try {
            const response = await createOrUpdate(bodyData, "POST", path, true, mediaType);

            if (response?.data) {
                setChats((prev) => [
                    ...prev,
                    {
                        question: oldPrompt,
                        answer: `✅ Prompts generated successfully for "${oldPrompt}".`,
                        created_at: new Date().toISOString(),
                    },
                ]);

                setCurrentStep(1);

                const redirectId = mediaType === "blog" ? response.data.id : response.data.uuid;

                fetchMediaData(mediaType, redirectId);
                router.push(
                    `/dashboard/media/${mediaType}?mediaId=${redirectId}`,
                    undefined,
                    { shallow: true }
                );
            }
        } catch (err) {
            setChats((prev) => [
                ...prev,
                {
                    question: oldPrompt,
                    answer: `❌ Failed to generate prompt. ${err.message}`,
                    created_at: new Date().toISOString(),
                },
            ]);
        } finally {
            setGeneratingPrompt(false);
        }
    };

    // ---------------------------------------
    // CLEAR ALL
    // ---------------------------------------
    const clearAll = (mediaType) => {
        setMediaData(null);
        setCurrentStep(1);
        setPrompt("");
        setNumSlides(4);
        setChats([]);
        setShowChat(true);

        router.push(`/dashboard/media/${mediaType}`, undefined, { shallow: true });
    };

    const getFetchMediaDataWithMediaId = async (subcategory) => {
        const params = new URLSearchParams(window.location.search);
        const mediaId = params.get("mediaId");

        if (mediaId) {
            await fetchMediaData(subcategory, mediaId);
        } else {
            setLoading(false);
            setMediaData(null);
        }
    };

    return (
        <MediaWorkFlowContext.Provider
            value={{
                mediaData,
                setMediaData,
                prompt,
                setPrompt,
                numSlides,
                setNumSlides,
                chats,
                setChats,
                loading,
                setLoading,
                showChat,
                setShowChat,
                currentStep,
                setCurrentStep,
                generatingPrompt,
                setGeneratingPrompt,
                fetchMediaData,
                generatePrompt,
                clearAll,
                getFetchMediaDataWithMediaId,
            }}
        >
            {children}
        </MediaWorkFlowContext.Provider>
    );
};

export const useMediaWorkflowContext = () => useContext(MediaWorkFlowContext);