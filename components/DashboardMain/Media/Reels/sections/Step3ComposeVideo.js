import { Fragment, useEffect, useState } from "react";
import RealEditor from "../../ReelsEditor";
import { FaArrowLeft, FaDownload, FaSync } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { MdDownload } from "react-icons/md";
import { CanvasStoreProvider } from "../../context/CanvasStoreContext";

import InstagramReelPostModal from "../../Modal/InstagramReelPostModal";

export default function Step3ComposeVideo({
  mediaData,
  order,
  selectedSlides,
  combining,
  setCurrentStep,
  combineVideo,
  moveOrder,
  toggleSelect,
  handleGenerateVideo,
  generateVideoStatus,
  videoData,
  setGenerateVideoStatus,
}) {
  const [showEditor, setShowEditor] = useState(!mediaData?.video_url);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    return () => {
      setGenerateVideoStatus(false);
      // Your code you want to run on unmount.
    };
  }, []);

  const handleEditClick = () => {
    setShowEditor(true);
  };

  return (
    <Fragment>
      {showEditor ? (
        <Fragment>
          {/* max-w-[50vw] relative mx-auto border border-red-700 z-[200] */}
          <div className="p-6 pb-[40px]">
            <div className="w-full">
              <div className="w-fit">
                <div className="mb-6 flex justify-end gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className=" min-w-[160px] min-h-[40px] bg-gray-100 border rounded-full text-gray-700 hover:bg-gray-200 transition flex flex-nowrap whitespace-nowrap items-center justify-center gap-2"
                  >
                    <FaArrowLeft className="inline mr-1" />
                    Back to asset
                  </button>
                  <button
                    disabled={generateVideoStatus}
                    onClick={handleGenerateVideo}
                    className="px-10 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50"
                  >
                    {generateVideoStatus ? (
                      <span className="flex items-center gap-2">
                        <LuLoaderCircle className="animate-spin text-xl" />{" "}
                        Generating Video...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FaSync /> Generate Video
                      </span>
                    )}
                  </button>
                  {mediaData?.video_url && generateVideoStatus == false && (
                    <Fragment>
                      <div className="flex flex-col items-center text-center ">
                        <a
                          href={mediaData?.video_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-lg shadow"
                        >
                          <FaDownload /> Download Video
                        </a>
                      </div>

                      <button
                        onClick={() => setShowPostModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-[#ff3a8c] to-[#6e3aff] text-white rounded-lg shadow"
                      >
                        Post to Instagram
                      </button>
                    </Fragment>
                  )}
                </div>
              </div>
              <CanvasStoreProvider  pageId="video-page" editor="video">
                <RealEditor ClipsData={mediaData} />
              </CanvasStoreProvider>
            </div>
          </div>
        </Fragment>
      ) : (
        // --- VIDEO PREVIEW MODE (with Tailwind) ---
        <div className="p-6  ">
          <div className="mb-6 flex justify-end gap-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="cursor-pointer min-w-[160px] min-h-[40px] bg-gray-100 border rounded-full text-gray-700 hover:bg-gray-200 transition flex flex-nowrap whitespace-nowrap items-center justify-center gap-2"
            >
              <FaArrowLeft className="inline mr-1" />
              <span>Back to asset</span>
            </button>
            {mediaData?.video_url && (
              <div className="flex flex-col items-center text-center ">
                <a
                  href={mediaData?.video_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-lg shadow"
                >
                  <FaDownload /> Download Video
                </a>
              </div>
            )}
            <div>
              <button
                onClick={handleEditClick}
                className="px-4 py-2  text-base font-semibold bg-gradient-to-r from-[#6e3aff] to-[#ff3a8c] text-white rounded-lg cursor-pointer transition-colors duration-200 hover:bg-[#7a1fca]"
              >
                Edit Again
              </button>
            </div>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#ff3a8c] to-[#6e3aff] text-white rounded-lg shadow"
            >
              Post to Instagram
            </button>
          </div>

          {/* 2. Styled Video Wrapper */}
          <div className="relative max-w-[600px] mx-auto mb-6 overflow-hidden rounded-xl shadow-lg">
            <video
              src={mediaData.video_url}
              controls
              className="block w-full max-h-[60vh] border border-gray-200 rounded-xl shadow-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      <InstagramReelPostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        reelId={mediaData?.id}
        onSuccess={() => console.log("Posted Successfully!")}
      />
    </Fragment>
  );
}
