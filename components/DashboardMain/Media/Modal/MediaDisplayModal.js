// MediaDisplayModal.js
import React, { Fragment } from "react";
import { FaTimes, FaCheck, FaSpinner } from "react-icons/fa";

export default function MediaDisplayModal({
    isOpen,
    onClose,
    mediaUrl,
    mediaType = "image", // "image" | "audio"
    mode = "preview",    // "preview" | "approve"
    onApprove,
    isUploading = false
}) {
    if (!isOpen || !mediaUrl) return null;

    const title = mode === "approve" ? mediaType === "audio"
        ? "Audio Preview" : "Image Preview"
        : mediaType === "audio" ? "Audio Preview" : "Image Preview";

    const handleBackdropClick = () => {
        if (mode === "approve" && isUploading) return;
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999]"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ❌ Close Button */}
                <button
                    className="absolute right-4 top-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={onClose}
                    disabled={mode === "approve" && isUploading}
                >
                    <FaTimes />
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold mb-4">{title}</h2>

               
                {mediaType === "image" && (
                    <div className="max-h-[70vh] overflow-y-auto">
                        <img
                            src={mediaUrl}
                            alt="preview"
                            className="w-full h-auto rounded-lg object-contain"
                            onError={(e) => {
                                e.target.src =
                                    "https://placehold.co/600x400/CCCCCC/333333?text=Image+Not+Found";
                            }}
                        />
                    </div>
                )}

                {mediaType === "audio" && (
                    <audio
                        controls
                        src={mediaUrl}
                        className="w-full mt-3 rounded-lg"
                    />
                )}

               
                {mode === "approve" && (
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            disabled={isUploading}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onApprove}
                            disabled={isUploading}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            {isUploading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <Fragment>
                                    <FaCheck /> Submit
                                </Fragment>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
