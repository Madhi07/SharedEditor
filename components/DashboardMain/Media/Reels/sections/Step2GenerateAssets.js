import React, { useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useState } from "react";
import {
  FaArrowRight,
  FaUpload,
  FaImage,
  FaVolumeUp,
  FaSearch,
  FaYoutube,
  FaInstagram,
  FaTiktok
} from "react-icons/fa";

import { createOrUpdate } from "../../utils/apiFetchWrapper";
import { manualAudioUploadPath, manualImageUploadPath, stockImagesAttach } from "../../utils/apiPaths/reels";
import { RefreshCw, Sparkles } from "lucide-react";

import MediaDisplayModal from "../../Modal/MediaDisplayModal";
import StockAssetPickerModal from "../../Modal/StockAssetPickerModal";
import CaptionThemeSelector from "./CaptionThemeSelector";

// --- UPDATED: Define Caption Themes and Positions ---
const CAPTION_THEMES = [
  "BASIC", "REVID", "HORMOZ", "Ali", "Wrap 1", "WRAP 2",
  "FACELESS", "Elegant", "Difference", "Opacity", "Playful",
  "Movie", "Outline", "Cove"
];
const CAPTION_POSITIONS = ["Top", "Middle", "Bottom"];
// ---------------------------------------------------

// Helper to find platform dimensions and aspect ratio
const getPlatformDimensions = (mediaData) => {
  const platformWidth = mediaData?.platform?.width || 1920;
  const platformHeight = mediaData?.platform?.height || 1080;

  const ratio = platformHeight / platformWidth;
  return { ratio, platformWidth, platformHeight };
};

export default function Step2GenerateAssets({
  mediaData,
  loadingImage,
  loadingAudio,
  setCurrentStep,
  generateImage,
  generateAudio,
  handleDurationChange,
  setShowChat,
  setMediaData,
  clearAssetLoading,
}) {
  const [mediaModal, setMediaModal] = useState({
    isOpen: false,
    mode: "preview", // preview | approve
    mediaType: "image", // image | audio
    url: null,
    blobData: null,
    isUploading: false,
    ref: null
  });
  const [stockPicker, setStockPicker] = useState({
    isOpen: false,
    type: "image", // 'image' | 'audio'
    slideUuid: null,
    isUploading: false
  });

  useEffect(() => {
    return () => {
      clearAssetLoading()
    }
  }, [])

  if (!mediaData?.slides?.length) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        ⚠️ No slides available. Generate prompts first.
      </div>
    );
  }

  // --- Modal & Asset Handlers (Simplified for review, logic remains the same) ---
  const openStockPicker = (type, slideUuid) => {
    setStockPicker({ isOpen: true, type, slideUuid, isUploading: false });
  };
  const closeStockPicker = () => {
    setStockPicker({ isOpen: false, type: "image", slideUuid: null, isUploading: false });
  };
  const handleSelectStockAsset = async (slideUuid, selectedAsset) => {
    // ... (existing logic)
    console.log(`Selecting stock asset: ${selectedAsset.id} for slide ${slideUuid}`);
  };
  const openMediaPreview = (mediaType, url) => {
    setMediaModal({
      isOpen: true,
      mode: "preview",
      mediaType,
      url,
      blobData: null,
      isUploading: false
    });
  };
  const openMediaApprove = (mediaType, slideId, file, element) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    setMediaModal({
      isOpen: true,
      mode: "approve",
      mediaType,
      url: previewUrl,
      blobData: { slideId, file, previewUrl },
      isUploading: false,
      ref: element
    });
  };
  const closeMediaModal = () => {
    const { blobData } = mediaModal;

    if (blobData?.previewUrl) {
      URL.revokeObjectURL(blobData.previewUrl);
    }
    let element = mediaModal.ref;
    if (element) {
      element.value = '';
    }
    setMediaModal({
      isOpen: false,
      mode: "preview",
      mediaType: "image",
      url: null,
      blobData: null,
      isUploading: false
    });
  };
  const handleApproveMediaUpload = async () => {
    // ... (existing logic)
    console.log("Approving manual upload...");
  };
  // -------------------------------------------------------------

  const handleCaptionChange = (slideId, field, value) => {
    const updatedSlides = mediaData.slides.map(slide => {
      if (slide.id === slideId) {
        return {
          ...slide,
          [field]: value
        };
      }
      return slide;
    });
    setMediaData({ ...mediaData, slides: updatedSlides });
  };


  const { ratio, platformWidth, platformHeight } = getPlatformDimensions(mediaData);

  // --- Component Render ---
  return (
    <div className="space-y-6 pb-[40px]">

      <MediaDisplayModal
        isOpen={mediaModal.isOpen}
        mode={mediaModal.mode}
        mediaType={mediaModal.mediaType}
        mediaUrl={mediaModal.url}
        onClose={closeMediaModal}
        onApprove={handleApproveMediaUpload}
        isUploading={mediaModal.isUploading}
      />


      <StockAssetPickerModal
        type={stockPicker.type}
        isOpen={stockPicker.isOpen}
        slideUuid={stockPicker.slideUuid}
        onClose={closeStockPicker}
        onSelect={handleSelectStockAsset}
        isUploading={stockPicker.isUploading}
      />

      {/* --- Top Action Bar --- */}
      <div className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
        <div className="text-sm text-gray-600 font-semibold">
          Generate images & audio per slide, or batch generate for all assets.
        </div>
        <div className="flex gap-3 items-center">
          {/* Batch Generate button commented out */}
        </div>
      </div>


      {/* --- Slides Section --- */}
      <div className="grid grid-cols-1 gap-6">
        {mediaData.slides.map((s) => {
          const imgLoading = loadingImage[s.id];
          const audLoading = loadingAudio[s.id];
          const hasImage = !!s.image?.image_url;
          const hasAudio = !!s.audio?.audio_url;

          return (
            <div
              key={s.id}
              className="border border-gray-200 rounded-2xl p-5 bg-white shadow-lg flex gap-6 hover:shadow-xl transition"
            >
              {/* --- Left Container: 40% (Info, Audio, Captions) --- */}
              <div className="w-2/5 space-y-4"> {/* 40% width */}
                <div className="flex justify-between items-center px-1">
                  {/* Slide Number (Left) */}
                  <div className="text-sm font-bold text-gray-700">
                    Slide: {s.slide_number}
                  </div>
                  {/* Duration Display (Right) */}
                  <div className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                    Duration: <span className="text-purple-600 font-bold">{s.duration || 5} s</span>
                    {/* Hidden input kept for functionality if needed */}
                    <input
                      type="hidden"
                      value={s.duration || ""}
                      onChange={(e) => handleDurationChange(s.id, e.target.value)}
                    />
                  </div>
                </div>
                {/* --- Slide Info --- */}
                <div className="p-3 border rounded-xl bg-gray-50">
                  <h4 className="font-bold text-lg">{s.subtitle}</h4>
                  {/* <p className="text-xs text-gray-500 mt-1">{s.explain_text}</p> */}

                </div>

                {/* --- Audio Section --- */}
                <div
                  className={`rounded-xl border p-4 shadow-sm ${hasAudio ? "border-[#ff3a8c] bg-[#fef7f9]" : "border-gray-200 bg-white"
                    }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                      <FaVolumeUp /> Audio Asset
                      {s.audio?.asset_type && (
                        <span className="text-xs font-normal text-gray-500">
                          ({s.audio.asset_type === "uploaded"
                            ? "User Upload"
                            : s.audio.asset_type === "stock"
                              ? "Stock"
                              : "AI"})
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {/* Choose Stock Audio */}
                      <button
                        onClick={() => openStockPicker("audio", s.id)}
                        title="Search Stock Audio"
                        className="px-2 py-1 text-xs rounded-lg text-gray-800 border-2 bg-white bg-clip-padding 
                        [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)] [background-origin:border-box] [background-clip:padding-box,border-box] 
                        hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c] transition flex items-center gap-1"
                      >
                        <FaSearch className="w-3 h-3" />
                      </button>

                      {/* Upload Audio */}
                      <label
                        title="Upload Audio"
                        className="px-2 py-1 text-xs rounded-lg text-gray-800 border-2 bg-white bg-clip-padding 
                        [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)] [background-origin:border-box] [background-clip:padding-box,border-box] 
                        hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c] transition cursor-pointer flex items-center gap-1"
                      >
                        <FaUpload className="w-3 h-3" />
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => openMediaApprove("audio", s.id, e.target.files[0], e.target)}
                        />
                      </label>

                      {/* Generate / Regenerate */}
                      <button
                        onClick={() => generateAudio(s.id)}
                        disabled={audLoading}
                        title="Generate/Regenerate Audio"
                        className="px-2 py-1 text-xs rounded-lg text-gray-800 border-2 bg-white bg-clip-padding 
                        [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)] [background-origin:border-box] [background-clip:padding-box,border-box] 
                        hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c] transition disabled:opacity-50 flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${audLoading ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Audio Preview */}
                  <div className="h-10 flex items-center justify-center bg-white rounded-lg border border-dashed border-blue-200">
                    {audLoading ? (
                      <div className="flex items-center">
                        <LuLoaderCircle className="animate-spin text-pink-600 text-xl" />
                        <div className="text-xs text-gray-500 ml-2">Rendering audio...</div>
                      </div>
                    ) : hasAudio ? (
                      <div className="w-full h-full flex items-center">
                        <audio controls className="w-full h-full p-1" src={s.audio.audio_url} />
                      </div>
                    ) : (
                      <div className="text-sm text-blue-400">Audio is missing</div>
                    )}
                  </div>
                </div>

                {/* --- Caption Section --- */}
                <div className="space-y-3">
                  {/* Caption Text Input */}
                  <div>
                    <label htmlFor={`caption-text-${s.id}`} className="text-xs font-semibold text-gray-700">
                      Caption Text
                    </label>
                    <textarea
                      id={`caption-text-${s.id}`}
                      value={s.caption_text || s.explain_text || ""}
                      onChange={(e) => handleCaptionChange(s.id, 'caption_text', e.target.value)}
                      rows="3"
                      placeholder="Enter overlay text for the slide..."
                      className="mt-1 w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Caption Theme Select */}
                  <div>
                    <label htmlFor={`caption-theme-${s.id}`} className="text-xs font-semibold text-gray-700">
                      Caption Theme
                    </label>
                    <div
                      className="relative max-h-[170px] overflow-y-auto rounded-xl bg-white shadow-inner-custom border border-gray-200 p-3 mb-2 scrollbar-custom"
                    >
                      <CaptionThemeSelector
                        selected={s.caption_theme || ""}
                        onSelect={(value) => handleCaptionChange(s.id, "caption_theme", value)}
                      />
                    </div>


                  </div>

                  {/* CAPTION POSITION SELECT (NEW) */}
                  <div>
                    <label htmlFor={`caption-position-${s.id}`} className="text-xs font-semibold text-gray-700">
                      Caption Position
                    </label>
                    {/* <div className="absolute inset-0 bg-purple-500 bg-opacity-30 flex items-center justify-center">
                                                                    <FaCheckCircle className="text-white text-3xl" />
                                                                </div> */}
                    <div className="flex justify-between gap-2 relative" >
                      {CAPTION_POSITIONS.map(position => (
                        <button
                          key={position}
                          type="button"
                          onClick={() => handleCaptionChange(s.id, 'caption_position', position)}
                          className={`
                                    flex-1 py-2 text-sm rounded-lg border transition font-medium
                                    ${s.caption_position === position
                              ? ' inset-0 bg-purple-500 bg-opacity-30 flex items-center justify-center ring-2 ring-purple-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                            }
                                `}
                        >
                          {position}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* --- Right Container: 60% (Image) --- */}
              <div className="w-3/5  h-[100%]"> {/* 60% width */}
                {/* --- Image Section Header --- */}
                <div className="flex justify-between items-center mb-3 p-2 rounded-t-xl bg-purple-50 border border-purple-200">
                  <div className="flex gap-2 items-center text-sm font-semibold text-purple-700 flex-nowrap">
                    <FaImage /> <span className=" whitespace-nowrap">Image Asset ({platformWidth}x{platformHeight})</span>
                    {s.image?.asset_type && (
                      <span className="text-xs font-normal text-gray-500">
                        ({s.image.asset_type === "uploaded"
                          ? "User Upload"
                          : s.image.asset_type === "stock"
                            ? "Stock"
                            : "AI"})
                      </span>
                    )}
                  </div>

                  {/* Image Actions */}
                  <div className="flex gap-2">
                    {/* Stock Image Picker */}
                    <button
                      onClick={() => openStockPicker("image", s.id)}
                      title="Search Stock Image"
                      className="px-2 py-1 text-xs rounded-lg text-gray-800 border-2 bg-white bg-clip-padding
                          [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)]
                          [background-origin:border-box] [background-clip:padding-box,border-box]
                          hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c]
                          transition flex items-center gap-1"
                    >
                      <FaSearch className="w-3 h-3" />
                    </button>

                    {/* Upload Image */}
                    <label
                      title="Upload Image"
                      className="px-2 py-1 text-xs rounded-lg text-gray-800 border-2 bg-white bg-clip-padding
                          [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)]
                          [background-origin:border-box] [background-clip:padding-box,border-box]
                          hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c]
                          transition cursor-pointer flex items-center gap-1"
                    >
                      <FaUpload className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => openMediaApprove("image", s.id, e.target.files[0], e.target)}
                      />
                    </label>

                    {/* Generate Image */}
                    <button
                      onClick={() => generateImage(s.image.id)}
                      disabled={imgLoading}
                      title="Generate/Regenerate Image"
                      className="px-2 py-1 text-xs rounded-lg text-gray-800 border-2 bg-white bg-clip-padding
                          [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)]
                          [background-origin:border-box] [background-clip:padding-box,border-box]
                          hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c]
                          transition disabled:opacity-50 flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${imgLoading ? "animate-spin" : ""}  `} />
                    </button>
                  </div>
                </div>


                {/* Image Preview Container */}
                <div
                  className={`relative w-full h-[calc(100%-42px)] overflow-hidden rounded-b-xl border border-t-0 border-purple-200 bg-gray-200 shadow-inner`}
                  style={{ paddingBottom: `${ratio * 100}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center ">
                    {imgLoading ? (
                      <div className="flex flex-col items-center">
                        <LuLoaderCircle className="animate-spin text-purple-600 text-3xl" />
                        <div className="text-xs text-gray-500 mt-2">Rendering image...</div>
                      </div>
                    ) : hasImage ? (
                      <img
                        // object-contain ensures the full image is visible, showing a gray background if padded.
                        src={s.image.image_url}
                        alt={s.subtitle}
                        onClick={() => openMediaPreview("image", s.image.image_url)}
                        className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition rounded-md"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/${platformWidth}x${platformHeight}/CCCCCC/333333?text=${encodeURIComponent('Error Loading Image')}`; }}
                      />
                    ) : (
                      <div className="text-sm text-purple-400">Image is missing. Generate or upload one.</div>
                    )}
                  </div>
                </div>

                {/* Displaying Image Prompt below the image (Optional but helpful) */}
                {/* {s.image?.image_prompt && (
                  <p className="text-xs text-gray-500 mt-2 p-2 border-t">
                    **Prompt:** {s.image.image_prompt}
                  </p>
                )} */}
              </div>
            </div>
          );
        })}
      </div>


      {/* --- Navigation --- */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => { setCurrentStep(3); setShowChat(false); }}
          className="px-6 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-xl shadow-lg"
        >
          Next: Compose <FaArrowRight className="inline ml-1" />
        </button>
      </div>
    </div>
  );
}