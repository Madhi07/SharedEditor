import { FaVolumeUp, FaSearch, FaUpload } from "react-icons/fa";
import { RefreshCw } from "lucide-react";
import { LuLoaderCircle } from "react-icons/lu";

export default function AudioAssetCard({
    slideId,
    hasAudio,
    audioUrl,
    audLoading,
    openStockModal,
    handleAudioUpload,
    generateAudio
}) {
    return (
        <div
            className={`rounded-xl border p-4 shadow-sm ${hasAudio ? "border-[#ff3a8c] bg-[#f7f2f4]" : "border-gray-200 bg-gray-50"
                }`}
        >
            {/* ---- Header ---- */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                    <FaVolumeUp /> Audio Asset
                </div>

                <div className="flex gap-2">

                    {/* ---- Choose Stock Audio ---- */}
                    <button
                        onClick={() => openStockModal(slideId)}
                        className="px-3 py-1 text-xs rounded-lg text-gray-800 border-[2px] border-transparent
              bg-white bg-clip-padding
              [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)]
              [background-origin:border-box] 
              [background-clip:padding-box,border-box]
              hover:text-white hover:bg-gradient-to-r 
              hover:from-[#6e3aff] hover:to-[#ff3a8c]
              transition flex items-center gap-1"
                    >
                        <FaSearch />
                    </button>

                    {/* ---- Upload Audio ---- */}
                    <label
                        className="px-3 py-1 text-xs rounded-lg text-gray-800 border-[2px] border-transparent
              bg-white bg-clip-padding
              [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)]
              [background-origin:border-box] 
              [background-clip:padding-box,border-box]
              hover:text-white hover:bg-gradient-to-r 
              hover:from-[#6e3aff] hover:to-[#ff3a8c]
              transition cursor-pointer flex items-center gap-1"
                    >
                        <FaUpload />
                        <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) =>
                                handleAudioUpload(slideId, e.target.files[0], e)
                            }
                        />
                    </label>

                    {/* ---- Generate / Regenerate ---- */}
                    <button
                        onClick={() => generateAudio(slideId)}
                        disabled={audLoading}
                        className="px-3 py-1 text-xs rounded-lg text-gray-800 border-[2px] border-transparent bg-white bg-clip-padding 
              [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)] [background-origin:border-box] 
              [background-clip:padding-box,border-box] hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c]
               transition disabled:opacity-50 flex items-center gap-1"
                    >
                        <RefreshCw className={`w-4 h-4 ${audLoading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* ---- Audio Preview ---- */}
            <div className="h-32 flex items-center justify-center bg-white rounded-lg border border-dashed border-blue-200">
                {audLoading ? (
                    <div className="flex flex-col items-center">
                        <LuLoaderCircle className="animate-spin text-pink-600 text-3xl" />
                        <div className="text-xs text-gray-500 mt-2">Rendering audio...</div>
                    </div>
                ) : hasAudio ? (
                    <div className="w-full h-12 flex items-center">
                        <audio controls className="w-full h-full p-1" src={audioUrl} />
                    </div>
                ) : (
                    <div className="text-sm text-blue-400">Audio is missing</div>
                )}
            </div>
        </div>
    );
}
