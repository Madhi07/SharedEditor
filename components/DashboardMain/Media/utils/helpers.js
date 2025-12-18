// utils/helpers.js
import { FaCheck } from "react-icons/fa";

export const formatTime = (d) =>
    `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"
    }`;

export const stepBadgeClass = (n, currentStep, isStep1Complete, isStep2Complete, status) => {
    const isCompleted = (n <= currentStep && isStep1Complete) || (n  <= currentStep && isStep2Complete) || (n  <= currentStep && status === "video_ready");
    const isActive = n === currentStep;

    if (isActive) {
        return "bg-white text-gray-900 shadow-lg ring-4 ring-offset-2 ring-[#ff3a8c]/50";
    } else if (isCompleted) {
        return "bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white shadow-md";
    } else {
        return "bg-gray-100 text-gray-500 hover:bg-white border border-gray-300";
    }
};

export const stepIcon = (n, currentStep, isStep1Complete, isStep2Complete, status) => {
    const isCompleted =
        (n === 1 && isStep1Complete) ||
        (n === 2 && isStep2Complete) ||
        (n === 3 && status === "video_ready");
    if (isCompleted) return <FaCheck className="w-4 h-4" />;
    return n;
};
const generateAllAssets = async () => {
    if (!mediaData?.slides?.length)
        return; setBatchGenerating(true);
    for (const s of mediaData.slides) {
        if (!s.image)
            await generateImage(s.uuid);
        if (!s.audio)
            await generateAudio(s.uuid);
        await new Promise((res) => setTimeout(res, 1000));
    }
    setBatchGenerating(false);

};