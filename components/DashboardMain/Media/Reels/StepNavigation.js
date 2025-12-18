import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function StepNavigation({
    currentStep,
    setCurrentStep,
    isStep1Complete,
    isStep2Complete,
    mediaData,
    setShowChat
}) {
    const isStepClickable = (n) => {
        if (n === 1) return true;
        if (n === 2) return isStep1Complete;
        if (n === 3) return isStep2Complete;
        return false;
    };

    return (
        <>
            {(currentStep !== 3) && (
                <div className="w-full p-6 border-b border-gray-100 flex items-center gap-6">

                    {[1, 2, 3].map((n) => {
                        const clickable = isStepClickable(n);

                        return (
                            <div
                                key={n}
                                className={`
                                    px-4 py-2 rounded-xl transition duration-300
                                    ${clickable ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}
                                `}
                                onClick={() => {
                                    if (!clickable) return;
                                    setCurrentStep(n);
                                    if (n === 3) setShowChat(false);
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
                        );
                    })}

                    {currentStep !== 1 && (
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="px-4 py-2 bg-gray-100 border rounded-xl text-gray-700 hover:bg-gray-200 transition flex items-center gap-2"
                        >
                            <FaArrowLeft /> Back
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
