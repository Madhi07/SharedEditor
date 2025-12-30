
import React, { useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSync, FaSearch, FaUpload, FaImage, FaTimes, FaVolumeUp } from "react-icons/fa";

import { createOrUpdate } from "../../utils/apiFetchWrapper";
import { manualAudioUploadPath, manualImageUploadPath, stockImagesAttach } from "../../utils/apiPaths/reels";
import { RefreshCw, Sparkles } from "lucide-react";

import MediaDisplayModal from "../../Modal/MediaDisplayModal";
import StockAssetPickerModal from "../../Modal/StockAssetPickerModal";


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
    blobData: null, // { slideId, file, previewUrl }
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
    // ... (existing code)
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        ⚠️ No slides available. Generate prompts first.
      </div>
    );
  }





  const openStockPicker = (type, slideUuid) => {
    setStockPicker({ isOpen: true, type, slideUuid, isUploading: false });
  };
  const closeStockPicker = () => {
    setStockPicker({ isOpen: false, type: "image", slideUuid: null, isUploading: false });
  };

  const handleSelectStockAsset = async (slideUuid, selectedAsset) => {
    try {
      const formData = new FormData();
      const isImage = stockPicker.type === "image";

      formData.append(
        isImage ? "stock_image_id" : "stock_audio_id",
        selectedAsset.id
      );
      formData.append("slide_id", slideUuid);
      setStockPicker(m => ({ ...m, isUploading: true }));

      const endpoint = isImage ? stockImagesAttach : stockAudioAttach;

      const response = await createOrUpdate(formData, "POST", endpoint, false);

      if (response?.data) {
        const updatedSlides = mediaData.slides.map((slide) => {
          if (slide.id !== slideUuid) return slide;

          const assetUrl = selectedAsset.preview_url || selectedAsset.original_url;

          if (isImage) {
            return {
              ...slide,
              image: {
                ...slide.image,
                image_url: assetUrl,
                asset_type: "stock"
              },
              image_source: "stock"
            };
          }

          return {
            ...slide,
            audio: {
              ...slide.audio,
              audio_url: assetUrl,
              asset_type: "stock"
            },
            audio_source: "stock"
          };
        });

        setMediaData({ ...mediaData, slides: updatedSlides });
        closeStockPicker();
      }
    } catch (err) {
      console.error("Attach stock asset failed:", err);
      alert("Failed to attach asset: " + (err.message || err));
    }
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
    let element = mediaModal.ref
    if (element) {
      element.value = ''
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
    const { mediaType, blobData } = mediaModal;
    if (!blobData) return;

    setMediaModal(m => ({ ...m, isUploading: true }));

    const { slideId, file } = blobData;
    const formData = new FormData();

    if (mediaType === "image") {
      formData.append("image", file);
      formData.append("slide_id", slideId);
    } else {
      formData.append("audio", file);
      formData.append("slide_id", slideId);
    }

    try {
      const endpoint =
        mediaType === "image" ? manualImageUploadPath : manualAudioUploadPath;

      const response = await createOrUpdate(formData, "POST", endpoint, true);

      if (response?.data?.data) {
        const finalUrl = mediaType === "image" ? response.data.data.image_url : response.data.data.audio_url;

        const updatedSlides = mediaData.slides.map(slide => {
          if (slide.id !== slideId) return slide;

          if (mediaType === "image") {
            return {
              ...slide,
              image: { ...slide.image, image_url: (finalUrl + "?key=1" + new Date().getMilliseconds()), asset_type: "uploaded" },
              image_source: "uploaded"
            };
          } else {
            return {
              ...slide,
              audio: { ...slide.audio, audio_url: (finalUrl + "?key=1" + new Date().getMilliseconds()), asset_type: "uploaded" },
              audio_source: "uploaded"
            };
          }
        });
        console.log("updatedSlides", updatedSlides)
        setMediaData({ ...mediaData, slides: updatedSlides });
        closeMediaModal();
      }
    } catch (err) {
      alert(err.message);
      setMediaModal(m => ({ ...m, isUploading: false }));
    }
  };





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
      {/* ... (existing code) ... */}
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
              className="border border-gray-200 rounded-2xl p-5 bg-white shadow-lg grid grid-cols-4 gap-6 items-center hover:shadow-xl transition"
            >
              {/* --- Left Column: Info --- */}
              {/* ... (existing code: subtitle, audio_prompt, slide_number, duration input) ... */}
              <div className="col-span-1">
                <h4 className="font-bold text-lg">{s.subtitle}</h4>
                <p className="text-xs text-gray-500 mt-1">{s.audio.audio_prompt}</p>
                <div className="mt-4 text-xs font-semibold text-gray-700">
                  Slide {s.slide_number}
                </div>

                {/* Duration Input */}
                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-700">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={s.duration || ""}
                    onChange={(e) => handleDurationChange(s.id, e.target.value)}
                    placeholder="e.g. 5"
                    readOnly
                    className="mt-1 w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* --- Right Columns: Image + Audio --- */}
              <div className="col-span-3 grid grid-cols-2 gap-6">
                {/* --- Image Section --- */}
                <div
                  className={`rounded-xl border p-4 shadow-sm ${hasImage ? "border-[#6e3aff] bg-purple-50" : "border-gray-200 bg-gray-50"
                    }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    {/* ... (existing code: FaImage, image_source span) ... */}
                    <div className="flex gap-2 items-center  text-sm font-semibold text-purple-700 flex-nowrap">
                      <FaImage />  <span className=" whitespace-nowrap">Image Asset</span>
                      {s.image.asset_type && (
                        <span className="text-xs font-normal text-gray-500">
                          ({s.image.asset_type === "uploaded"
                            ? "User Upload"
                            : s.image.asset_type === "stock"
                              ? "stock"
                              : "AI"})
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {/* Stock Image Picker */}
                      <button
                        onClick={() => openStockPicker("image", s.id)}
                        className="px-3 py-1 text-xs rounded-lg text-gray-800 border-[2px] border-transparent
                          bg-white bg-clip-padding
                          [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)]
                          [background-origin:border-box] [background-clip:padding-box,border-box]
                          hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c]
                          transition flex items-center gap-1"
                      >
                        <FaSearch />
                      </button>

                      {/* Upload Image */}
                      <label
                        className="px-3 py-1 text-xs rounded-lg text-gray-800 border-[2px] border-transparent
                          bg-white bg-clip-padding
                          [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)]
                          [background-origin:border-box] [background-clip:padding-box,border-box]
                          hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c]
                          transition cursor-pointer flex items-center gap-1"
                      >
                        <FaUpload />
                        {/* INPUT: Calls handleImageUpload with the file AND event */}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => openMediaApprove("image", s.id, e.target.files[0], e.target)}
                        />
                      </label>

                      {/* Generate Image */}
                      <button
                        onClick={() => generateImage(s.image.id)} // Use s.id
                        disabled={imgLoading}
                        className="px-3 py-1 text-xs rounded-lg text-gray-800 border-[2px] border-transparent
                          bg-white bg-clip-padding
                          [background-image:linear-gradient(white,white),linear-gradient(to_right,#6e3aff,#ff3a8c)]
                          [background-origin:border-box] [background-clip:padding-box,border-box]
                          hover:text-white hover:bg-gradient-to-r hover:from-[#6e3aff] hover:to-[#ff3a8c]
                          transition disabled:opacity-50 flex items-center gap-1"
                      >
                        <RefreshCw className={`w-4 h-4 ${imgLoading ? "animate-spin" : ""}  `} />
                        {/* {imgLoading
                          ? "Generating..."
                          : hasImage
                            ? "Re-generate"
                            : "Generate Image"} */}
                      </button>
                    </div>
                  </div>

                  {/* --- Image Preview --- */}
                  <div
                    // MODIFIED: Calls the new openImagePreview function
                    onClick={!imgLoading && hasImage ? () => openMediaPreview("image", s.image.image_url) : undefined}
                    className={`h-32 flex items-center justify-center overflow-hidden rounded-lg bg-white border border-dashed border-purple-200 ${hasImage && !imgLoading ? 'cursor-pointer hover:border-purple-500 transition' : ''}`}
                  >
                    {/* ... (existing code for imgLoading/hasImage/noImage ternary) ... */}
                    {imgLoading ? (
                      <div className="flex flex-col items-center">
                        <LuLoaderCircle className="animate-spin text-purple-600 text-3xl" />
                        <div className="text-xs text-gray-500 mt-2">Rendering image...</div>
                      </div>
                    ) : hasImage ? (
                      <img
                        src={s.image.image_url + `?sec=${new Date().getSeconds()}`}
                        alt={s.subtitle}
                        className="w-full h-32 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x128/CCCCCC/333333?text=${encodeURIComponent('Error Loading Image')}`; }}
                      />
                    ) : (
                      <div className="text-sm text-purple-400">Image is missing</div>
                    )}
                  </div>
                </div>

                {/* --- Audio Section --- */}
                {/* ... (existing audio code... no changes needed) ... */}
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
                        onClick={() => openStockPicker("audio", s.id)}
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
                          onChange={(e) => openMediaApprove("audio", s.id, e.target.files[0], e.target)}

                        />
                      </label>

                      {/* ---- Generate / Regenerate ---- */}
                      <button
                        onClick={() => generateAudio(s.id)}
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
                        <audio controls className="w-full h-full p-1" src={s.audio.audio_url} />
                      </div>
                    ) : (
                      <div className="text-sm text-blue-400">Audio is missing</div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* --- Navigation --- */}
      {/* ... (existing code) ... */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => { setCurrentStep(3); setShowChat(false); }}
          className="px-6 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] to-[#ff3a8c] text-white rounded-xl shadow-lg"
        >
          Next: Compose <FaArrowRight className="inline ml-1" />
        </button>
      </div>
    </div>
  );
}