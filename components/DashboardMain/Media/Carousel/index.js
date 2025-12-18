import { Fragment, useEffect } from "react";
import CreateSection from "../CreateVideoSection";
import MediaHistoryPanel from "../MediaHistoryPanel";
import ChatPanel from "../Reels/sections/ChatPanel";
import { MediaStateProvider, useMediaState } from "../context/MediaStateContext";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import { CarsouselPrompt } from "./sections/PromptSetup";
import { useMediaHistory } from "../context/MediaHistoryContext";
import { CarouselSlidesAsset } from "./sections/GenerateAsset";
import { ThemeSelector } from "./sections/Theme";

export default function CarouselGenerator() {

  const router = useRouter()

  const { showChat, setShowChat,
    mediaData,
    currentStep, setCurrentStep
  } = useMediaState()

    const {  getFetchMediaDataWithMediaId } = useMediaHistory()

  useEffect(() => {
          getFetchMediaDataWithMediaId("carousel")
      }, []);

  const { step } = router.query


  console.log("the show Chat", showChat)

  useEffect(() => {
    console.log(router.query)
    if (step != undefined) {
      setShowChat(false)
    }


  }, [step])



  return (
    <main id="main-content" className="flex flex-1 ">
      <MediaHistoryPanel />

      {showChat ? (
        <Fragment>
          <CreateSection />
        </Fragment>) : (
        <section id="center-panel" className="flex-1 bg-white p-8 overflow-y-auto">
          <div id="stepper" className="flex justify-center mb-8">
            <Fragment>

              <div className="w-[inherit] p-6 border-b border-gray-100 flex items-center gap-6">
                {["Prompt", "Theme", "Asset", "Preview"].map((data, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 rounded-xl transition duration-300 ease-in-out 
                    cursor-pointer`}
                  >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm border border-current">
                        {index + 1}
                      </div>
                      <div className="text-sm font-semibold">
                        {data}
                      </div>
                    </div>
                  </div>
                ))}
                {currentStep !== 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 bg-gray-100 border rounded-xl text-gray-700 hover:bg-gray-200 transition flex flex-nowrap whitespace-nowrap items-center justify-center gap-2">
                    <FaArrowLeft className="inline mr-1" /> Back to Prompts
                  </button>
                )}

              </div>

            </Fragment>
          </div>
          {
            step == 1 ?
            <CarsouselPrompt /> :
            step == 2 &&
            <ThemeSelector/>


          }

        </section>)}

    </main>

  )


}