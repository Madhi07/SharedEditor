import { Fragment } from "react"
import { useMediaWorkflowContext } from "../context/MediaWorkflowContext"
import MediaHistoryPanel from "../MediaHistoryPanel"
import ChatPanel from "../Reels/sections/ChatPanel"
import { blogsPromptGeneratePath } from "../utils/apiPaths/reels"
import { stepBadgeClass } from "../utils/helpers"
import { FaArrowLeft } from "react-icons/fa6"
import { PromptSetup } from "./Sections/PromptSetup"
import { GenerateAssets } from "./Sections/GenerateAssets"
import { PreviewBlog } from "./Sections/PreviewBlog"
import { useRouter } from "next/router"

export const BlogGenerator = () => {
    const {
        mediaData, setMediaData,
        prompt, setPrompt,
        numSlides, setNumSlides,
        chats, setChats,
        loading, setLoading,
        showChat, setShowChat,
        currentStep, setCurrentStep,
        generatingPrompt, setGeneratingPrompt,
        fetchMediaData, generatePrompt, clearAll,
        getFetchMediaDataWithMediaId
    } = useMediaWorkflowContext()

    const router = useRouter()
    const { step } = router?.query;
    return (
        <main className="flex flex-1 ">
            <MediaHistoryPanel />


            <section
                id="workspace-panel"
                className="col-span-8 flex-1 max-h-[calc(100vh-120px)] h-full min-h-[calc(100vh-100px)] overflow-x-hidden overflow-y-auto  bg-white p-8 "
            >
                {/* Top Navigation */}
                <div
                    id="workspace-header"
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center space-x-6 border-gray-100 ">
                        {
                            ["Prompt Setup", "Generate Assets", "Preview Blog"].map((item, index) => (
                                <Fragment>
                                    <div
                                        onClick={() => {
                                            setCurrentStep(index + 1); router.push({
                                                pathname: router.pathname,
                                                query: {
                                                    ...router.query,
                                                    step: index + 1
                                                }
                                            });
                                        }}
                                        key={index}
                                        className={`px-4 py-2 rounded-xl transition duration-300 ease-in-out  bg-slate-100 text-gray-500 hover:bg-white border border-gray-300
                                            cursor-pointer`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm border border-current">
                                                {index + 1}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {item}
                                            </div>

                                        </div>
                                    </div>

                                </Fragment>

                            ))
                        }

                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="px-4 py-2 bg-gray-100 border rounded-xl text-gray-700 hover:bg-gray-200 transition">
                            <FaArrowLeft className="inline mr-1" />
                        </button>
                    </div>

                </div>
                {/* Prompt Setup Cards */}
                {
                    step==undefined || step == "1" ? (
                        <PromptSetup />
                    ) : step == "2" ? (
                        <GenerateAssets />
                    ) : step == "3" && (
                        <PreviewBlog />
                    ) 
                }

                {/* Bottom Action Buttons */}
                {/* <div
                    id="action-buttons"
                    className="flex items-center justify-end space-x-4 mt-8 pt-6  border-slate-200"
                >
                    <button className="px-6 py-2.5 text-slate-600 font-medium rounded-xl border border-slate-300 hover:bg-slate-50 transition-all duration-200">
                        Cancel
                    </button>
                    <button className="text-white font-semibold px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-purple-500/20">

                        Save Prompts
                    </button>
                </div> */}
            </section>
            {(currentStep == 1 && <ChatPanel
                chats={chats}
                prompt={prompt}
                onPromptChange={(e) => setPrompt(e.target.value)}
                onPromptSubmit={() => generatePrompt({ query: prompt }, blogsPromptGeneratePath, "blog")}
            // onKeyDown={handleKeyDown}
            />)}
        </main>

    )
}