// ImageDisplayModal.js
import React from "react";
import { FaTimes, FaCheck, FaSpinner } from "react-icons/fa";

/**
 * A unified modal for EITHER 'preview'ing an existing image
 * OR 'approve'ing a new image upload.
 */
const ImageDisplayModal = ({
    isOpen,
    onClose,
    imageUrl, // The URL to display (can be a final URL or a blob: URL)
    mode = "preview", // 'preview' or 'approve'

    // 'approve' mode props
    onApprove,
    isUploading = false,
}) => {
    
    
    if (!isOpen || !imageUrl) return null;

    const title = mode === "approve" ? "Approve Upload" : "Image Preview";
    console.log("the title", title)
    // Prevent closing on backdrop click if in 'approve' mode and uploading
    const handleBackdropClick = () => {
        if (mode === "approve" && isUploading) {
            return; // Do nothing
        }
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            {/* Use the larger max-width from your original preview modal for both modes */}
            <div
                className="bg-white rounded-xl shadow-2xl p-4 max-w-4xl max-h-[90vh] w-full mx-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- 1. Close Button (Common) --- */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition z-50"
                    disabled={mode === "approve" && isUploading}
                >
                    <FaTimes />
                </button>

                {/* --- 2. Title (Dynamic) --- */}
                <h3 className="text-xl font-bold mb-3">{title}</h3>

                {/* --- 3. Image (Common) --- */}
                {/* Use the larger max-height from your original preview modal */}
                <div className="max-h-[70vh] overflow-y-auto">
                    <img
                        src={imageUrl}
                        alt={mode === "approve" ? "Upload Preview" : "Preview"}
                        className="w-full h-auto object-contain rounded-lg"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://placehold.co/600x400/CCCCCC/333333?text=Image+Load+Failed";
                        }}
                    />
                </div>

                {/* --- 4. Footer (Conditional based on 'mode') --- */}
                {mode === "approve" ? (
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={onClose}
                            disabled={isUploading}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onApprove}
                            disabled={isUploading}
                            className="px-4 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-md transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[150px]"
                        >
                            {isUploading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <FaCheck />
                                    Approve & Upload
                                </>
                            )}
                        </button>
                    </div>
                ) : null}
                {/* In 'preview' mode, this ternary renders 'null', so no footer appears */}
            </div>
        </div>
    );
};

export default ImageDisplayModal;