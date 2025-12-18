"use client";

import { createContext, useContext, useState } from "react";
import { createOrUpdate, retrieveOrRemove } from "../utils/apiFetchWrapper";
import { useMediaState } from "./MediaStateContext";
import { useRouter } from "next/router";
import { getPath } from "../utils/path";


const MediaHistoryContext = createContext();

const paths = {
  reels: "/media/reels/",
  blog: "/blog/",
  carousel :"/carousel/carousels/"
};

export const MediaHistoryProvider = ({ children }) => {
    const router = useRouter()
    const {
        loading, setLoading,
        setMediaList, setSelectedMediaId,
        setMediaData, clearAll, setResMessages,
        setGeneratingPrompt, setShowChat,
        prompt, setPrompt, setChats, setCurrentStep, mediaList,
    } = useMediaState();

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        mediaId: null,
        subcategory: null,
        status: null,
        message: null,
    });

    const { index } = router.query

    /** -----------------------------------
     * GET MEDIA LIST
     * ----------------------------------- */
    const getMediaList = async (subcategory) => {
        
        const path = getPath(subcategory, "GET");
        const res = await retrieveOrRemove("GET", path, true);

        setLoading(false);

        if (!res?.data) return [];
        const list = Array.isArray(res.data.data) ? res.data.data : res.data;
        setResMessages({ status: "ok", message: list.length ? null : "No media generated yet." });
        setMediaList(list);
        return list;
    };

    /** -----------------------------------
     * FETCH SINGLE MEDIA
     * ----------------------------------- */
    const fetchMedia = async (subcategory, id) => {
        setShowChat(false)
        let data = {}
        try {
            const path = getPath(subcategory, "GET", id); 
            const res = await retrieveOrRemove("GET", path, true);
           console.log("the response", res?.data)

            if (res?.data) {
                setMediaData(res.data.data);
                setSelectedMediaId(id);
            }
            data = res?.data?.data ?? res.data ?? {}
            setMediaList((prev) =>
                prev.map((item) =>
                    item.id === data.id ? { ...item, status: data.status } : item
                )
            ); 
        } catch (er) {
            console.log("------------------->", er)
        } finally {
            setLoading(false);
        }
        return data;
    };

    /** -----------------------------------
     * DELETE MEDIA → AUTO LOAD NEXT MEDIA
     * ----------------------------------- */
    const deleteMedia = async () => {
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
                clearAll('mediaId')
                router.push({ pathname: router.pathname, query: newQuery });
            }

            setTimeout(() => {
                setDeleteModal((prev) => ({ ...prev, open: false }));
            }, 1500);
        } else {
            setDeleteModal({ ...deleteModal, status: "err4xx", message: "Failed to delete." });
        }
        return true;
    };


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


    const getFetchMediaDataWithMediaId = async (subcategory) => {
        try {
            const params = new URLSearchParams(window.location.search);
            const mediaId = params.get("mediaId");

            if (!mediaId) {
                setMediaData(null);
                setLoading(false);
                return;
            }

            setLoading(true)
            // Fetch the media data
            await fetchMedia(subcategory, mediaId);
        } catch (error) {
            console.error("Error fetching media data:", error);
            setMediaData(null);
            setLoading(false);
        }
    };

    // ---------------------------------------
    // GENERATE PROMPT
    // ---------------------------------------
    const generatePrompt = async (bodyData, path, mediaType) => {
        console.log("the body Data", bodyData)
        setGeneratingPrompt(true);
        try {
            const response = await createOrUpdate(bodyData, "POST", path, true, mediaType);
            if (response?.data) {
                const redirectId =  response.data.data.id;
                setMediaData(response.data.data ?? response.data);
                await fetchMedia(mediaType, redirectId);
                setCurrentStep(1);
                router.push(`/dashboard/media/${mediaType}?mediaId=${redirectId}&step=1`, undefined, { shallow: true });
            }
        } catch (err) {

        } finally {
            setShowChat(false)
            getMediaList(index?.[1] ?? "reels")
            setGeneratingPrompt(false);
        }
    };


    return (
        <MediaHistoryContext.Provider
            value={{
                loading,
                deleteModal,
                setDeleteModal,
                getMediaList,
                fetchMedia,
                deleteMedia,
                getFetchMediaDataWithMediaId,
                generatePrompt,
            }}
        >
            {children}
        </MediaHistoryContext.Provider>
    );
};

export const useMediaHistory = () => useContext(MediaHistoryContext);
