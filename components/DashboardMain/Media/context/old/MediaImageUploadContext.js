import { createContext, useContext, useState } from "react";
import { createOrUpdate } from "../../utils/apiFetchWrapper";
import { useMediaWorkflowContext } from "../MediaWorkflowContext";
import deepcopy from "deep-copy";
const MediaImageUploadContext = createContext();

export const MediaImageUplaodProvider = ({ children }) => {
  const { mediaData, setMediaData } = useMediaWorkflowContext()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("preview"); // 'preview' or 'approve'
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const [previewUploadData, setPreviewUploadData] = useState(null); // { slideUuid, file, previewUrl }
  const [isUploading, setIsUploading] = useState(false);

  const openImagePreview = (imageUrl) => {
    if (imageUrl) {
      setModalImageUrl(imageUrl);
      setModalMode("preview");
      setIsModalOpen(true);
    }
  };


  const handleCloseModal = () => {
    if (isUploading) return; // Don't close if uploading

    // If we were in 'approve' mode, revoke the local blob URL
    if (modalMode === "approve" && previewUploadData) {
      URL.revokeObjectURL(previewUploadData.previewUrl);
    }

    setIsModalOpen(false);
    setModalImageUrl(null);
    setPreviewUploadData(null);
    setIsUploading(false);
    // No need to reset mode, it will be set on next open
  };


  const handleImageUpload = (data,file, event) => {
    if (!file || !setMediaData) return;

    const objectUrl = URL.createObjectURL(file);
    console.log("")

    // Store data needed for approval
    setPreviewUploadData({
      ...data,
      previewUrl: objectUrl,
    });

    // Set modal state
    setModalImageUrl(objectUrl);
    setModalMode("approve");
    setIsModalOpen(true);

    if (event && event.target) {
      event.target.value = null; // Clear file input
    }
  };


  function objectToFormData(obj) {
    const formData = new FormData();
    const { previewUrl,path, ...newObj } = obj;
    
    Object.entries(newObj).forEach(([key, value]) => {
      // Array support (optional)
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    });

    return formData;
  }



  const handleApproveUpload = async () => {
    if (!previewUploadData) return;

    // const { slideUuid, file } = previewUploadData;
    setIsUploading(true); // Show loading state in modal
    const formData = objectToFormData(previewUploadData)
    // const formData = new FormData();
    // formData.append("image", file);
    // formData.append("slide_uuid", previewUploadData.slideUuid);

    try {

      const response = await createOrUpdate(formData, "POST", previewUploadData.path, true);
      if (response.status == 200 && response.data) {
          let tempData = deepcopy(mediaData);
          tempData = [{...tempData.data[0],thumbnail:response.data.thumbnail_url }]

          // setMediaData((prev)=>({...prev, data:[]}))
            
        
        
        // const updatedSlides = mediaData.slides.map((slide) => {
        //   if (slide.uuid === slideUuid) {
        //     if (slide.image?.image_url?.startsWith("blob:")) {
        //       URL.revokeObjectURL(slide.image.image_url);
        //     }
        //     return {
        //       ...slide,
        //       image: { image_url: response.data.image_url }, // Set the final URL from API
        //       image_source: "uploaded",
        //     };
        //   }
        //   return slide;
        // });

        setMediaData((prev)=>({...prev, data:tempData }));
        handleCloseModal();
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(`Error: ${error.message}`);
      setIsUploading(false); // Stop loading, but keep modal open
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MediaImageUploadContext.Provider
      value={{
        handleImageUpload, isModalOpen,
        openImagePreview,
        setIsModalOpen, handleCloseModal,
        modalImageUrl, modalMode,
        handleApproveUpload, isUploading


      }}>
      {children}
    </MediaImageUploadContext.Provider>

  )
}

export const useMediaUploadContext = () => useContext(MediaImageUploadContext);