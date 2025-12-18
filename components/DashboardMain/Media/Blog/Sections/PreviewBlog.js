import { useEffect, useMemo } from "react"
import MyEditor from "../editor"
import { useMediaWorkflowContext } from "../../context/MediaWorkflowContext"

export const PreviewBlog = () => {
    const { mediaData, getFetchMediaDataWithMediaId,
            loading, setLoading, setMediaData,
        } = useMediaWorkflowContext()

    const item = useMemo(() => mediaData?.data?.[0], [mediaData]);

//   useEffect(() => {
//         getFetchMediaDataWithMediaId("Id")

//     }, [])


    return(

    <section
        id="workspace-panel"
        className="col-span-8 bg-white rounded-2xl shadow-soft p-8 flex flex-col"
    >
        <div id="blog-preview" className="flex-1 space-y-6 overflow-y-auto">
            <div
                id="preview-card"
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-soft"
            >
                <div className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200  text-sm leading-relaxed">
                   
                    <MyEditor
                    content={item?.generated_content} 
                     editing={false} />

                </div>

            </div>

        </div>

    </section>
    )
}