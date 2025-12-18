import clsx from "clsx";
import { FaCheckCircle, FaExclamationTriangle, FaYoutube, FaInstagram, FaTiktok, FaSpinner } from "react-icons/fa";
import { Fragment, useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCircleXmark } from "react-icons/fa6";
import { useMediaState } from "./context/MediaStateContext";
import { useRouter } from "next/router";
import { reelsScriptGeneratePath } from "./utils/apiPaths/reels";
import { useMediaHistory } from "./context/MediaHistoryContext";
import { createCarouselSlides } from "./utils/apiPaths/carousel";

const videoPlatforms = [
    {
        id: "youtube",
        name: "YouTube",
        description: "1920×1080 (16:9)",
        width: 1920,
        height: 1080,
        orientation: "Landscape",
        aspect_ratio: "16:9",
        icon: FaYoutube
    },
    {
        id: "instagram",
        name: "Instagram Reels",
        description: "1080×1920 (9:16)",
        width: 1080,
        height: 1920,
        orientation: "Portrait",
        aspect_ratio: "9:16",
        icon: FaInstagram
    },
    {
        id: "tiktok",
        name: "TikTok",
        description: "1080×1920 (9:16)",
        width: 1080,
        height: 1920,
        orientation: "Portrait",
        aspect_ratio: "9:16",
        icon: FaTiktok
    }
];


const mediaMap = {
    reels: reelsScriptGeneratePath,
    carousel: createCarouselSlides
};

export default function CreateSection() {

    const { resMessages, createOptions, generatingPrompt, setGeneratingPrompt } = useMediaState()

    const { generatePrompt } = useMediaHistory()
    const router = useRouter()
    const { index } = router.query
    const [slideInfo, setSlideInfo] = useState({
        description: "",
        slides: 4,
        platform: null
    });

    /* ---------------- HANDLERS ---------------- */
    const updateField = (key, value) => {
        setSlideInfo(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        const { index } = router.query
        let api, mediaType;
        const type = index?.[1];
        mediaType = type;
        api = mediaMap?.[type]
        let payload = {
            question: slideInfo.description,
        }

        if (createOptions.showSlides) {
            payload['num_slides'] = slideInfo.slides
        }
        if (createOptions.showPlatforms) {
            payload['platform'] = slideInfo.platform
        }

        await generatePrompt(payload, api, mediaType)
    };


    useEffect(() => {
        return () => setGeneratingPrompt(false);
    }, []);

    const isSubmitReady = (!createOptions.showDescription || slideInfo.description.trim()) && (!createOptions.showSlides || slideInfo.slides) && (!createOptions.showPlatforms || slideInfo.platform);

    return (
        <div className="flex-1 p-4 overflow-y-auto">

            <div className="text-center lg:my-12 my-8 max-w-lg mx-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-light-text-primary mb-4 whitespace-nowrap">
                    {createOptions.title}
                </h2>
                <p className="text-lg text-light-text-secondary">
                    {createOptions.subtitle}
                </p>
            </div>

            <div className="max-w-4xl mx-auto">

                {/* ---------------- DESCRIPTION ---------------- */}
                {createOptions.showDescription && (
                    <div className="mb-6 lg:mb-8">
                        <label className="block font-medium text-light-text-secondary mb-2">
                            {createOptions.descriptionLabel}
                        </label>

                        <textarea
                            value={slideInfo.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            rows={3}
                            placeholder={createOptions?.placeholders?.description ?? "Enter your description here..."}
                            className="w-full px-4 py-3 rounded-xl border bg-light-card-primary border-light-border-primary text-light-text-primary outline-none resize-none"
                        />
                    </div>
                )}

                {/* ---------------- SLIDE NUMBER (INPUT) ---------------- */}
                {createOptions.showSlides && (
                    <div className="mb-6 lg:mb-8">
                        <label className="block font-medium text-light-text-secondary mb-2">
                            Number of Slides
                        </label>

                        <input type="number" min={1} max={50}
                            value={slideInfo.slides}
                            onChange={(e) => updateField("slides", e.target.value)}
                            placeholder="Enter number of slides"
                            className="w-full px-4 py-3 rounded-xl border bg-light-card-primary border-light-border-primary text-light-text-primary outline-none"
                        />
                    </div>
                )}

                {/* ---------------- PLATFORM GRID ---------------- */}
                {createOptions.showPlatforms && (
                    <div className="grid xl:grid-cols-3 grid-cols-2 gap-6">
                        {videoPlatforms.map((item) => {
                            const Icon = item.icon;
                            const selected = slideInfo.platform?.id === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => updateField("platform", item)}
                                    className={clsx(
                                        "relative group shadow-card p-6 h-[240px] rounded-2xl text-center bg-gradient-to-r transition-all",
                                        selected
                                            ? "from-primary/60 to-secondary/60"
                                            : "hover:from-primary/50 hover:to-secondary/50"
                                    )}
                                >
                                    {selected && (
                                        <FaCheckCircle className="absolute top-4 right-4 text-white" />
                                    )}

                                    {/* ORIENTATION BADGE */}
                                    <span className="absolute top-4 left-4 text-xs px-2 py-1 rounded-full bg-black/30 text-white">
                                        {item.orientation}
                                    </span>

                                    <div
                                        className={clsx(
                                            "mx-auto mb-4 bg-gray-200/40 rounded-2xl flex items-center justify-center transition-all",
                                            item.orientation === "Portrait"
                                                ? "w-16 h-24"        // Tall shape
                                                : "w-24 h-16"        // Wide shape
                                        )}
                                    >
                                        <Icon
                                            className={clsx(
                                                "size-7 transition-all",
                                                selected ? "text-primary" : "text-light-text-secondary group-hover:text-primary"
                                            )}
                                        />
                                    </div>


                                    <h3
                                        className={clsx(
                                            "font-semibold mb-2",
                                            selected ? "text-white" : "group-hover:text-white text-light-text-primary"
                                        )}
                                    >
                                        {item.name}
                                    </h3>

                                    <p
                                        className={clsx(
                                            "text-sm",
                                            selected ? "text-gray-200" : "group-hover:text-gray-200 text-light-text-secondary"
                                        )}
                                    >
                                        {item.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                )}


                {/* ---------------- GENERATE BUTTON ---------------- */}
                {isSubmitReady && (
                    <div className="text-center mt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={resMessages.status === "loading"}
                            className="px-6 py-3 text-lg font-semibold text-white rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        >
                            {generatingPrompt ? (
                                <div className="flex gap-2 items-center justify-center">
                                    <FaSpinner className="animate-spin" />
                                    Generating Prompt...
                                </div>
                            ) : (
                                <Fragment>

                                    Generate Prompt
                                </Fragment>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
