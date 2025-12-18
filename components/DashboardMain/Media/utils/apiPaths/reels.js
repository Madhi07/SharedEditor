export const mediaApiPath = "/media/generate/"; // Or whatever your GET endpoint is


// Base path for general media generation history (used for GET / DELETE operations)
export const mediaGeneratePath = "/media/generate/";

// Base path for Reels operations (e.g., GET list, DELETE, specific Reels GET/PUT)
export const reelsPath = "/media/reels/";

// High-level generation and scripting endpoints
// export const reelsScriptGeneratePath = "/media/reels-script-generate/";
export const reelsScriptGeneratePath = "/media/script-generate/";
export const reelsGeneratePath = "/media/reels/generate/"; // Likely the main final generation endpoint


// Re-generation endpoints for specific assets (Reels-level)
export const reelsImagePromptRegeneratePath = "/media/image-prompt/{id}/regenerate-prompt/";

export const reelsSlidesUpdate ="/media/slides/"

export const reelsAudioPromptRegeneratePath = "/media/audio-prompt-regenerate/";
export const reelsAssetGeneratePath = "/media/asset-generate/"; // General asset generation trigger

// Asset-specific re-generation (within a Reel/Slide context)
export const reelsImageRegeneratePath = "/media/image-regenerate/";
export const reelsAudioRegeneratePath = "/media/audio-prompt-regenerate/regenerate-audio/";
export const reelsSlidePath = "/media/reels/slide/"; // Endpoint for individual slide details/updates

// Manual Uploads
export const manualImageUploadPath = "/media/manual-image-upload";
export const manualVideoUploadPath = "/media/manual-video-upload";
export const manualAudioUploadPath = "/media/manual-audio-upload";

//Prompt Generate (Blog)
export const blogsPromptGeneratePath = "/blog/generate-prompts/"
export const regenerateBlogPrompts = "/blog/regenerate-prompts/"
export const generateBlogAssets = "/blog/generate-assets/"
export const manualUploadThumbnail = "/blog/upload_thumbnail/"


export const mediaGenerateVideo ="/media/generate-video/"






// --- Stock Asset Endpoints ---

// Base path for fetching/managing stock assets
export const stockAssetsPath = "/stock/assets/";

// Endpoint to fetch the list of asset providers (e.g., Pexels, Unsplash, Getty)
export const stockAssetProvidersPath = "/stock/assets/providers/";

// Endpoint for managing/fetching tags associated with stock assets
export const stockTagPath = "/stock/tag/";

// Endpoint for managing/fetching categories associated with stock assets
export const stockCategoryPath = "/stock/category/";


// /media/stock-image/attach/

export const stockImagesAttach ="/media/stock-image/attach/"


export const instagramPostApi ="/media/instagram/post-reel"