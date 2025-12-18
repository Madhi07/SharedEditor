import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import AvatarViewer from "../Avatar/AvatarViewer";
import { AnimateWave } from "../Animations/AnimateWave";
import { FaMicrophone, FaTimes } from "react-icons/fa";
import { LANGUAGE_CODES } from "@/constants";
import useSocket from "@/hooks/useSocket";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { createOrUpdate } from "@/utils/fetchUtils";
import { chatbotRoomApiPath } from "@/constants/apiPaths";
import { v4 as uuidv4 } from 'uuid';

const loaderSteps = [
    "Your AI Agent is getting ready...",
    "Loading insights from Marketing, Sales, Testing, Analytics & Support...",
    "Calibrating smart responses...",
    "Connecting across every channel...",
    "Analyzing data for real-time answers...",
    "Preparing your 3D AI Assistant to join...",
    "Almost there — your AI Agent will be live in just a moment!"
];

export default function WelcomeAvatar({ onClickClose }) {


    const [animationName, setAnimationName] = useState("standing");
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_CODES[0]);
    const { connect, disconnect, sendMessage, socketData, connected, } = useSocket();
    const { isRecording, isListening, startRecording, stopRecording } = useAudioRecorder(sendMessage, connected);
    const { enqueueChunk, play, stop, isPlaying, audioCtxRef, referenceTimestamp } = useAudioPlayer();
    const [roomData, setRoomData] = useState({});
    const [chatId, setChatId] = useState(null);

    const [containerResMsg, setContainerResMsg] = useState({
        status: null,
        message: null
    });


    useEffect(() => {

        initialRequirements();

    }, []);


    const initialRequirements = async () => {

        const roomPayload = {
            chatbot: "",
            title: document.title || uuidv4()
        }
        await createChatbotRoom(roomPayload);

    }

    const createChatbotRoom = async (payload = {}) => {
        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", chatbotRoomApiPath, false);

        let resData;

        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status === 200 || res?.status === 201) {
            setRoomData(resData);
            setChatId(resData?.id)
            return resData;
        }


        if (res?.status >= 400 && res?.status < 500) {

            setContainerResMsg(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Something went wrong with your request. Please check and try again."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setContainerResMsg(prev => ({
                ...prev,
                status: "err5xx",
                message: resData?.message || "Server error occurred. Please try again shortly."
            }));
            return false;
        }
    }


    return (
        <Dialog open={true} onClose={() => null} className="relative z-20">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-dark-bg-secondary/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center p-6 text-center items-center">
                    <DialogPanel
                        transition
                        className="flex w-full relative transform shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="mx-auto shadow-card flex flex-col w-full max-w-[400px] h-[580px]">
                            <button
                                className="bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600 transition-colors w-max ml-auto mb-2 cursor-pointer"
                                onClick={onClickClose}
                            >
                                <FaTimes />
                            </button>
                            <div className="flex flex-1 flex-col bg-dark-card-primary rounded-2xl overflow-hidden relative ">
                                <div className="flex-1 relative">
                                    <AvatarViewer
                                        avatarId={"7decd359-1b69-4749-a2f1-4e9edc295ebe"}
                                        avatarPath={"https://agentzee-prod-bucket.s3.us-east-1.amazonaws.com/assets/agent/chatbot/avatars/7decd359-1b69-4749-a2f1-4e9edc295ebe/prem.glb"}
                                        avatarThumbnail={"https://agentzee-prod-bucket.s3.us-east-1.amazonaws.com/assets/agent/chatbot/avatars/7decd359-1b69-4749-a2f1-4e9edc295ebe/prem_avatar_preview.png"}
                                        animationName={animationName}
                                        scale={1.3}
                                        loaderSteps={loaderSteps}
                                    // blendFramesRef={blendFramesRef}
                                    // audioCtxRef={audioCtxRef}
                                    // referenceTimestamp={referenceTimestamp}
                                    />

                                    <select
                                        onChange={(e) => setSelectedLanguage(JSON.parse(e.target.value))}
                                        value={JSON.stringify(selectedLanguage)}
                                        className="absolute top-4 left-4 p-2 bg-dark-card-primary text-sm border border-dark-border-primary rounded-lg capitalize cursor-pointer outline-none focus:ring-1 focus:ring-secondary"
                                    >
                                        {LANGUAGE_CODES.map((lang, index) => (
                                            <option
                                                key={index}
                                                value={JSON.stringify(lang)}
                                                className="capitalize"
                                            >
                                                {lang.language}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        // onClick={!isRecording ? handleStart : handleStop}
                                        type="button"
                                        className="absolute z-10 top-0 right-0 w-16 h-16 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center rounded-bl-full shadow-lg hover:opacity-80 transition"
                                    >
                                        {/* {isRecording ?
                                    <AnimateWave animate={isListening} bgColor="bg-white" rootClass="mb-4 ml-4" /> :
                                } */}
                                        <FaMicrophone className="size-6 mb-4 ml-2" />
                                    </button>
                                </div>
                                <div className="p-6 w-full h-[20%] block overflow-y-auto text-center text-dark-text-primary font-[500] transition-all duration-300 ease-in-out">

                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
