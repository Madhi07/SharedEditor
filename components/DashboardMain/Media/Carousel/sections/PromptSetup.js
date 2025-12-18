import { FaEdit, FaSave, FaSync } from "react-icons/fa"
import { useMediaState } from "../../context/MediaStateContext"
import { Fragment, useEffect, useMemo, useState } from "react"
import { updateSlides } from "../../utils/apiPaths/carousel"
import { createOrUpdate } from "../../utils/apiFetchWrapper"
import { getPath } from "../../utils/path"

export const CarsouselPrompt = () => {
  const {
    mediaData,
    currentStep, setCurrentStep
  } = useMediaState()

  const [editPrompt, setEditPrompt] = useState([]);


  useEffect(() => {
    setEditPrompt(() =>
      mediaData?.slides.map((slide, index) => ({
        slide: index + 1,
        slideId: slide.id,
        edit: false,
        imagePrompt: slide.image_prompt
      })))

  }, [mediaData])



  const handleUpdate = async (payload, subcategory,id, ) =>{
    if(!payload || !id) return 
    const path = getPath(subcategory, "UPDATE_SLIDE", id)
    const response = await createOrUpdate(payload, "PATCH", path, true);
    console.log("the response", response)

  }













  return (
    <div id="step-1-content" className="space-y-7  h-[calc(100vh-200px)] overflow-y-auto">
      {
        mediaData?.slides?.map((slide, index) => (
          <Fragment>
            {/* Step 1 Cards */}
            <div
              id="!"
              className="bg-white p-5 rounded-card shadow-card transition-shadow duration-200 hover:shadow-hover-elevated"
            >
              <div className="flex w-full justify-between items-start">

                <h3 className="text-base font-medium text-dark-text w-full">
                  Slide {index + 1}: {slide?.subtitle}
                </h3>
                {
                  editPrompt?.[index]?.edit ?
                    <div className="flex w-full  justify-end gap-4">
                      <button
                        onClick={()=>handleUpdate({image_prompt:editPrompt?.[index]?.imagePrompt},"carousel", editPrompt?.[index]?.slideId )}
                        className="px-4 py-1 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] p-2 text-white rounded-lg flex items-center gap-1">
                        <FaSave /> Save
                      </button>
                      <button
                        onClick={() =>
                          setEditPrompt((prev) => {
                            const copyData = structuredClone(prev)
                            copyData[index].edit = false
                            return copyData

                          })
                        }

                        className="px-4 py-1 bg-white border rounded-lg text-gray-700">
                        Cancel
                      </button>
                    </div> :
                    <div className="flex w-full  justify-end gap-3 ">
                      <button
                        onClick={() =>
                          setEditPrompt((prev) => {
                            const copyData = structuredClone(prev)
                            console.log("the copyData", copyData)
                            copyData[index].edit = true
                            return copyData

                          })
                        }
                        className="px-3 py-1 bg-gray-100 border rounded-lg flex items-center gap-1">
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button
                        className="px-3 py-1 border border-[#ff3a8c] text-[#ff3a8c] rounded-lg flex items-center gap-1"
                      >
                        <FaSync /> Image Prompt
                      </button>
                    </div>
                }


              </div>
              <div className="mt-4">
                <label className="text-xs font-medium text-light-text tracking-widest">
                  IMAGE PROMPT
                </label>
                <div className="mt-2 bg-panel-gray border border-border-gray rounded-input p-3 focus-outline transition-all duration-200">
                  {
                    editPrompt?.[index]?.edit ?
                      <textarea
                        className="w-full bg-transparent border-none outline-none resize-none text-sm text-medium-text"
                        rows={3}
                        onChange={(e) => setEditPrompt((prev) => {
                          const copyData = structuredClone(prev)
                          copyData[index].imagePrompt = e.target.value
                          return copyData

                        })}
                        value={editPrompt?.[index]?.imagePrompt}

                      /> :
                      <p className="min-h-10 w-full bg-transparent border-none outline-none resize-none text-sm text-medium-text">
                        {slide?.image_prompt}
                      </p>
                  }
                </div>
              </div>
            </div>

          </Fragment>

        ))
      }


    </div>
  )

}