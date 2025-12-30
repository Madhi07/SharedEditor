// sections/Step1PromptSetup.jsx
import React from "react";
import { FaSync, FaEdit, FaSave, FaImage, FaVolumeUp, FaArrowRight } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { PiWarningCircleLight } from "react-icons/pi";

export default function Step1PromptSetup({
  mediaData,
  editingUuid,
  tempPrompts,
  startEdit,
  saveEdit,
  setEditingUuid,
  setTempPrompts,
  regenerateImagePrompt,
  regenerateAudioPrompt,
  setCurrentStep,
  setLoadingPrompt,
  loadingPrompt,
  generateAllAssets
}) {
  if (!mediaData?.slides?.length) {
    return <div className="text-center text-gray-500 py-8 h-full  flex items-center justify-center flex-col gap-2 ">
      <PiWarningCircleLight className="w-[25px] h-[25px]" />
      No slides available. Generate prompt first.
    </div>;
  }


  return (
    <div className="space-y-6 pb-[40px]">
      {mediaData.slides.map((s) => {
        const editing = editingUuid === s.id;
        const tmp = tempPrompts[s.id] || {};
        return (
          <div key={s.id} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl text-gray-900">
                  Slide {s.slide_number}: {s.subtitle}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{s.audio.audio_prompt}</p>
              </div>
              <div className="flex gap-2 ml-4">
                {!editing ? (
                  <>
                    <button onClick={() => startEdit(s.id)} className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button onClick={() => regenerateImagePrompt(s.image.id)} className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1">
                      <FaSync /> Image
                    </button>
                    <button onClick={() => regenerateAudioPrompt(s.audio.id)} className="px-3 py-1 border border-[#6e3aff] text-[#6e3aff] rounded-lg flex items-center gap-1">
                      <FaSync /> Audio
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => saveEdit(s.id)} className="px-4 py-1 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] p-2 text-white rounded-lg flex items-center gap-1">
                      <FaSave /> Save
                    </button>
                    <button onClick={() => setEditingUuid(null)} className="px-4 py-1 bg-white border rounded-lg text-gray-700">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-6 pb-[20px]">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 flex items-center gap-1">
                  <FaImage /> Image Prompt
                </label>
                <div className="relative w-full h-full">
                  {editing ? (
                    <textarea
                      rows={4}
                      value={tmp.image_prompt ?? s.image.image_prompt}
                      onChange={(e) =>
                        setTempPrompts((p) => ({ ...p, [s.id]: { ...(p[s.id] || {}), image_prompt: e.target.value }, }))
                      }
                      className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#ff3a8c]"
                    />
                  ) : (
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">{s.image.image_prompt}</div>
                  )}
                  {loadingPrompt?.[s.image.id] && (

                    <div className="absolute inset-0 flex  h-[100%]  justify-center items-center rounded-xl backdrop-blur-sm bg-black/40 z-20">
                      <div className="flex flex-col items-center gap-2">
                        <LuLoaderCircle className="animate-spin text-pink-500 text-4xl drop-shadow-[0_0_10px_rgba(255,58,140,0.6)]" />
                        <span className="text-xs text-white font-medium tracking-wide animate-pulse">
                          {loadingPrompt?.[s.image.id] ?? "Processing Image prompt..."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500  flex items-center gap-1">
                  <FaVolumeUp /> Audio Prompt
                </label>
                <div className="relative w-full h-full ">
                  {editing ? (
                    <textarea
                      rows={4}
                      value={tmp.audio_prompt ?? s.audio.audio_prompt}
                      onChange={(e) =>
                        setTempPrompts((p) => ({
                          ...p,
                          [s.id]: { ...(p[s.id] || {}), audio_prompt: e.target.value },
                        }))
                      }
                      className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#6e3aff]"
                    />

                  ) : (
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">{s.audio.audio_prompt}</div>
                  )}

                  {loadingPrompt?.[s.audio.id] && (
                    <div className="absolute inset-0 h-[80%] flex justify-center items-center rounded-xl backdrop-blur-sm bg-black/40 z-20">
                      <div className="flex flex-col items-center gap-2">
                        <LuLoaderCircle className="animate-spin text-pink-500 text-4xl drop-shadow-[0_0_10px_rgba(255,58,140,0.6)]" />
                        <span className="text-xs text-white font-medium tracking-wide animate-pulse">
                          {loadingPrompt?.[s.audio.id] ?? "Processing audio prompt..."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end pt-4">
        <button
          onClick={() => {
            if (mediaData.status === 'creating') {
              generateAllAssets();
            }
            setCurrentStep(2)
          }}
          className="px-6 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-xl shadow-lg"
        >
          Proceed to Next <FaArrowRight className="inline ml-1" />
        </button>
      </div>
    </div>
  );
}
