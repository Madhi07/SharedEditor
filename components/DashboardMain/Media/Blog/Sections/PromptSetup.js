import { Fragment, useEffect, useMemo, useState } from "react"
import { FaArrowRight, FaEdit, FaSave, FaSync } from "react-icons/fa"
import { useMediaWorkflowContext } from "../../context/MediaWorkflowContext"
import { createOrUpdate } from "../../utils/apiFetchWrapper"
import { regenerateBlogPrompts } from "../../utils/apiPaths/reels"
import { FaSpinner } from "react-icons/fa6"
import copy from "deep-copy";
import { useRef } from "react"


export const PromptSetup = () => {
    const { mediaData, getFetchMediaDataWithMediaId,
        loading, setLoading,
    } = useMediaWorkflowContext()
    const [edit, setEdit] = useState(() => ({

        title: { editing: false, editedPrompt: mediaData?.data?.[0]?.title_prompt || "", loading: false },
        description: { editing: false, editedPrompt: mediaData?.data?.[0]?.description_prompt || "", loading: false },
        content: { editing: false, editedPrompt: mediaData?.data?.[0]?.content_prompt || "", loading: false },
        thumbnail: { editing: false, editedPrompt: mediaData?.data?.[0]?.thumbnail_prompt || "", loading: false }
    }));


    const item = useMemo(() => mediaData?.data?.[0], [mediaData]);

    useEffect(() => {
        if (!item) return;

        setEdit(prev => ({
            ...prev,
            title: { ...prev.title, editedPrompt: item.title_prompt },
            description: { ...prev.description, editedPrompt: item.description_prompt },
            content: { ...prev.content, editedPrompt: item.content_prompt },
            thumbnail: { ...prev.thumbnail, editedPrompt: item.thumbnail_prompt },
        }));
    }, [item?.title_prompt, item?.description_prompt, item?.content_prompt, item?.thumbnail_prompt]);



    useEffect(() => {
         getFetchMediaDataWithMediaId("blog")

    }, [])

    const loadingCounter = useRef(0);

    // updated the edited prompts
    const handleSavePrompts = async (payload, method, key) => {
        loadingCounter.current += 1;

        // per-key loading start
        setEdit(prev => ({
            ...prev,
            [key]: { ...prev[key], loading: true }
        }));

        // global loading start
        setLoading(true);

        try {
            const response = await createOrUpdate(payload, method, regenerateBlogPrompts, true);

            if (response.status === 200) {
                await getFetchMediaDataWithMediaId("blog");

                // per-key loading end (independent of other API calls)
                setEdit(prev => ({
                    ...prev,
                    [key]: { ...prev[key], editing: false, loading: false }
                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            loadingCounter.current -= 1;

            // global loading end only when ALL calls finish
            if (loadingCounter.current === 0) {
                setLoading(false);
            }
        }
    };


   


    return (
        <Fragment>
            <div id="prompt-setup-content" className="flex-1 space-y-6 ">
                {/* Blog Title Prompt Card */}
                <div
                    id="title-prompt-card"
                    className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-soft"
                >
                    <div className=" flex justify-between items-center h-full mb-3">

                        <label className="block  text-sm font-semibold text-slate-700 ">
                            Title Prompt
                        </label>
                        <div className="">
                            {
                                edit.title.editing ?
                                    <div className="flex w-full  justify-between gap-4">
                                        <button onClick={() => handleSavePrompts({ blog_id: mediaData.data[0].id, title_prompt: edit.title.editedPrompt }, "PUT", "title")}
                                            className="px-4 py-1 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] p-2 text-white rounded-lg flex items-center gap-1">
                                            <FaSave /> Save
                                        </button>
                                        <button onClick={() => { setEdit((prev) => ({ ...prev, title: { ...prev.title, editing: false } })); }} className="px-4 py-1 bg-white border rounded-lg text-gray-700">
                                            Cancel
                                        </button>
                                    </div> :
                                    <div className="flex w-full  justify-between gap-4">
                                        <button onClick={() => setEdit((prev) => ({ ...prev, title: { ...prev.title, editing: true } }))}
                                            className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                                            <FaEdit className="inline mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleSavePrompts(
                                                    {
                                                        blog_id: mediaData.data[0].id,
                                                        title_prompt: edit.title.editedPrompt
                                                    },
                                                    "PATCH",
                                                    "title"
                                                );

                                            }}
                                            className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1"
                                        >
                                            <FaSync /> Text
                                        </button>
                                    </div>
                            }

                        </div>
                    </div>
                    <Fragment>
                        {
                            edit.title.loading  ?
                                <div className="w-full px-4 py-3 min-h-[98px] flex justify-center items-center bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                    <FaSpinner className="animate-spin" />

                                </div> :

                                edit.title.editing ?
                                    <textarea
                                        rows={3}
                                        onChange={(e) => setEdit((prev) => ({
                                            ...prev,
                                            title: {
                                                ...prev.title,
                                                editedPrompt: e.target.value
                                            }
                                        }))}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none"
                                        placeholder="Generate an SEO-friendly blog title about the topic. Make it engaging, informative, and include relevant keywords to improve search visibility..."
                                        value={edit.title.editedPrompt}
                                    /> :
                                    <div className="w-full px-4 py-3 min-h-[98px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                        {mediaData?.data[0]?.title_prompt}

                                    </div>
                        }


                    </Fragment>
                </div>
                {/* Blog Description Prompt Card */}
                <div
                    id="description-prompt-card"
                    className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-soft"
                >
                    <div className=" flex justify-between items-center h-full mb-3">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Description Prompt
                        </label>
                        <div className="">
                            {
                                edit.description.editing ?
                                    <div className="flex w-full  justify-between gap-4">
                                        <button onClick={() => handleSavePrompts(
                                            {
                                                blog_id: mediaData.data[0].id,
                                                description_prompt: edit.description.editedPrompt
                                            },
                                            "PUT",
                                            "description"
                                        )
                                        }
                                            className="px-4 py-1 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] p-2 text-white rounded-lg flex items-center gap-1">
                                            <FaSave /> Save
                                        </button>
                                        <button onClick={() => setEdit((prev) =>
                                        ({
                                            ...prev,
                                            description: { ...prev.description, editing: false }
                                        }))}
                                            className="px-4 py-1 bg-white border rounded-lg text-gray-700">
                                            Cancel
                                        </button>
                                    </div> :
                                    <div className="flex w-full  justify-between gap-4">
                                        <button onClick={() => setEdit((prev) => ({ ...prev, description: { ...prev.description, editing: true } }))}
                                            className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                                            <FaEdit className="inline mr-1" /> Edit
                                        </button>
                                        <button onClick={() => handleSavePrompts({ blog_id: mediaData.data[0].id, description_prompt: edit.description.editedPrompt }, "PATCH", "description")} className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1">
                                            <FaSync /> Text
                                        </button>

                                    </div>


                            }

                        </div>

                    </div>

                    <Fragment>
                        {
                            edit.description.loading  ?
                                <div className="w-full px-4 py-3 min-h-[98px] flex justify-center items-center bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                    <FaSpinner className="animate-spin" /> </div> :
                                edit.description.editing ?
                                    <textarea
                                        onChange={(e) => setEdit((prev) => ({
                                            ...prev,
                                            description: {
                                                ...prev.description,
                                                editedPrompt: e.target.value
                                            }

                                        }))}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none"
                                        placeholder=""
                                        value={edit.description.editedPrompt}
                                        defaultValue={""}
                                    /> :
                                    <div className="w-full px-4 py-3 min-h-[98px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                        {mediaData?.data[0]?.description_prompt}

                                    </div>

                        }
                    </Fragment>

                </div>
                {/* Main Content Prompt Card */}
                <div
                    id="content-prompt-card"
                    className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-soft"
                >
                    <div className=" flex justify-between items-center h-full mb-3">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Blog Content Prompt
                        </label>
                        <div className="">
                            {
                                edit.content.editing ?
                                    <div className="flex w-full  justify-between gap-2">
                                        <button onClick={() => handleSavePrompts(
                                            {
                                                blog_id: mediaData.data[0].id,
                                                content_prompt: edit.content.editedPrompt
                                            },
                                            "PUT",
                                            "content"
                                        )
                                        }
                                            className="px-4 py-1 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] p-2 text-white rounded-lg flex items-center gap-1">
                                            <FaSave /> Save
                                        </button>
                                        <button onClick={() => setEdit((prev) =>
                                        ({
                                            ...prev,
                                            content: { ...prev.content, editing: false }
                                        }))}
                                            className="px-4 py-1 bg-white border rounded-lg text-gray-700">
                                            Cancel
                                        </button>
                                    </div> :
                                    <div className="flex w-full  justify-between gap-2">
                                        <button onClick={() => setEdit((prev) => ({
                                            ...prev,
                                            content: { ...prev.content, editing: true }
                                        }))}
                                            className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                                            <FaEdit className="inline mr-1" /> Edit
                                        </button>
                                        <button onClick={() => handleSavePrompts({
                                            blog_id: mediaData.data[0].id,
                                            content_prompt: edit.content.editedPrompt
                                        },
                                            "PATCH",
                                            "content"
                                        )}
                                            className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1">
                                            <FaSync /> Text
                                        </button>

                                    </div>


                            }

                        </div>

                    </div>
                    <Fragment>
                        {
                            edit.content.loading  ?
                                <div className="w-full px-4 py-3 min-h-[98px] flex justify-center items-center bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                    <FaSpinner className="animate-spin" /> </div> :
                                edit.content.editing ?
                                    <textarea
                                        onChange={(e) => setEdit((prev) => ({
                                            ...prev,
                                            content: {
                                                ...prev.content,
                                                editedPrompt: e.target.value
                                            }

                                        }))}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none"
                                        placeholder=""
                                        value={edit.content.editedPrompt}
                                        defaultValue={""}
                                    /> :
                                    <div className="w-full px-4 py-3 min-h-[98px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                        {mediaData?.data[0]?.content_prompt}

                                    </div>

                        }
                    </Fragment>
                </div>




                {/* Thumbnail Prompt Card */}
                <div
                    id="thumbnail-prompt-card"
                    className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-soft"
                >
                    <div className=" flex justify-between items-center h-full mb-3">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Thumbnail Image Prompt
                        </label>
                        <div className="">
                            {
                                edit.thumbnail.editing ?
                                    <div className="flex w-full  justify-between gap-2">
                                        <button onClick={() => handleSavePrompts(
                                            {
                                                blog_id: mediaData.data[0].id,
                                                thumbnail_prompt: edit.thumbnail.editedPrompt
                                            },
                                            "PUT",
                                            "thumbnail"
                                        )
                                        }
                                            className="px-4 py-1 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] p-2 text-white rounded-lg flex items-center gap-1">
                                            <FaSave /> Save
                                        </button>
                                        <button onClick={() => setEdit((prev) =>
                                        ({
                                            ...prev,
                                            thumbnail: { ...prev.thumbnail, editing: false }
                                        }))}
                                            className="px-4 py-1 bg-white border rounded-lg text-gray-700">
                                            Cancel
                                        </button>
                                    </div> :
                                    <div className="flex w-full  justify-between gap-2">
                                        <button onClick={() => setEdit((prev) => ({
                                            ...prev,
                                            thumbnail: { ...prev.thumbnail, editing: true }
                                        }))}
                                            className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                                            <FaEdit className="inline mr-1" /> Edit
                                        </button>
                                        <button onClick={() => handleSavePrompts({
                                            blog_id: mediaData.data[0].id,
                                            thumbnail_prompt: edit.thumbnail.editedPrompt
                                        },
                                            "PATCH",
                                            "thumbnail"
                                        )}
                                            className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1">
                                            <FaSync /> Text
                                        </button>

                                    </div>


                            }

                        </div>


                    </div>
                    <Fragment>
                        {
                            edit.thumbnail.loading  ?
                                <div className="w-full px-4 py-3 min-h-[98px] flex justify-center items-center bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                    <FaSpinner className="animate-spin" /> </div> :
                                edit.thumbnail.editing ?
                                    <textarea
                                        onChange={(e) => setEdit((prev) => ({
                                            ...prev,
                                            thumbnail: {
                                                ...prev.thumbnail,
                                                editedPrompt: e.target.value
                                            }

                                        }))}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none"
                                        placeholder=""
                                        value={edit.thumbnail.editedPrompt}
                                        defaultValue={""}
                                    /> :
                                    <div className="w-full px-4 py-3 min-h-[98px] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none">
                                        {mediaData?.data[0]?.thumbnail_prompt}

                                    </div>

                        }
                    </Fragment>
                </div>




                <button className="px-6 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-xl shadow-lg">
                    Proceed to Next <FaArrowRight className="inline ml-1" />
                </button>
            </div>

        </Fragment>

    )
}