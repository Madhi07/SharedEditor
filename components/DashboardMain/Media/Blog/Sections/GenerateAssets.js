import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { useMediaWorkflowContext } from "../../context/MediaWorkflowContext"
import Image from "next/image"
import { FaEdit, FaSave, FaSync } from "react-icons/fa"
import { createOrUpdate } from "../../utils/apiFetchWrapper"
import { generateBlogAssets, manualUploadThumbnail, regenerateBlogAssets, regenerateBlogPrompts } from "../../utils/apiPaths/reels"
import { FaSpinner, FaUpload } from "react-icons/fa6"
import { useMediaUploadContext } from "../../context/old/MediaImageUploadContext"
import ImageDisplayModal from "../../Modal/ImageDisplayModal"
import deepcopy from "deep-copy";
import { Editor } from "../editor"
import MyEditor from "../editor"
import { useRouter } from "next/router"
// import EditorWrapper from "../DynamicEditor"
// import Editor from "../editor"

export const GenerateAssets = () => {
    const router = useRouter()
    const {mediaId} = router.query
    const { mediaData, getFetchMediaDataWithMediaId,
        loading, setLoading, setMediaData,
    } = useMediaWorkflowContext()

    const { handleImageUpload,
        isModalOpen,
        setIsModalOpen, handleCloseModal,
        modalImageUrl, modalMode,
        handleApproveUpload, isUploading,
        openImagePreview

    } = useMediaUploadContext()

    const fileRef = useRef();
    const loadingCounter = useRef(0);
    const editorRef = useRef();

    const [thumbnailImage, setThumbnailImage] = useState(null)
    const item = useMemo(() => mediaData?.data?.[0], [mediaData]);
    const [editAsset, setEditAsset] = useState(() => ({

        title: { editing: false, editAsset: mediaData?.data?.[0]?.generated_title || "", loading: false, prompt_key_value: "title_prompt" },
        description: { editing: false, editAsset: mediaData?.data?.[0]?.generated_description || "", loading: false, prompt_key_value: "description_prompt" },
        content: { editing: false, editAsset: mediaData?.data?.[0]?.generated_content || "", loading: false, prompt_key_value: "content_prompt" },
        thumbnail: { editing: false, editAsset: mediaData?.data?.[0]?.thumbnail || "", loading: false, prompt_key_value: "thumbnail_prompt" }
    }));


    useEffect(() => {
   
        fetchInitalData()

    }, [])


    const fetchInitalData = async () => {
        const assetResponse = await createOrUpdate(
            { blog_id:mediaId , segment: "all" },
            "POST",
            generateBlogAssets,
            true
        );
        getFetchMediaDataWithMediaId("blog")
    }




    useEffect(() => {
        if (!item) return;

        setEditAsset(prev => ({
            ...prev,
            title: { ...prev.title, editAsset: item.generated_title },
            description: { ...prev.description, editAsset: item.generated_description },
            content: { ...prev.content, editAsset: item.generated_content },
            thumbnail: { ...prev.thumbnail, editAsset: item.thumbnail },
        }));
    }, [item?.generated_title, item?.generated_description, item?.generated_content, item?.thumbnail]);





    const regenerateAsset = async (payload, method, key) => {

        loadingCounter.current += 1;
        setEditAsset(prev => ({
            ...prev,
            [key]: { ...prev[key], loading: true }
        }));
        setLoading(true);

        try {
            const response = await createOrUpdate(
                payload,
                method,
                regenerateBlogPrompts,
                true
            );

            if (response.status !== 200) {
                throw new Error("Failed to regenerate prompt");
            }

            // Call generate assets
            if (method == "PATCH") {
                const assetResponse = await createOrUpdate(
                    { blog_id: payload.blog_id, segment: editAsset[key].prompt_key_value },
                    "POST",
                    generateBlogAssets,
                    true
                );

                if (assetResponse.status !== 200) {
                    throw new Error("Failed to regenerate assets");
                }


                const updatedData = deepcopy(mediaData);
                const FIELD_MAP = {
                    title: "generated_title",
                    description: "generated_description",
                    content: "generated_content",
                    thumbnail: "thumbnail"
                };

                const keyName = FIELD_MAP[key];

                updatedData.data[0][keyName] = assetResponse.data[key]
                setMediaData(updatedData);

            } else {
                await getFetchMediaDataWithMediaId("blog")
            }

            setEditAsset(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    editing: false,
                    loading: false,
                }
            }));
        } catch (error) {
            console.error(error);
        } finally {
            loadingCounter.current -= 1;
            if (loadingCounter.current === 0) {
                setLoading(false);
            }
        }
    }



    const handleSaveContent = async () => {
        if (!editorRef.current) return;
        loadingCounter.current += 1;
        setEditAsset(prev => ({
            ...prev,
            content: { ...prev.content, loading: true }
        }));
        setLoading(true);
        try {

            const markdown = await editorRef.current.getMarkdown();

            await createOrUpdate(
                { blog_id: item.id, generated_content: markdown },
                "PUT",
                regenerateBlogPrompts
            );
            await getFetchMediaDataWithMediaId("blog")

            // turn off editing mode
            setEditAsset(prev => ({
                ...prev,
                content: { ...prev.content, editing: false, loading: false, }
            }));
        }
        catch (error) {
            console.error(error);

        } finally {
            loadingCounter.current -= 1;
            if (loadingCounter.current === 0) {
                setLoading(false);
            }
        }
    }



    useEffect(() => {
        return () => {
            if (thumbnailImage) URL.revokeObjectURL(img);
        };
    }, [thumbnailImage]);

    return (
        <Fragment>
            <ImageDisplayModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                imageUrl={modalImageUrl}
                mode={modalMode}
                onApprove={handleApproveUpload}
                isUploading={isUploading}
            />
            <section
                id="workspace-panel"
                className="col-span-8 bg-white rounded-2xl shadow-soft p-8 flex flex-col"
            >

                {/* Blog Assets Content */}
                <div id="blog-assets-content" className="flex-1 space-y-6 overflow-y-auto">
                    {/* Blog Title Asset Card */}
                    <div
                        id="title-asset-card"
                        className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-soft"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-700">Title Asset</h3>
                            <div className="">
                                {
                                    editAsset.title.editing ?
                                        <div className="flex w-full  justify-between gap-4">
                                            <button
                                                onClick={() => regenerateAsset({ blog_id: mediaData.data[0].id, generated_title: editAsset.title.editAsset }, "PUT", "title")}
                                                className="px-4 py-1 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] p-2 text-white rounded-lg flex items-center gap-1">
                                                <FaSave /> Save
                                            </button>
                                            <button
                                                onClick={() => { setEditAsset((prev) => ({ ...prev, title: { ...prev.title, editing: false } })); }}
                                                className="px-4 py-1 bg-white border rounded-lg text-gray-700">
                                                Cancel
                                            </button>
                                        </div> :
                                        <div className="flex w-full  justify-between gap-4">
                                            <button
                                                onClick={() => setEditAsset((prev) => ({ ...prev, title: { ...prev.title, editing: true } }))}
                                                className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                                                <FaEdit className="inline mr-1" /> Edit
                                            </button>
                                            <button
                                                disabled={editAsset.title.loading}
                                                onClick={() => regenerateAsset({ blog_id: mediaData.data[0].id, title_prompt: item?.title_prompt }, "PATCH", "title")}
                                                className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1"
                                            >
                                                <FaSync /> Text
                                            </button>
                                        </div>
                                }


                            </div>
                            {/* <div className="flex items-center space-x-1.5 text-green-500 text-xs font-medium">
                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                            <span>Ready</span>
                        </div> */}
                        </div>
                        <Fragment>
                            {
                                editAsset?.title?.loading ?
                                    <div className="w-full px-4 py-3  flex justify-center items-center bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                        <FaSpinner className="animate-spin" />

                                    </div> : editAsset.title.editing ?
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value={editAsset.title.editAsset}
                                                onChange={(e) => setEditAsset((prev) => ({
                                                    ...prev,
                                                    title: {
                                                        ...prev.title,
                                                        editAsset: e.target.value
                                                    }

                                                }))}

                                                // defaultValue="10 AI Tools to Supercharge Your Workflow in 2025"
                                                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200"
                                            />

                                        </div> :

                                        <div className="w-full px-4 py-3  bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                            {mediaData?.data[0]?.generated_title}

                                        </div>

                            }


                        </Fragment>
                    </div>
                    {/* Blog Description Asset Card */}
                    <div
                        id="description-asset-card"
                        className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-soft"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-700">
                                Description Asset
                            </h3>
                            <div className="">
                                {
                                    editAsset.description.editing ?
                                        <div className="flex w-full  justify-between gap-4">
                                            <button
                                                onClick={() => regenerateAsset({ blog_id: mediaData.data[0].id, generated_description: editAsset.description.editAsset }, "PUT", "description")}
                                                className="px-4 py-1 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] p-2 text-white rounded-lg flex items-center gap-1">
                                                <FaSave /> Save
                                            </button>
                                            <button
                                                onClick={() => { setEditAsset((prev) => ({ ...prev, description: { ...prev.description, editing: false } })); }}
                                                className="px-4 py-1 bg-white border rounded-lg text-gray-700">
                                                Cancel
                                            </button>
                                        </div> :
                                        <div className="flex w-full  justify-between gap-4">
                                            <button
                                                onClick={() => setEditAsset((prev) => ({ ...prev, description: { ...prev.description, editing: true } }))}
                                                className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                                                <FaEdit className="inline mr-1" /> Edit
                                            </button>
                                            <button
                                                disabled={editAsset.description.loading}
                                                onClick={() => regenerateAsset({ blog_id: mediaData.data[0].id, description_prompt: editAsset.description.editAsset }, "PATCH", "description")}
                                                className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1"
                                            >
                                                <FaSync /> Text
                                            </button>
                                        </div>
                                }


                            </div>
                            {/* <div className="flex items-center space-x-1.5 text-green-500 text-xs font-medium">
                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                            <span>Ready</span>
                        </div> */}
                        </div>
                        <Fragment>
                            {
                                editAsset?.description?.loading ?
                                    <div className="w-full px-4 py-3  flex justify-center items-center bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                        <FaSpinner className="animate-spin" />

                                    </div> : editAsset.description.editing ?
                                        <div className="flex space-x-3">
                                            <textarea
                                                rows={3}
                                                onChange={(e) => setEditAsset((prev) => ({
                                                    ...prev,
                                                    title: {
                                                        ...prev.description,
                                                        editAsset: e.target.value
                                                    }

                                                }))}
                                                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none"
                                                value={mediaData?.data[0]?.generated_description}
                                            />

                                        </div>

                                        :

                                        <div className="w-full px-4 py-3  bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                            {mediaData?.data[0]?.generated_description}

                                        </div>

                            }


                        </Fragment>

                    </div>


                    {/* Thumbnail Asset Card */}
                    <div
                        id="thumbnail-asset-card"
                        className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-soft"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-700">
                                Thumbnail Asset
                            </h3>
                            <div className="">
                                <div className="flex w-full  justify-between gap-4">
                                    <input type="file"
                                        ref={fileRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload({ blog_id: mediaData.data[0].id, thumbnail: e.target.files[0], path: manualUploadThumbnail }, e.target.files[0], e, setMediaData)} />
                                    <button
                                        onClick={() => {
                                            fileRef.current.click();
                                            // setEditAsset((prev) => ({ ...prev, thumbnail: { ...prev.thumbnail, editing: true } }))
                                        }}
                                        className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                                        <FaUpload className="inline mr-1" />
                                    </button>
                                    <button
                                        onClick={() => regenerateAsset({ blog_id: mediaData.data[0].id, thumbnail_prompt: item.thumbnail_prompt }, "PATCH", "thumbnail")}
                                        className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1"
                                    >
                                        <FaSync /> Image
                                    </button>
                                </div>
                            </div>

                            {/* <div className="flex items-center space-x-1.5 text-green-500 text-xs font-medium">
                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                            <span>Ready</span>
                        </div> */}
                        </div>
                        <Fragment>
                            {
                                editAsset?.thumbnail?.loading || item?.thumbnail == null ?
                                    <div className="w-full px-4 py-3  flex justify-center items-center bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                        <FaSpinner className="animate-spin" />
                                    </div> :
                                    <div
                                        onClick={!editAsset?.thumbnail?.loading && !!item?.thumbnail ? () => openImagePreview(item?.thumbnail) : undefined}
                                        className="h-64 bg-white border border-slate-300 rounded-xl mb-4 overflow-hidden">
                                        <Image
                                            className="w-full h-full object-cover"
                                            src={mediaData?.data[0]?.thumbnail}
                                            width={300}
                                            height={300}

                                        />
                                    </div>
                            }
                        </Fragment>

                    </div>
                    {/* Blog Content Asset Card */}
                    <div
                        id="content-asset-card"
                        className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-soft"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-700">Content Asset</h3>
                            <div className="">
                                {
                                    editAsset.content.editing ?
                                        <div className="flex w-full  justify-between gap-4">
                                            <button
                                                onClick={() => handleSaveContent()}
                                                className="px-4 py-1 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] p-2 text-white rounded-lg flex items-center gap-1">
                                                <FaSave /> Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditAsset((prev) => ({ ...prev, content: { ...prev.content, editing: false } }));
                                                    editorRef.current.resetContent();

                                                }
                                                }
                                                className="px-4 py-1 bg-white border rounded-lg text-gray-700">
                                                Cancel
                                            </button>
                                        </div> :
                                        <div className="flex w-full  justify-between gap-4">
                                            <button
                                                onClick={() => setEditAsset((prev) => ({ ...prev, content: { ...prev.content, editing: true } }))}
                                                className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                                                <FaEdit className="inline mr-1" /> Edit
                                            </button>
                                            <button
                                                disabled={editAsset.content.loading}
                                                onClick={() => regenerateAsset({ blog_id: mediaData.data[0].id, content_prompt: item?.content_prompt }, "PATCH", "content")}
                                                className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1"
                                            >
                                                <FaSync /> Text
                                            </button>
                                        </div>
                                }


                            </div>
                            {/* <div className="flex items-center space-x-1.5 text-blue-500 text-xs font-medium">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                <span>Processing</span>
                            </div> */}
                        </div>
                        {/* <div className="flex space-x-3">
                            <textarea
                                rows={12}
                                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none text-sm leading-relaxed"
                                readOnly=""
                                value={mediaData?.data[0]?.generated_content}
                            />
                            <button className="px-4 py-3 text-purple-600 font-medium rounded-xl border border-purple-300 hover:bg-purple-50 transition-all duration-200 self-start">
                                Re-generate Content
                            </button>
                        </div> */}
                        <Fragment>
                            {
                                editAsset?.content?.loading ?
                                    <div className="w-full px-4 py-3  flex justify-center items-center bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                        <FaSpinner className="animate-spin" />
                                    </div> :
                                    <div className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200  text-sm leading-relaxed">
                                        <MyEditor
                                            ref={editorRef}
                                            content={item?.generated_content}
                                            editing={editAsset?.content?.editing} />

                                    </div>
                            }
                        </Fragment>


                    </div>
                </div >
            </section >

        </Fragment>

    )

}








