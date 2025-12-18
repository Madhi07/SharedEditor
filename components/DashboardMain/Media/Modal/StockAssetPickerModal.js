import React, { useState, useEffect, Fragment, useRef } from "react";
import {
    FaTimes,
    FaSearch,
    FaCheckCircle,
    FaPlay,
    FaPause,
    FaSpinner
} from "react-icons/fa";

import { retrieveOrRemove } from "../utils/apiFetchWrapper";
import { stockAssetsPath, stockCategoryPath } from "../utils/apiPaths/reels";

export default function StockAssetPickerModal({
    isOpen,
    onClose,
    onSelect,
    slideUuid,
    type = "image", // "image" | "audio"
    isUploading,
}) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // audio player only required if type = audio
    const audioRef = useRef(new Audio());
    const [playingId, setPlayingId] = useState(null);

    // ---------------- Fetch Categories ----------------
    useEffect(() => {
        if (!isOpen) return;

        const loadCategories = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await retrieveOrRemove("GET", `${stockCategoryPath}`, false);

                const top = res?.data?.length ? res.data.filter((c) => c.parent === null) : [];
                setCategories(top);
                if (top.length > 0) setSelectedCategory(top[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, [isOpen]);

    // ---------------- Fetch Assets ----------------
    useEffect(() => {
        if (!selectedCategory) return;

        const loadAssets = async () => {
            setLoading(true);
            setAssets([]);
            setSelectedAsset(null);
            setError(null);

            try {
                const url = `${stockAssetsPath}?category=${selectedCategory.id}&type=${type}`;

                const res = await retrieveOrRemove("GET", url);

                setAssets(res?.data?.length ? res.data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadAssets();
    }, [selectedCategory]);

    // ---------------- Audio Play / Pause ----------------
    const togglePlay = (asset) => {
        if (type !== "audio") return;

        if (playingId === asset.id) {
            audioRef.current.pause();
            setPlayingId(null);
            return;
        }

        audioRef.current.src = asset.preview_url || asset.original_url;
        audioRef.current.play();
        setPlayingId(asset.id);

        audioRef.current.onended = () => setPlayingId(null);
    };

    // ---------------- Final Select ----------------
    const handleSelect = () => {
        if (!selectedAsset) return;
        onSelect(slideUuid, selectedAsset);

    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl min-h-[70vh] max-h-[70vh] flex flex-col">

                {/* Header */}
                <div className="p-5 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <FaSearch className="text-purple-500" />
                        Select Stock {type === "image" ? "Image" : "Audio"}
                    </h3>

                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Main Section */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Categories */}
                    <div className="w-1/4 border-r p-4 bg-gray-50 overflow-y-auto">
                        <h4 className="text-sm font-semibold mb-3 text-gray-600 uppercase">Categories</h4>

                        {loading && !categories.length ? (
                            <ul className="space-y-2 animate-pulse">
                                {[...Array(5)].map((_, i) => (
                                    <li key={i} className="h-5 py-3 bg-gray-300 rounded-md"></li>
                                ))}
                            </ul>
                        ) : (
                            <ul className="space-y-1">
                                {categories.map((cat) => (
                                    <li
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`cursor-pointer p-2 rounded-lg text-sm transition ${selectedCategory?.id === cat.id
                                            ? "bg-purple-100 text-purple-700 font-bold"
                                            : "text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {cat.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Assets Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {loading ? (
                            <>
                                {type === "image" ? (
                                    <div className="grid grid-cols-3 gap-4 animate-pulse">
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className="aspect-video bg-gray-300 rounded-lg"></div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-pulse">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="h-16 bg-gray-300 rounded-lg"></div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : error ? (
                            <div className="text-red-500 text-center p-8">⚠️ {error}</div>
                        ) : assets.length === 0 ? (
                            <div className="text-gray-500 text-center p-8">No assets found.</div>
                        ) : type === "image" ? (
                            // ------- Image Grid -------
                            <div className="grid grid-cols-3 gap-4">
                                {assets.map((img) => (
                                    <div
                                        key={img.id}
                                        onClick={() => setSelectedAsset(img)}
                                        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer shadow ${selectedAsset?.id === img.id
                                            ? "ring-4 ring-purple-500 ring-offset-2 bg-purple-100 text-purple-700 font-bold"
                                            : ""
                                            }`}
                                    >
                                        <img
                                            src={img.preview_url || img.original_url}
                                            className="w-full h-full object-cover"
                                        />
                                        {selectedAsset?.id === img.id && (
                                            <div className="absolute inset-0 bg-purple-500 bg-opacity-30 flex items-center justify-center">
                                                <FaCheckCircle className="text-white text-3xl" />
                                            </div>)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {assets.map((audio) => (
                                    <div
                                        key={audio.id}
                                        onClick={() => setSelectedAsset(audio)}
                                        className={`p-4 rounded-lg border cursor-pointer relative ${selectedAsset?.id === audio.id
                                            ? "border-purple-500 bg-purple-50"
                                            : "border-gray-200 hover:bg-gray-100"
                                            }`}
                                    >
                                        {/* Title */}
                                        <div className="font-semibold text-sm text-gray-800 mb-2">
                                            {audio.title || `Audio ${audio.id}`}
                                        </div>

                                        {/* Native Audio Player */}
                                        <audio
                                            src={audio.preview_url || audio.original_url}
                                            controls
                                            className="w-full"
                                            onPlay={(e) => {
                                                // pause others
                                                if (audioRef.current !== e.target) {
                                                    audioRef.current.pause();
                                                }
                                                audioRef.current = e.target;
                                                setPlayingId(audio.id);
                                            }}
                                            onPause={() => setPlayingId(null)}
                                            onEnded={() => setPlayingId(null)}
                                        />

                                        {/* Checkmark */}
                                        {selectedAsset?.id === audio.id && (
                                            <FaCheckCircle className="absolute right-3 top-3 text-purple-600 text-lg" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        onClick={handleSelect}
                        disabled={!selectedAsset}
                        className="flex gap-2 items-center justify-center px-6 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-xl shadow disabled:opacity-40"
                    >
                        {isUploading ? (
                            <Fragment>
                                <FaSpinner className="animate-spin" /> Updating...
                            </Fragment>
                        ) : (
                            <Fragment>
                                <FaCheckCircle /> Submit {type === "image" ? "Image" : "Audio"}
                            </Fragment>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
}
