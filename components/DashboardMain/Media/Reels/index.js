import React, { Fragment, useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { stepBadgeClass } from "../utils/helpers";
import Step1PromptSetup from "./sections/Step1PromptSetup";
import Step2GenerateAssets from "./sections/Step2GenerateAssets";
import Step3ComposeVideo from "./sections/Step3ComposeVideo";
import { LuLoaderCircle } from "react-icons/lu";
import MediaHistoryPanel from "../MediaHistoryPanel";
import { createOrUpdate, retrieveOrRemove } from "../utils/apiFetchWrapper";
import { mediaGenerateVideo, reelsAssetGeneratePath, reelsAudioPromptRegeneratePath, reelsAudioRegeneratePath, reelsImagePromptRegeneratePath, reelsImageRegeneratePath, reelsPath, reelsScriptGeneratePath, reelsSlidesUpdate } from "../utils/apiPaths/reels";
import { useMediaHistory } from "../context/MediaHistoryContext";
import { useMediaState } from "../context/MediaStateContext";
import { registerTimer } from "../utils/timerManager";
import CreateSection from "../CreateVideoSection";
import { useRouter } from "next/router";
import { getStepFromStatus } from "../utils/statusToStep";


export default function MediaGenerator() {

    const router = useRouter()
    const { step } = router.query

    const { mediaData,
        setMediaData,
        numSlides,
        chats,
        showChat,
        setShowChat,
        currentStep,
        setCurrentStep,
        generatingPrompt,
        prompt, setPrompt, loading
    } = useMediaState()


    const { fetchMedia, getFetchMediaDataWithMediaId, generatePrompt } = useMediaHistory()
    // Local UI & editing states
    const [editingUuid, setEditingUuid] = useState(null);
    const [tempPrompts, setTempPrompts] = useState({});
    const [loadingPrompt, setLoadingPrompt] = useState({});
    const [loadingImage, setLoadingImage] = useState({});
    const [loadingAudio, setLoadingAudio] = useState({});
    const [batchGenerating, setBatchGenerating] = useState(false);
    const [combining, setCombining] = useState(false);
    const [order, setOrder] = useState([]);
    const [selectedSlides, setSelectedSlides] = useState([]);

    // Derived state for step completion
    const isStep1Complete = mediaData?.slides?.every((s) => s.image.image_prompt !== "" && s.audio.audio_prompt !== "");
    const isStep2Complete = mediaData?.slides?.every((s) => s.image.image_url !== "" && s.audio.audio_url !== "");

    //video generation data 
    const [generateVideoStatus, setGenerateVideoStatus] = useState(false);


    /**
     * Sync slide order and selected slides whenever mediaData updates.
     * - Keeps only existing slide IDs.
     * - Auto-selects all slides if no selection remains.
     */
    useEffect(() => {
        if (!mediaData?.slides) return;
        const uuids = mediaData.slides.map((s) => s.id);
        setOrder((prev) => [...prev.filter((id) => uuids.includes(id)), ...prev.filter((id) => !prev.includes(id))]);
        setSelectedSlides((prev) => {
            const next = prev.filter((id) => uuids.includes(id));
            return next.length > 0 ? next : uuids;
        });
    }, [mediaData]);

    /** Load media data on mount if a `mediaId` exists in the URL. */
    useEffect(() => {
        getFetchMediaDataWithMediaId("reels")
    }, []);


    /**
     * Starts editing a specific slide.
     * @param {string} uuid - The UUID of the slide to edit.
     *
     * Finds the slide, sets up its temp data, and marks it as the one being edited.
     */
    const startEdit = (uuid) => {
        const slide = mediaData.slides.find((s) => s.id === uuid);
        setTempPrompts((p) => ({ ...p, [uuid]: {} }));
        // setTempPrompts((p) => ({ ...p, [uuid]: { image_prompt: slide.image_prompt, audio_prompt: slide.audio_prompt } }));
        setEditingUuid(uuid);
    };

    /**
     * Saves edits for a slide and updates it locally and on the server.
     * @param {string} uuid - The UUID of the slide being saved.
     *
     * Applies temp changes, sends a PATCH request, and resets edit state.
     */
    const saveEdit = async (uuid) => {
        const tmp = tempPrompts[uuid];
        if (!tmp) return setEditingUuid(null);

        const slide = mediaData.slides.find((s) => s.id === uuid);
        if (!slide) return;


        setMediaData((prev) => ({ ...prev, slides: prev.slides.map((s) => s.id === uuid ? { ...s, ...tmp } : s), }));
        setEditingUuid(null);

        // --- API update ---
        try {
            let payload = {}
            let updateId = {}
            if (tmp.image_prompt) {
                updateId[slide.image_id] = "Updating the image prompt...."
                payload['image'] = {
                    image_prompt: tmp.image_prompt || slide.image_prompt
                }
            }
            if (tmp.audio_prompt) {
                updateId[slide.audio_id] = "Updating the audio prompt...."
                payload['audio'] = {
                    audio_prompt: tmp.audio_prompt || slide.audio_prompt,
                }
            }
            setLoadingPrompt((l) => ({ ...l, ...updateId }));


            const response = await createOrUpdate(payload, "PATCH", `${reelsSlidesUpdate}${uuid}/`, false)
            if (response?.data && Object.keys(response.data)) {

                if (response?.data) {
                    setMediaData((prev) => ({
                        ...prev,
                        slides: prev.slides.map(s => s.id === uuid ? {
                            ...s,
                            ...response.data
                        } : s),
                    }));
                }
            }
        } catch (error) {
            console.error("Error updating slide:", error);
            alert("Failed to update the slide on the server. Please try again.");
        } finally {
            // getFetchMediaDataWithMediaId('reels')
            setTempPrompts({})
            setEditingUuid(null)
            setLoadingPrompt((l) => ({ ...l, [slide.image_id]: false, [slide.audio_id]: false, }));
        }
    };

    /**
     * Regenerates the image prompt for a slide and updates its data.
     * @param {string} uuid - The image UUID to regenerate.
    */
    const regenerateImagePrompt = async (uuid) => {
        try {
            setLoadingPrompt((l) => ({ ...l, [uuid]: "Regenerate the image prompt...." }));
            const response = await createOrUpdate({ image_id: uuid }, "POST", reelsImagePromptRegeneratePath.replace("{id}", uuid), true,);
            // getFetchMediaDataWithMediaId('reels')
            if (response?.data?.data) {
                setMediaData(prev => ({
                    ...prev,
                    slides: prev.slides.map(s => s.image_id === uuid ? {
                        ...s,
                        image: {
                            ...s.image,
                            image_prompt: response.data.data.new_prompt
                        },
                    } : s
                    ),
                }));
            }

        } catch (error) {
            console.error("Failed to regenerate prompt:", error);
            // Handle error UI here (e.g., show a toast notification)
        } finally {
            setLoadingPrompt((l) => ({ ...l, [uuid]: false }));
        }
    };

    /**
     * Regenerates the audio prompt for a slide and updates its data.
     * @param {string} uuid - The audio UUID to regenerate.
     */
    const regenerateAudioPrompt = async (uuid) => {
        try {
            setLoadingPrompt((l) => ({ ...l, [uuid]: "Regenerate the audio prompt...." }));
            const response = await createOrUpdate({ audio_id: uuid }, "POST", reelsAudioPromptRegeneratePath, true,);
            if (response?.data?.data) {
                setMediaData((prev) => ({
                    ...prev,
                    slides: prev.slides.map((s) => s.audio.id === uuid ? {
                        ...s,
                        audio: {
                            ...s.audio,
                            audio_prompt: response.data.data.audio_prompt
                        }
                    } : s
                    ),
                }));
            }

        } catch (error) {
            console.error("Failed to regenerate prompt:", error);
            // Handle error UI here (e.g., show a toast notification)
        } finally {
            setLoadingPrompt((l) => ({ ...l, [uuid]: false }));
            // getFetchMediaDataWithMediaId('reels')
            // setRegeneratingId(null);
        }
        setMediaData((prev) => ({
            ...prev,
            slides: prev.slides.map((s) =>
                s.id === uuid ? { ...s, audio_prompt: s.audio_prompt + " (refined)" } : s
            ),
        }));
    }

    // --- Asset Generation (Image) ---
    const generateImage = async (uuid) => {
        const slide = mediaData.slides.find((s) => s.image_id === uuid);
        if (!slide) {
            alert("Slide not found for image generation.");
            return;
        }

        // Start loading indicator
        setLoadingImage((l) => ({ ...l, [slide.id]: true }));

        try {

            const response = await createOrUpdate({ image_id: uuid }, "POST", reelsImageRegeneratePath, false)

            if (response.data.data) {
                // 🔹 Update mediaData with new image
                setMediaData((prev) => ({
                    ...prev,
                    slides: prev.slides.map((s) =>
                        s.image_id === uuid
                            ? {
                                ...s,
                                "image": {
                                    ...s.image,
                                    image_url: response.data.data.image_url,
                                    asset_type: 'ai_generated'
                                },
                            }
                            : s
                    ),
                }));

                console.log("✅ Image generated:", response.data.data);
            }
        } catch (error) {
            console.error(" Image generation failed:", error);
            alert("Image generation failed. Please try again later.");
        } finally {
            fetchMedia("reels", mediaData.id)
            setLoadingImage((l) => ({ ...l, [slide.id]: false }));
        }
    };


    // --- Asset Generation (Audio) ---
    const generateAudio = async (uuid) => {
        const slide = mediaData.slides.find((s) => s.id === uuid);
        if (!slide) {
            alert("Slide not found for audio generation.");
            return;
        }

        // Start loading state for this slide
        setLoadingAudio((l) => ({ ...l, [slide.id]: true }));

        try {
            const response = await createOrUpdate({ audio_id: slide.audio_id }, "POST", reelsAudioRegeneratePath, false)

            if (response.data.data) {
                setMediaData((prev) => ({
                    ...prev,
                    slides: prev.slides.map((s) =>
                        s.audio_id === uuid
                            ? {
                                ...s,
                                "audio": {
                                    ...s.audio,
                                    audio_url: response.data.data.audio_url,
                                }
                            }
                            : s
                    ),
                }));
                console.log("✅ Audio generated:", response.data.data);
            }

        } catch (error) {
            console.error("❌ Audio generation failed:", error);
            alert("Audio generation failed. Please try again.");
        } finally {
            // Stop loading spinner
            fetchMedia("reels", mediaData.id)
            setLoadingAudio((l) => ({ ...l, [slide.id]: false }));
        }
    };
    // setGenerateVideoStatus(false);
    const handleGenerateVideo = async () => {
        console.log("mediaData", mediaData)
        if (!mediaData?.id) {
            alert("No media project found.");
            return;
        }

        setGenerateVideoStatus(true);


        let response;
        try {
            response = await createOrUpdate({ id: mediaData.id }, "POST", mediaGenerateVideo, false)

        } catch (err) {
            console.error("❌ Error generating video:", err);
        } finally {
            // getFetchMediaDataWithMediaId('reels')
            let intervalRef = null;
            const fetchVideoInfo = async () => {
                const res = await fetchMedia('reels', mediaData.id);

                if (intervalRef) clearTimeout(intervalRef);
                intervalRef = setTimeout(() => {
                    if (res?.status === "video_generation_completed" || res?.status === "video_generation_failed") {
                        setGenerateVideoStatus(false);
                    } else {
                        fetchVideoInfo();
                    }
                }, 2000);

                registerTimer(intervalRef);
            };
            if (response?.data?.data.status === 'video_generation_started') {
                fetchVideoInfo()
            }

            // setGenerateVideoStatus(false);
        }
    };


    const clearAssetLoading = () => {
        setLoadingImage({})
        setLoadingAudio({})
    }

    const generateAllAssets = async () => {
        if (!mediaData?.id) {
            alert("No media project found.");
            return;
        }
        const slideMap = mediaData.slides.reduce((acc, slide) => {
            acc[slide.id] = true;
            return acc;
        }, {});
        setLoadingAudio((l) => ({ ...l, ...slideMap }));
        setLoadingImage((l) => ({ ...l, ...slideMap }));
        setBatchGenerating(true);
        setBatchGenerating(false);

        try {
            // 1️⃣ Trigger asset generation (background job)
            const startResponse = await createOrUpdate({ id: mediaData.id }, "POST", reelsAssetGeneratePath, false)

            // 2️⃣ Start polling sequentially (no overlaps)
            const startTime = Date.now();
            const MAX_POLL_TIME = 120000; // 2 minutes

            const pollStatus = async () => {
                if (Date.now() - startTime > MAX_POLL_TIME) {
                    setBatchGenerating(false);
                    return;
                }

                try {
                    const response = await retrieveOrRemove("GET", `${reelsPath}${mediaData.id}/`, false);

                    if (response?.data?.data?.status === "asset_generation_completed") {
                        // fetchMedia('reels');
                        clearAssetLoading()
                        setMediaData(response.data.data);
                        setBatchGenerating(false);
                        fetchMedia("reels", mediaData.id);
                        return;
                    }

                    if (response?.data?.data?.status === "asset_generation_failed") {
                        alert("Failed");
                        clearAssetLoading()
                        setBatchGenerating(false);
                        fetchMedia("reels", mediaData.id);
                        return;
                    }

                    let timer = setTimeout(pollStatus, 2000);
                    registerTimer(timer);

                } catch (err) {
                    setBatchGenerating(false);
                }
            };


            // 🔹 Run the first poll immediately
            fetchMedia("reels", mediaData.id)
            await pollStatus();
        } catch (error) {
            console.error("❌ Asset generation error:", error);
            alert("Failed to start asset generation.");
            setBatchGenerating(false);
        } finally {
            fetchMedia("reels", mediaData.id)
        }
    };


    // --- Video Composition ---
    const combineVideo = async () => {
        if (selectedSlides.length === 0) return alert("Select at least one slide to combine.");

        const unready = mediaData.slides.filter(
            (s) => selectedSlides.includes(s.id) && (!s.image || !s.audio)
        );
        if (unready.length > 0)
            return alert(`❌ Cannot combine.`);

        setCombining(true);

        let timer = setTimeout(() => {
            setCombining(false);
            alert(`✅ Combined successfully`);
            setMediaData((prev) => ({ ...prev, status: "video_ready" }));
        }, 1800);

        registerTimer(timer);
    };

    // --- Helpers ---
    const handleDurationChange = (uuid, value) =>
        setMediaData((prev) => ({
            ...prev,
            slides: prev.slides.map((slide) =>
                slide.id === uuid ? { ...slide, duration: Number(value) } : slide
            ),
        }));

    const openStockImagePicker = (uuid) => alert(`Open stock image picker for slide: ${uuid}`);
    const handleImageUpload = (uuid, file) => alert(`Image uploaded for ${uuid}: ${file.name}`);

    // --- Ordering & Selection ---
    const moveOrder = (uuid, direction) => {
        const index = order.indexOf(uuid);
        if (index === -1) return;
        const newOrder = [...order];
        if (direction === "up" && index > 0) {
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        } else if (direction === "down" && index < newOrder.length - 1) {
            [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
        }
        setOrder(newOrder);
    };

    const toggleSelect = (uuid) =>
        setSelectedSlides((prev) =>
            prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
        );


    // useEffect(() => {
    //     if (!mediaData?.status) return;

    //     const nextStep = getStepFromStatus(mediaData.status);

    //     if (nextStep === "error") {
    //         alert("Something went wrong!");
    //         return;
    //     }

    //     if (currentStep !== nextStep) {
    //         setCurrentStep(nextStep);
    //     }
    // }, [mediaData?.status]);

    const isStepClickable = (n) => {
        if (n === 1) return true; // Always clickable
        if (n === 2) return isStep1Complete; // Step 2 only if Step 1 done
        if (n === 3) return isStep1Complete && isStep2Complete; // Strict requirement
        return false;
    };

    useEffect(() => { }, [])

    return (

        <Fragment>
            <div className="w-full h-full transition-all duration-300 overflow-hidden relative flex ">
                <MediaHistoryPanel />
                {showChat ? (
                    <Fragment>
                        <CreateSection />
                    </Fragment>) : (
                    <div className={`${showChat ? "p-4 flex gap-2 w-full" : "p-4 w-[calc(100%-280px)] max-w-[calc(100%-240px)] lg:w-[calc(100%-280px)]"} h-full flex transition-all duration-300`}>
                        {/* --- Left Side: Main Workflow --- */}
                        {(loading || mediaData?.slides?.length === 0) ? (
                            <div className="flex items-center justify-center h-[400px] w-full">
                                <div className="text-center text-gray-500">
                                    <LuLoaderCircle className="animate-spin  text-pink-500  drop-shadow-[0_0_10px_rgba(255,58,140,0.6)] text-4xl mx-auto mb-4" />
                                    Loading media project...
                                </div>
                            </div>
                        ) : (
                            <Fragment>
                                <div className={` ${showChat ? " w-[75%] " : " w-full "}  border border-gray-200 max-h-[calc(100vh-120px)] h-full min-h-[calc(100vh-100px)] overflow-x-hidden bg-white rounded-lg shadow`}>
                                    {/* --- Top Bar --- */}


                                    {/* --- Step Navigation --- */}
                                    {(currentStep !== 3) && (
                                        <Fragment>
                                            {Object.keys(mediaData || {}).length !== 0 && (
                                                <div className="w-[inherit] p-6 border-b border-gray-100 flex items-center gap-6">
                                                    {[1, 2, 3].map((n) => {
                                                        const clickable = isStepClickable(n);
                                                        console.log("------------------->mediaData", n, isStep1Complete, clickable)

                                                        return (
                                                            <div
                                                                key={n}
                                                                className={`px-4 py-2 rounded-xl transition duration-300 ease-in-out ${stepBadgeClass(
                                                                    n,
                                                                    currentStep,
                                                                    isStep1Complete,
                                                                    isStep2Complete,
                                                                    mediaData?.status
                                                                )} cursor-pointer`}
                                                                onClick={() => {
                                                                    if (!clickable) return;
                                                                    if (n === 1 || (n === 2 && isStep1Complete)) {
                                                                        setCurrentStep(n);
                                                                    } else {
                                                                        setCurrentStep(n)
                                                                        setShowChat(false);
                                                                    }
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2 whitespace-nowrap">
                                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm border border-current">
                                                                        {n}
                                                                    </div>
                                                                    <div className="text-sm font-semibold">
                                                                        {n === 1
                                                                            ? "Prompt Setup"
                                                                            : n === 2
                                                                                ? "Generate Assets"
                                                                                : "Compose Video"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    {currentStep !== 1 && (
                                                        <button
                                                            onClick={() => setCurrentStep(currentStep - 1)}
                                                            className="px-4 py-2 bg-gray-100 border rounded-xl text-gray-700 hover:bg-gray-200 transition flex flex-nowrap whitespace-nowrap items-center justify-center gap-2">
                                                            <FaArrowLeft className="inline mr-1" /> Back to Prompts
                                                        </button>
                                                    )}
                                                    {/* <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                                                    <FaRegClock /> {formatTime(new Date())}
                                                </div> */}
                                                </div>
                                            )}
                                        </Fragment>
                                    )}

                                    {/* --- Step Content --- */}
                                    {generatingPrompt ? (
                                        <div className="flex items-center justify-center h-[400px] w-full">
                                            <div className="text-center text-gray-500">
                                                <LuLoaderCircle className="animate-spin  text-pink-500  drop-shadow-[0_0_10px_rgba(255,58,140,0.6)] text-4xl mx-auto mb-4" />
                                                Generating prompt...
                                            </div>
                                        </div>
                                    ) : (

                                        <Fragment>
                                            <div className="p-6 space-y-6 h-full ">
                                                {currentStep === 1 && (
                                                    <Step1PromptSetup
                                                        mediaData={mediaData}
                                                        editingUuid={editingUuid}
                                                        tempPrompts={tempPrompts}
                                                        startEdit={startEdit}
                                                        saveEdit={saveEdit}
                                                        setEditingUuid={setEditingUuid}
                                                        setTempPrompts={setTempPrompts}
                                                        regenerateImagePrompt={regenerateImagePrompt}
                                                        regenerateAudioPrompt={regenerateAudioPrompt}
                                                        setCurrentStep={setCurrentStep}
                                                        loadingPrompt={loadingPrompt}
                                                        setLoadingPrompt={setLoadingPrompt}
                                                        generateAllAssets={generateAllAssets}
                                                    />
                                                )}

                                                {currentStep === 2 && (
                                                    <Step2GenerateAssets
                                                        setShowChat={setShowChat}
                                                        mediaData={mediaData}
                                                        loadingImage={loadingImage}
                                                        loadingAudio={loadingAudio}
                                                        batchGenerating={batchGenerating}
                                                        setCurrentStep={setCurrentStep}
                                                        generateAllAssets={generateAllAssets}
                                                        generateImage={generateImage}
                                                        generateAudio={generateAudio}
                                                        handleDurationChange={handleDurationChange}
                                                        openStockImagePicker={openStockImagePicker}
                                                        handleImageUpload={handleImageUpload}
                                                        setMediaData={setMediaData}
                                                        clearAssetLoading={clearAssetLoading}
                                                    />
                                                )}
                                                {currentStep === 3 && (
                                                    <div className="mb-4 w-full">

                                                        <Step3ComposeVideo
                                                            mediaData={mediaData}
                                                            order={order}
                                                            selectedSlides={selectedSlides}
                                                            combining={combining}
                                                            setCurrentStep={setCurrentStep}
                                                            combineVideo={combineVideo}
                                                            moveOrder={moveOrder}
                                                            toggleSelect={toggleSelect}
                                                            generateVideoStatus={generateVideoStatus}
                                                            setGenerateVideoStatus={setGenerateVideoStatus}
                                                            handleGenerateVideo={handleGenerateVideo}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </Fragment>
                                    )}
                                </div>


                            </Fragment>
                        )}
                    </div>)}
            </div>
        </Fragment>
    );
}
