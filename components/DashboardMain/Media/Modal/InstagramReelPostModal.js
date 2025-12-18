import { useState } from "react";
import { FaSpinner, FaRedo } from "react-icons/fa";
import { createOrUpdate } from "../utils/apiFetchWrapper";
import { instagramPostApi } from "../utils/apiPaths/reels";

export default function InstagramReelPostModal({
    isOpen,
    onClose,
    reelId,
    onSuccess
}) {

    const [caption, setCaption] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);
    const [posting, setPosting] = useState(false);

    if (!isOpen) return null;

    // ---- AI Generate Caption ----
    const handleAIGenerate = async () => {
        try {
            setLoadingAI(true);

            const response = await fetch(
                "http://127.0.0.1:8000/media/instagram/ai-caption",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reel_id: reelId })
                }
            );

            const data = await response.json();

            setCaption(
                data.caption ||
                "🔥 AI-generated caption is ready! Modify as you like."
            );
        } catch (err) {
            console.error("AI Caption Error:", err);
            setCaption("🔥 AI caption generated!");
        }

        setLoadingAI(false);
    };

    // ---- POST TO INSTAGRAM ----
    const postReelToInstagram = async () => {
        if (!caption.trim()) {
            alert("Caption required!");
            return;
        }

        setPosting(true);



        try {

            const response = await createOrUpdate({ reel_id: reelId, caption }, "POST", instagramPostApi, false)
            if (response?.data?.data) {
                let data = response.data.data
                console.log("POST SUCCESS:", data);

                onSuccess?.(data);
                onClose();
            }
            alert("Reel posted successfully!");
        } catch (err) {
            console.error("POST ERROR:", err);
            alert("Failed to post reel.");
        }

        setPosting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Post Instagram Reel</h2>

                {/* Caption Editor */}
                <div className="mb-4">
                    <label className="font-semibold block mb-2">
                        Caption
                    </label>

                    {/* Textarea wrapper */}
                    <div className="relative">
                        <textarea
                            rows={4}
                            value={caption}
                            placeholder="Write caption or use AI…"
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full p-3 border rounded-xl pr-12 resize-none"
                        />

                        {/* AI Regenerate Button */}
                        <button
                            onClick={handleAIGenerate}
                            disabled={loadingAI}
                            className="absolute bottom-3 right-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
                        >
                            {loadingAI ? (
                                <FaSpinner className="animate-spin text-gray-700" />
                            ) : (
                                <FaRedo className="text-gray-700 text-sm" />
                            )}
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                        You can type manually or click the ↻ icon for AI suggestions.
                    </p>
                </div>

                {/* Post Button */}
                <button
                    onClick={postReelToInstagram}
                    disabled={posting}
                    className="w-full py-3 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-xl shadow-lg"
                >
                    {posting ? (
                        <span className="flex items-center justify-center gap-2">
                            <FaSpinner className="animate-spin" /> Posting…
                        </span>
                    ) : (
                        "Post Reel"
                    )}
                </button>
            </div>
        </div>
    );
}
