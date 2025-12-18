// sections/Step3ComposeVideo.jsx
import React from "react";
import { FaArrowLeft, FaVideo } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";

/**
 * Step 3 — Compose Video Section
 *
 * Handles:
 *  - Slide selection
 *  - Slide order adjustment
 *  - Combining selected slides into a video
 */
export default function Step3ComposeVideo({
  mediaData,
  order,
  selectedSlides,
  combining,
  setCurrentStep,
  combineVideo,
  moveOrder,
  toggleSelect,
}) {
  if (!mediaData?.slides?.length) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        ⚠️ No slides available. Please generate assets first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- Header --- */}
      <div className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
        <div>
          <h3 className="font-bold text-xl">🎬 Compose & Order</h3>
          <p className="text-sm text-gray-500 mt-1">
            Reorder slides, select which to include, and combine into a single video.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-3 py-1 bg-gray-100 border rounded-xl text-sm hover:bg-gray-200 transition flex flex-nowrap whitespace-nowrap items-center justify-center gap-2"
          >
            <FaArrowLeft className="inline mr-1" /> Back to Assets
          </button>

          <button
            onClick={combineVideo}
            disabled={combining || mediaData.slides.length === 0}
            className="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-md hover:from-green-600 hover:to-teal-600 transition disabled:opacity-50"
          >
            {combining ? (
              <span className="flex items-center gap-2">
                <LuLoaderCircle className="animate-spin text-xl" /> Combining...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaVideo /> Combine Video ({selectedSlides.length} slides)
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- Slide Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {order.map((uuid, idx) => {
          const s = mediaData.slides.find((x) => x.uuid === uuid);
          if (!s) return null;

          const isSelected = selectedSlides.includes(s.uuid);
          const isReady = s.image && s.audio;

          return (
            <div
              key={s.uuid}
              className={`border rounded-2xl overflow-hidden bg-white shadow-lg transition duration-300 hover:shadow-xl ${
                isSelected
                  ? "border-green-400 ring-2 ring-green-100"
                  : "border-gray-200"
              }`}
            >
              <div className="p-4">
                {/* --- Header --- */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-lg font-bold flex items-center gap-2">
                      <span className="text-gray-500">#{idx + 1}</span> {s.subtitle}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {s.explain_text}
                    </div>
                  </div>

                  {/* --- Move Up / Down --- */}
                  <div className="flex flex-col gap-1 ml-3 flex-shrink-0">
                    <button
                      onClick={() => moveOrder(s.uuid, "up")}
                      disabled={idx === 0}
                      className="px-2 py-1 text-xs bg-gray-100 border rounded-lg hover:bg-gray-200 transition disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveOrder(s.uuid, "down")}
                      disabled={idx === order.length - 1}
                      className="px-2 py-1 text-xs bg-gray-100 border rounded-lg hover:bg-gray-200 transition disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                </div>

                {/* --- Image Preview --- */}
                <div className="mt-3 h-40 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-dashed">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.subtitle}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="text-sm text-gray-400">Image missing</div>
                  )}
                </div>

                {/* --- Audio Preview --- */}
                <div className="mt-3">
                  {s.audio ? (
                    <audio controls src={s.audio} className="w-full h-8" />
                  ) : (
                    <div className="text-xs text-gray-400 p-2 border rounded-lg bg-red-50 text-red-600">
                      Audio missing
                    </div>
                  )}
                </div>

                {/* --- Include Toggle --- */}
                <div className="mt-4 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      id={`slide-select-${s.uuid}`}
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(s.uuid)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor={`slide-select-${s.uuid}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Include in Video
                    </label>
                  </div>

                  <div
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isReady
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isReady ? "Ready ✓" : "Assets Missing"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
