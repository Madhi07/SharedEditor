import { AnimateWave } from "@/components/Animations/AnimateWave";
import AvatarViewer from "@/components/Avatar/AvatarViewer";
import LanguageSelector from "@/components/LandingPage/DemoAvatarSection/LanguageSelector";
import RenderChatMessage from "@/components/LandingPage/DemoAvatarSection/RenderChatMessage";
import { animationsToggles, LANGUAGE_CODES } from "@/constants";
import { avatarModelsApiPath, chatbotBotApiPath, chatbotRoomApiPath, websocketVoiceApiPath } from "@/constants/apiPaths";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useSocket from "@/hooks/useSocket";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { v4 as uuidv4 } from 'uuid';

export default function TryNowPage() {

    const router = useRouter();
    const { connect, disconnect, sendMessage, socketData, connected, } = useSocket();
    const { isRecording, isListening, startRecording, stopRecording } = useAudioRecorder(sendMessage, connected);
    const { enqueueChunk, play, stop, isPlaying, audioCtxRef, referenceTimestamp } = useAudioPlayer();

    const [chatbotAvatars, setChatbotAvatars] = useState([]);
    const [roomData, setRoomData] = useState({});
    const [chatId, setChatId] = useState(null);

    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_CODES[0]);

    const [chatMessages, setChatMessages] = useState("");

    const [animationName, setAnimationName] = useState("relaxing");

    const [resMessages, setResMessages] = useState({
        status: "loading",
        message: null
    });

    const [containerResMsg, setContainerResMsg] = useState({
        status: null,
        message: null
    });

    const blendFramesRef = useRef([]);


    useEffect(() => {

        if (!router.isReady) return;

        initialRequirements();

        const widgetRoot = document.getElementById("agentzee-widget-root");

        if (widgetRoot) {
            widgetRoot.style.display = "none";
            return () => widgetRoot.style.display = "block";
        }


    }, [router.isReady]);


    useEffect(() => {
        handleUpdateChatMessages();
    }, [socketData, connected]);


    useEffect(() => {
        if (!isPlaying) {
            setAnimationName("standing");
            // blendFramesRef.current = [];
            const timeout = setTimeout(() => {
                setChatMessages("");
                // blendFramesRef.current = [];
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [isPlaying]);


    const handleUpdateChatMessages = async () => {
        if (connected && socketData?.transcript) {
            setChatMessages(socketData?.transcript);

            if (socketData?.is_final) {
                const payload = {
                    question: chatMessages,
                    chat_id: chatId,
                    agent_id: router.query?.["agent-id"] || process.env.WIDGET_AGENT_ID,
                    chat_mode: "voice",
                    language: selectedLanguage?.language_only_code,
                    avatar_id: router?.query?.['avatar-id'] || chatbotAvatars?.[0]?.id
                };

                await postChatbot(payload)
            }
        }
    }


    const initialRequirements = async () => {
        const avatarsData = await getChatbotAvatars();
        if (avatarsData) {
            setResMessages(prev => ({
                ...prev,
                status: null,
                message: null
            }));

            const roomPayload = {
                agent: router.query?.["agent-id"] || process.env.WIDGET_AGENT_ID,
                title: document.title || uuidv4()
            }
            await createChatbotRoom(roomPayload);

        }
    }

    const getChatbotAvatars = async () => {
        const res = await retrieveOrRemove("GET", avatarModelsApiPath, false);

        let resData;

        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status === 200) {
            setChatbotAvatars(resData);
            return resData;
        }


        if (res?.status >= 400 && res?.status < 500) {

            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Something went wrong with your request. Please check and try again."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: resData?.message || "Server error occurred. Please try again shortly."
            }));
            return false;
        }
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


    const postChatbot = async (payload = {}) => {
        if (Object.values(payload).length === 0) return;

        let isReaderResText = false;
        let createNewAudio = true;




        const res = await fetch(`${process.env.API_URL}${chatbotBotApiPath}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {

            if (res?.status >= 400 && res?.status < 500) {

                setContainerResMsg(prev => ({
                    ...prev,
                    status: "err4xx",
                    message: "Something went wrong with your request. Please check and try again."
                }));
                return false;
            }

            if (res?.status >= 500) {
                setContainerResMsg(prev => ({
                    ...prev,
                    status: "err5xx",
                    message: "Server error occurred. Please try again shortly."
                }));
                return false;
            }
        }
        else {
            try {
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";

                const readStream = async () => {
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                            console.log("Stream finished!");
                            break;
                        }

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop(); // Keep last partial line

                        for (const line of lines) {
                            if (!line.startsWith('response: ')) continue;

                            try {
                                const jsonStr = line.slice(10);
                                const parsed = JSON.parse(jsonStr);
                                const responseData = parsed ? parsed.data : null;

                                switch (parsed.type) {
                                    case "metadata":
                                        setChatId(responseData.chat_id);
                                        break;

                                    case "text":
                                        if (!isReaderResText) {
                                            isReaderResText = true;
                                            setChatMessages(responseData.text);
                                        }
                                        else {
                                            setChatMessages(prev =>
                                                prev ? `${prev} ${responseData.text}` : responseData.text
                                            );
                                        }
                                        break;

                                    case "audio_chunk":
                                        setAnimationName('talking');
                                        // setAnimationName('talking-action');
                                        enqueueChunk(responseData.audio);
                                        break;

                                    case "animation_frame":
                                        convertIntoFrames(responseData);
                                        break;

                                    default:
                                        console.warn("Unknown type:", parsed.type);
                                }

                            } catch (err) {
                                console.warn("JSON parse error:", err.message, line);
                            }
                        }
                    }
                };

                await readStream();
            } catch (e) {
                console.error("Streaming failed", e);
            }
        }

    }

    const convertIntoFrames = (data) => {
        const frameIndex = blendFramesRef.current.length;
        const frameJsonData = { frameIndex, timeCode: data.time_code };
        Object.entries(data.blendshapes || {}).forEach(([key, val]) => frameJsonData[`blendShapes.${key}`] = val);
        Object.entries(data.emotions || {}).forEach(([key, val]) => frameJsonData[`emotions.${key}`] = val);

        blendFramesRef.current.push(frameJsonData);
    };


    const handleStart = async () => {
        if (!connected) {
            const path = websocketVoiceApiPath.replace("<roomId>", roomData?.roomId)
            await connect(`${process.env.BASE_WS_DOMAIN}${path}?lang_code=${selectedLanguage?.prominent_code}`);
        }
        setAnimationName("standing")
        startRecording();
    };

    const handleStop = () => {
        setAnimationName("relaxing")
        setChatMessages("")
        stopRecording();
        disconnect();
    };

    const handleLanguageChange = (data = {}) => {

        if (Object.values(data).length === 0) return;

        handleStop();
        setSelectedLanguage(data);
    }


    const avatarData = useMemo(() => {
        return chatbotAvatars.find(item => item.id === router?.query?.['avatar-id']) || chatbotAvatars[0];
    }, [router?.query?.['avatar-id'], chatbotAvatars]);

    return (
        <div className="w-screen h-screen overflow-hidden relative">

            {resMessages?.status === "loading" ? (
                <div className="w-full h-full flex items-center justify-center">
                    <LuLoaderCircle className="text-primary size-10 animate-spin" />
                </div>
            ) : (
                <Fragment>
                    {avatarData?.three_d_file_url && (
                        <AvatarViewer
                            avatarId={avatarData?.id}
                            avatarPath={avatarData?.three_d_file_url}
                            avatarThumbnail={avatarData?.avatar_preview_image_url}
                            animationName={animationName}
                            blendFramesRef={blendFramesRef}
                            audioCtxRef={audioCtxRef}
                            referenceTimestamp={referenceTimestamp}
                        />
                    )}
                    <div className="inline-flex items-center gap-2 absolute top-4 left-4 z-10">
                        <LanguageSelector
                            selectedLanguage={selectedLanguage}
                            setSelectedLanguage={handleLanguageChange}
                        />
                    </div>

                    <div className="absolute z-10 bottom-[10%] left-1/2 -translate-x-1/2 max-w-3xl h-[30%] w-full transition-all duration-300 overflow-y-auto p-6 flex items-center justify-center no-scrollbar text-white text-2xl font-[500]">
                        <RenderChatMessage
                            message={chatMessages}
                        />
                    </div>

                    <div id="animation-toggles" className="absolute top-1/2 -translate-y-1/2 z-10 right-4 flex flex-col gap-4">
                        {animationsToggles.map((toggle, index) => (
                            <button
                                key={index}
                                onClick={() => setAnimationName(toggle?.name)}
                                className={clsx("relative group w-12 h-12 flex items-center justify-center text-white bg-gradient-to-r from-primary to-secondary rounded-full ring-offset-2 ring-offset-dark-bg-primary ring-primary",
                                    animationName === toggle.name ? "ring-2" : "hover:opacity-80"
                                )}
                            >
                                <toggle.icon className="size-6" />
                                <span className="bg-dark-card-primary rounded-lg text-white absolute p-2 w-max text-sm group-hover:block hidden right-16 border border-dark-border-primary">
                                    {toggle.text}
                                </span>
                            </button>
                        ))}
                    </div>


                    <button
                        onClick={!isRecording ? handleStart : handleStop}
                        type="button"
                        className="absolute z-10 top-0 right-0 w-20 h-20 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center rounded-bl-full shadow-lg hover:opacity-80 transition"
                    >
                        {isRecording ?
                            <AnimateWave animate={isListening} bgColor="bg-white" rootClass="mb-4 ml-4" /> :
                            <FaMicrophone className="size-8 mb-4 ml-4" />
                        }
                    </button>
                </Fragment>
            )}
        </div>
    )
}

