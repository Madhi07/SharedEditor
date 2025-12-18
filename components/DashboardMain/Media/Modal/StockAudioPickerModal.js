import React, { useState, useEffect, Fragment } from "react";
import {
    FaTimes,
    FaSearch,
    FaCheckCircle,
    FaPlay,
    FaPause
} from "react-icons/fa";
import { retrieveOrRemove } from "../utils/apiFetchWrapper";
import { stockAssetsPath, stockCategoryPath } from "../utils/apiPaths/reels";

export default function StockAudioPickerModal({
    isOpen,
    onClose,
    onSelectAudio,
    slideUuid
}) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedAudio, setSelectedAudio] = useState(null);
    const [playingId, setPlayingId] = useState(null);

    // Audio player reference
    const audioRef = new Audio();

    /** ---------- 1. Fetch audio categories ---------- **/
    useEffect(() => {
        if (!isOpen) return;

        const fetchCategories = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await retrieveOrRemove(
                    "GET",
                    stockCategoryPath,
                    false
                );

                if (response?.data?.length) {
                    const top = response.data.filter((cat) => cat.parent === null);
                    setCategories(top);
                    if (top.length > 0) setSelectedCategory(top[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [isOpen]);

    /** ---------- 2. Fetch audio list for selected category ---------- **/
    useEffect(() => {
        if (!selectedCategory) return;

        const fetchAudios = async () => {
            setLoading(true);
            setAudios([]);
            setSelectedAudio(null);
            setError(null);

            try {
                const response = await retrieveOrRemove(
                    "GET",
                    `${stockAssetsPath}?category=${selectedCategory.id}&type=audio`
                );
                if (response?.data?.length) {
                    setAudios(response.data);
                } else {
                    setAudios([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAudios();
    }, [selectedCategory]);

    /** ---------- Play / Pause audio ---------- **/
    const togglePlay = (audio) => {
        if (playingId === audio.id) {
            audioRef.pause();
            setPlayingId(null);
            return;
        }

        audioRef.src = audio.preview_url || audio.original_url;
        audioRef.play();
        setPlayingId(audio.id);

        audioRef.onended = () => setPlayingId(null);
    };

    /** ---------- Confirm selection ---------- **/
    const handleSelect = () => {
        if (selectedAudio) {
            onSelectAudio(slideUuid, selectedAudio);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">

            {/* Modal Container */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">

                {/* ----- Header ----- */}
                <div className="p-5 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <FaSearch className="text-purple-500" /> Select Stock Audio
                    </h3>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* ----- Main Content ----- */}
                <div className="flex flex-1 overflow-hidden">

                    {/* ---- Left: Category Sidebar ---- */}
                    <div className="w-1/4 border-r p-4 bg-gray-50 overflow-y-auto">
                        <h4 className="text-sm font-semibold mb-3 text-gray-600 uppercase">
                            Categories
                        </h4>

                        {loading && !categories.length ? (
                            <ul className="space-y-2 animate-pulse">
                                {[...Array(5)].map((_, i) => (
                                    <li key={i} className="h-5 py-3 bg-gray-300 rounded-md" />
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

                    {/* ---- Right: Audio items ---- */}
                    <div className="flex-1 p-4 overflow-y-auto">

                        {selectedCategory && (
                            <h4 className="text-lg font-bold mb-4 text-gray-800">
                                {selectedCategory.name} Audio Files
                            </h4>
                        )}

                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-16 bg-gray-300 rounded-md" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 p-8">
                                ⚠️ Error: {error}
                            </div>
                        ) : audios.length === 0 ? (
                            <div className="text-center text-gray-500 p-8">
                                No audio files found for this category.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {audios.map((audio) => (
                                    <div
                                        key={audio.id}
                                        onClick={() => setSelectedAudio(audio)}
                                        className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition relative ${selectedAudio?.id === audio.id
                                            ? "border-purple-500 bg-purple-50"
                                            : "border-gray-200 hover:bg-gray-100"
                                            }`}
                                    >
                                        {/* Audio Info */}
                                        <div>
                                            <div className="font-semibold text-gray-800 text-sm">
                                                {audio.title || "Untitled Audio"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {audio.duration ? `${audio.duration}s` : "Unknown duration"}
                                            </div>
                                        </div>

                                        {/* Play Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePlay(audio);
                                            }}
                                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                                        >
                                            {playingId === audio.id ? (
                                                <FaPause className="text-purple-600" />
                                            ) : (
                                                <FaPlay className="text-purple-600" />
                                            )}
                                        </button>

                                        {/* Check Overlay */}
                                        {selectedAudio?.id === audio.id && (
                                            <FaCheckCircle className="absolute right-3 top-3 text-purple-600 text-lg" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ----- Footer ----- */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        onClick={handleSelect}
                        disabled={!selectedAudio}
                        className="px-6 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center gap-2"
                    >
                        <FaCheckCircle /> Select Audio
                    </button>
                </div>
            </div>
        </div>
    );
}
