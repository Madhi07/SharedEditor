"use client";

import { createContext, useContext, useState } from "react";
import { createOrUpdate } from "../utils/apiFetchWrapper";
import { useMediaState } from "./MediaStateContext";
import deepcopy from "deep-copy";

const MediaWorkflowContext = createContext();

export const MediaWorkflowProvider = ({ children }) => {
    const { mediaData, setMediaData,
        prompt, setPrompt,
        loading, setLoading,
        isModalOpen, setIsModalOpen,
        modalMode, setModalMode,
        modalImageUrl, setModalImageUrl,
        previewUploadData, setPreviewUploadData,
        isUploading, setIsUploading,
    } = useMediaState();





    const openImagePreview = (imageUrl) => {
        if (!imageUrl) return;
        setModalImageUrl(imageUrl);
        setModalMode("preview");
        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        if (isUploading) return;

        if (modalMode === "approve" && previewUploadData) {
            URL.revokeObjectURL(previewUploadData.previewUrl);
        }

        setIsModalOpen(false);
        setModalImageUrl(null);
        setPreviewUploadData(null);
        setIsUploading(false);
    };

    const handleImageUpload = (data, file, event) => {
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);

        setPreviewUploadData({
            ...data,
            previewUrl: objectUrl,
        });

        setModalImageUrl(objectUrl);
        setModalMode("approve");
        setIsModalOpen(true);

        if (event?.target) event.target.value = null;
    };

    function objectToFormData(obj) {
        const formData = new FormData();
        const { previewUrl, path, ...rest } = obj;

        Object.entries(rest).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => formData.append(`${key}[]`, v));
            } else {
                formData.append(key, value);
            }
        });

        return formData;
    }

    /* =========================================================
       APPROVE UPLOAD (API CALL)
    ========================================================= */
    const handleApproveUpload = async () => {
        if (!previewUploadData) return;

        setIsUploading(true);

        const formData = objectToFormData(previewUploadData);

        try {
            const response = await createOrUpdate(formData, "POST", previewUploadData.path, true);

            if (response.status === 200 && response.data) {
                let updated = deepcopy(mediaData);

                // Example: update thumbnail
                updated.data[0].thumbnail = response.data.thumbnail_url;

                setMediaData({ ...updated });
                handleCloseModal();
            }
        } catch (err) {
            console.error("Upload Error:", err);
            alert(`Upload failed: ${err.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <MediaWorkflowContext.Provider
            value={{
                // PROMPT
                prompt,
                setPrompt,
                loading,

                // UPLOAD
                isModalOpen,
                modalMode,
                modalImageUrl,
                isUploading,

                openImagePreview,
                handleCloseModal,
                handleImageUpload,
                handleApproveUpload,
            }}
        >
            {children}
        </MediaWorkflowContext.Provider>
    );
};

export const useMediaWorkflowContext = () => useContext(MediaWorkflowContext);
