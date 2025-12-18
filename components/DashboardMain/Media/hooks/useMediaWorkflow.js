// hooks/useMediaWorkflow.js
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { createOrUpdate, retrieveOrRemove } from "../utils/apiFetchWrapper";
import { useMediaWorkflowContext } from "@/components/DashboardMain/Media/context";

let sampleMediaData = {
    "uuid": "cc0911ab-07d5-49b3-b6de-8e07bc78e19f",
    "prompt": "A polaroid portrait of a dog wearing sunglasses",
    "num_slides": 2,
    "status": "creating",
    "slides": [
        {
            "uuid": "8abd776b-9a09-494e-95e3-7f88bb06ef8a",
            "slide_number": 1,
            "subtitle": "Meet Our Star",
            "explain_text": "Check out this cool dog! He's got style with those sunglasses. Swipe to see more.",
            "image": {
                "uuid": "1c8af31f-4eb2-4c6b-bac2-25b956235442",
                "image_url": "",
                "image_prompt": "A polaroid photo of a dog wearing trendy sunglasses, looking cool and confident.",
                "asset_type": "ai_generated",
                "status": "creating"
            },
            "audio": {
                "uuid": "80889ce2-f4b3-4e15-8c34-67cdf1be1933",
                "audio_url": "",
                "audio_prompt": "Meet our star of the day, a dog who knows how to rock a pair of sunglasses. He's got style and he's ready to show it off, so make sure you swipe to see more.",
                "status": "creating"
            },
            "image_id": "1c8af31f-4eb2-4c6b-bac2-25b956235442",
            "audio_id": "80889ce2-f4b3-4e15-8c34-67cdf1be1933"
        },
        {
            "uuid": "f1799291-5471-4031-b102-af7f3c4b341a",
            "slide_number": 2,
            "subtitle": "Striking a Pose",
            "explain_text": "Look at that pose! This pup is a natural. Double-tap if you love it.",
            "image": {
                "uuid": "cdc7d1bf-6898-4f61-bd2f-e4d8f6205eb8",
                "image_url": "",
                "image_prompt": "The same dog striking a playful pose with sunglasses on, sitting proudly in the grass.",
                "asset_type": "ai_generated",
                "status": "creating"
            },
            "audio": {
                "uuid": "c82dc633-2277-4e27-b1aa-d6c18913a75f",
                "audio_url": "",
                "audio_prompt": "Look at that confident pose! This pup is a natural in front of the camera. Don't forget to double-tap if you love his style.",
                "status": "creating"
            },
            "image_id": "cdc7d1bf-6898-4f61-bd2f-e4d8f6205eb8",
            "audio_id": "c82dc633-2277-4e27-b1aa-d6c18913a75f"
        }
    ]
}

export default function useMediaWorkflow() {
    const {
        mediaData, setMediaData,
        prompt, setPrompt,
        numSlides, setNumSlides,
        chats, setChats,
        loading, setLoading,
        showChat, setShowChat,
        currentStep, setCurrentStep,
        generatingPrompt, setGeneratingPrompt,
        fetchMediaData, generatePrompt, clearAll, 
        getFetchMediaDataWithMediaId
    } = useMediaWorkflowContext()
    // const [mediaData, setMediaData] = useState(null);
    // const [prompt, setPrompt] = useState("");
    // const [numSlides, setNumSlides] = useState(3);
    // const [chats, setChats] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const router = useRouter();
    // const [showChat, setShowChat] = useState(true);
    // const [currentStep, setCurrentStep] = useState(1);


    // prompt generation and media loading effects state
    // const [generatingPrompt, setGeneratingPrompt] = useState(false);



    // Load existing media if query param `mediaId` exists
    // useEffect(() => {
    //     getFetchMediaDataWithMediaId(reelsPath)
    //     // const params = new URLSearchParams(window.location.search);
    //     // const mediaId = params.get("mediaId");
    //     // if (mediaId) {
    //     //     fetchMediaData(reelsPath, mediaId);
    //     // } else {
    //     //     setLoading(false);
    //     //     setMediaData(null); // empty initial state
    //     // }
    // }, []);

    // Fetch existing project
    // const fetchMediaData = async (mediaId) => {
    //     try {
    //         setLoading(true);
    //         const response = await retrieveOrRemove("GET", `${reelsPath}${mediaId}/`, true);
    //         console.log("Fetched media data:", response);
    //         if (response?.data) {
    //             setMediaData(response.data);
    //             setCurrentStep(1)
    //         }

    //     } catch (err) {
    //         console.error("Error fetching media:", err);
    //     } finally {
    //         setShowChat(true);
    //         setLoading(false);
    //     }
    // };

    // Generate new prompt via API
    // const generatePrompt = async () => {
    //     if (!prompt.trim()) return;
    //     setGeneratingPrompt(true);
    //     setChats((prev) => [
    //         ...prev,
    //         { question: prompt, answer: "Generating prompt...", created_at: new Date().toISOString() },
    //     ]);
    //     setPrompt("");
    //     try {

    //         const response = await createOrUpdate({ question: prompt, num_slides: numSlides }, "POST", reelsScriptGeneratePath, true,);

    //         if (response?.data) {

    //             // setMediaData(response.data);
    //             setChats((prev) => [
    //                 ...prev,
    //                 {
    //                     question: prompt,
    //                     answer: `✅ Prompts generated successfully for "${prompt}". You can now edit or proceed to generate assets.`,
    //                     created_at: new Date().toISOString(),
    //                 },
    //             ]);
    //             // setShowChat(false);
    //             setCurrentStep(1)
    //             fetchMediaData(response?.data.uuid)
    //             router.push(`/dashboard/media/reals?mediaId=${response?.data.uuid}`, undefined, { shallow: true });
    //         }
    //     } catch (err) {
    //         console.error("Prompt generation failed:", err);
    //         setChats((prev) => [
    //             ...prev,
    //             {
    //                 question: prompt,
    //                 answer: `❌ Failed to generate prompt. ${err.message}`,
    //                 created_at: new Date().toISOString(),
    //             },
    //         ]);
    //     } finally {
    //         setPrompt("");
    //         setGeneratingPrompt(false);
    //     }
    // };

    // clear all states
    // const clearAll = () => {
    //     setMediaData(null);
    //     setCurrentStep(1)
    //     setPrompt("");
    //     setNumSlides(4);
    //     setChats([]);
    //     setShowChat(true);
    //     router.push(`/dashboard/media/reals`, undefined, { shallow: true });
    // };


    const [generateVideoStatus, setGenerateVideoStatus] = useState(false);
    const [videoData, setVideoData] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerateVideo = async () => {
        if (!mediaData?.uuid) {
            alert("No media project found.");
            return;
        }

        setGenerateVideoStatus(true);
        setError(null);
        setVideoData(null);

        try {
            const response = await fetch("https://media-v2.episyche.com/media/generate-video/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uuid: mediaData.uuid }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate video");
            }

            const data = await response.json();
            setVideoData(data);
        } catch (err) {
            console.error("❌ Error generating video:", err);
            setError("Something went wrong while generating the video.");
        } finally {
            setGenerateVideoStatus(false);
        }
    };

    return {
        mediaData,
        setMediaData,
        prompt,
        setPrompt,
        numSlides,
        setNumSlides,
        chats,
        setChats,
        generatePrompt,
        loading,
        clearAll,
        fetchMediaData,
        // generateAll,
        generatingPrompt,
        generateVideoStatus,
        videoData,
        error,
        handleGenerateVideo,
        showChat, setShowChat,
        currentStep, setCurrentStep

    };
}
