"use client";

import { createContext, useContext, useState } from "react";
import { retrieveOrRemove } from "@/components/DashboardMain/Media/utils/apiFetchWrapper";
import { useRouter } from "next/router";
import { useMediaContext } from "./mediaContext";
// import { useMediaWorkflowContext } from "./MediaWorkflowContext";

const MediaHistoryPanel = createContext();

export const MediaHistoryPanelProvider = ({ children }) => {
    const router = useRouter();
    const { mediaList, setMediaList, showCreateSection, setShowCreateSection, formChatbotData, setFormChatbotData, } = useMediaContext()
    // const { getFetchMediaDataWithMediaId, clearAll } = useMediaWorkflowContext()

    const [resMessages, setResMessages] = useState({
        status: "ok",
        message: null,
    });

    const [deleteModal, setDeleteModal] = useState({
        subcategory: null,
        status: null,
        message: null,
        mediaId: null,
        open: false,
    });

    // ---------------------------------------
    // FETCH MEDIA HISTORY
    // ---------------------------------------
    const getMediaGenerations = async (subcategory) => {
        setResMessages({ status: "loading", message: "Fetching media history..." });

        const path = subcategory === "reels" ? `/media/reels/` : subcategory === "blog" ? "/blog/" : `/media/${subcategory}/`;

        const res = await retrieveOrRemove("GET", path, true);

        if (res?.data) {
            const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data.data) ? res.data.data : [];
            setResMessages({ status: "ok", message: list.length ? null : "No media generated yet." });
            setMediaList(list)
            return list;
        }

        return [];
    };

    // ---------------------------------------
    // DELETE MEDIA
    // ---------------------------------------
    const confirmDelete = async () => {
        const { mediaId, subcategory } = deleteModal;
        if (!mediaId || !subcategory) return;

        setDeleteModal({ ...deleteModal, status: "loading", message: "Deleting..." });

        const path = subcategory === "reels" ? `/media/reels/${mediaId}/` : `/${subcategory}/${mediaId}/`;

        const res = await retrieveOrRemove("DELETE", path, true);

        if (subcategory === "reels") {
            getMediaGenerations('reels')
        }
        if (res?.status === 200 || res?.status === 204) {
            setDeleteModal({ ...deleteModal, status: "ok", message: "Deleted successfully" });


            // remove & redirect
            if (router.query.mediaId === mediaId) {
                const newQuery = { ...router.query };
                delete newQuery.mediaId;
                //  clearAll(subcategory)
                router.push({ pathname: router.pathname, query: newQuery });
            }

            setTimeout(() => {
                setDeleteModal((prev) => ({ ...prev, open: false }));
            }, 1500);
        } else {
            setDeleteModal({ ...deleteModal, status: "err4xx", message: "Failed to delete." });
        }

    };

    return (
        <MediaHistoryPanel.Provider
            value={{
                resMessages,
                setResMessages,
                deleteModal,
                setDeleteModal,
                confirmDelete,
                getMediaGenerations,
            }}
        >
            {children}
        </MediaHistoryPanel.Provider>
    );
};

export const useMediaHistoryPanelContext = () => useContext(MediaHistoryPanel);
