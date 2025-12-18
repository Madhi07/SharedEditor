import { Fragment, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { FaArrowDown, FaArrowUp, FaFileAudio, FaMicrophone, FaPlay, FaTrash, FaUpload } from "react-icons/fa";
import { FaCloudArrowUp, FaRegCircleStop } from "react-icons/fa6";
import { LuRabbit, LuTurtle } from "react-icons/lu";

export default function VoiceCustomize({ data = {}, updateData, chatbotVoices = [], avatarStyles = [] }) {

    const [voicePlay, setVoicePlay] = useState({
        audio_url: "",
        isPlaying: false
    });
    const audioRef = useRef(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const selectedAvatarStyle = avatarStyles.find(style => style.id === data?.avatar?.avatar);

    const voicesData = chatbotVoices.filter(voice => voice?.ethnicity === selectedAvatarStyle?.ethnicity);

    const handleClickVoicePlayStop = (audio_url = "") => {
        if (!audio_url) return;

        // Create new Audio if not exists or URL changed
        if (!audioRef.current || audioRef.current.src !== audio_url) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            audioRef.current = new Audio(audio_url);

            // Reset state on audio end
            audioRef.current.addEventListener("ended", () => {
                setVoicePlay({
                    audio_url: "",
                    isPlaying: false
                });
            });
        }

        const audio = audioRef.current;

        if (audio.paused) {
            audio.play();
            setVoicePlay({
                audio_url,
                isPlaying: true
            });
        } else {
            audio.pause();
            audio.currentTime = 0;
            setVoicePlay({
                audio_url: "",
                isPlaying: false
            });
        }
    }

    return (
        <Fragment>
            <h2 className="text-2xl font-semibold mb-6">Voice Customization</h2>
            <div id="sectionA" className="mb-10">
                <h3 className="text-xl font-medium mb-4">Choose the Best Available Voice</h3>
                <p className="dark:text-dark-text-secondary text-light-text-secondary mb-6">Select a pre-made voice for your agent</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {voicesData.map((voice) => (
                        <button
                            key={voice.id}
                            onClick={() => updateData('voice.voice', voice?.id)}
                            className={clsx("dark:bg-dark-bg-primary bg-light-bg-primary bg-opacity-50 text-left rounded-lg p-5 border-2 cursor-pointer ",
                                data?.voice?.voice === voice.id ? "border-primary" : "border-gray-700 hover-elevate"
                            )}
                        >
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-medium truncate">{voice.name}</h4>
                                    <span className={clsx("text-xs px-2 py-1 rounded-full capitalize",
                                        data?.voice?.voice === voice.id ? "bg-primary text-white " : "dark:bg-dark-card-primary bg-light-card-primary dark:text-dark-text-secondary text-light-text-secondary border border-gray-700"
                                    )}>
                                        {voice.gender}
                                    </span>
                                </div>
                                <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2 capitalize">
                                    {voice.ethnicity}
                                </p>
                                <div className="audio-controls flex items-center justify-between mt-2">
                                    <span
                                        type="button"
                                        onClick={() => handleClickVoicePlayStop(voice?.audio_url)}
                                        className={clsx("p-2 rounded-full text-white hover:opacity-90 flex-shrink-0",
                                            data?.voice?.voice === voice.id ? "from-primary to-secondary bg-gradient-to-r" : "dark:bg-dark-card-primary bg-light-card-primary dark:text-dark-text-secondary text-light-text-secondary border border-gray-700"
                                        )}>
                                        {((voice?.audio_url === voicePlay?.audio_url) && voicePlay?.isPlaying) ?
                                            <FaRegCircleStop className="text-sm" /> :
                                            <FaPlay className="text-sm" />
                                        }
                                    </span>
                                    <AnimateWave
                                        animate={(voice?.audio_url === voicePlay?.audio_url) && voicePlay?.isPlaying}
                                    />
                                </div>
                            </div>
                        </button>
                    ))}


                </div>
            </div>

            {/* Added later */}
            {/* <div id="sectionB">
                <h3 className="text-xl font-medium mb-4">Clone Your Own Voice</h3>
                <p className="dark:text-dark-text-secondary text-light-text-secondary mb-6">Create a custom voice for your agent by recording or uploading samples</p>

                <div className="dark:bg-dark-bg-primary bg-light-bg-primary bg-opacity-50 rounded-lg p-6 border border-gray-700 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div id="uploadVoice" className="dark:bg-dark-card-primary bg-light-card-primary rounded-lg p-5 border border-gray-700 hover:border-primary transition-all duration-300">
                            <div className="flex flex-col">
                                <div className="flex items-center mb-4">
                                    <FaUpload className="text-xl mr-3 text-primary" />
                                    <h4 className="font-medium">Upload Voice Samples</h4>
                                </div>
                                <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-4">Upload existing audio files of your voice for cloning</p>
                                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all duration-300">
                                    <FaCloudArrowUp className="text-3xl dark:text-dark-text-secondary text-light-text-secondary mb-3" />
                                    <p className="dark:text-dark-text-secondary text-light-text-secondary text-center mb-2">Drag & drop files here or</p>
                                    <button
                                        className="px-4 py-2 rounded-lg from-primary to-secondary bg-gradient-to-r text-white hover:opacity-90 hover-elevate"
                                    >
                                        Browse Files
                                    </button>
                                    <p className="text-xs dark:text-dark-text-secondary text-light-text-secondary mt-3">Supported formats: .mp3, .wav, .m4a (min 1 minute)</p>
                                </div>
                            </div>
                        </div>


                        <div id="recordVoice" className="dark:bg-dark-card-primary bg-light-card-primary rounded-lg p-5 border border-gray-700 hover:border-primary transition-all duration-300">
                            <div className="flex flex-col">
                                <div className="flex items-center mb-4">
                                    <FaMicrophone className="text-xl mr-3 text-primary" />
                                    <h4 className="font-medium">Record Your Voice</h4>
                                </div>
                                <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-4">Read the provided text to create a voice sample</p>

                                <div className="dark:bg-dark-bg-primary bg-light-bg-primary bg-opacity-60 rounded-lg p-4 mb-4 h-[120px] overflow-y-auto no-scrollbar">
                                    <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm">
                                        "The artificial intelligence system works by analyzing patterns in large datasets. Voice cloning technology has advanced significantly in recent years, allowing for more natural and expressive synthetic voices. Please read this text clearly and at your normal speaking pace."
                                    </p>
                                </div>

                                <div className="flex justify-center">
                                    <button id="recordButton" className="px-5 py-3 rounded-full from-primary to-secondary bg-gradient-to-r text-white hover:opacity-90 hover-elevate flex items-center">
                                        <FaMicrophone className="mr-2" />
                                        Start Recording
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div id="voiceSamples" className="mt-6 border-t border-gray-700 pt-6">
                        <h4 className="font-medium mb-4">Your Voice Samples</h4>

                        <div className="grid grid-cols-1 gap-3">
                            <div className="dark:bg-dark-card-primary bg-light-card-primary rounded-lg p-3 border border-gray-700 flex items-center">
                                <FaFileAudio className=" text-primary mr-3" />
                                <div className="flex-1 mr-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Sample 1</span>
                                        <span className="text-xs dark:text-dark-text-secondary text-light-text-secondary">1:24</span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                                        <div className="h-full w-3/4 from-primary to-secondary bg-gradient-to-r rounded-full"></div>
                                    </div>
                                </div>
                                <button className="p-2 rounded-full dark:bg-dark-bg-primary bg-light-bg-primary dark:text-dark-text-secondary text-light-text-secondary border border-gray-700 mr-0.5 flex-shrink-0 hover:opacity-90">
                                    <FaPlay className="text-xs" />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-red-500">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <button className="px-6 py-3 rounded-lg from-primary to-secondary bg-gradient-to-r text-white hover:opacity-90 hover-elevate">
                                Generate Cloned Voice
                            </button>
                        </div>
                    </div>
                </div>


                <div className="dark:bg-dark-bg-primary bg-light-bg-primary bg-opacity-50 rounded-lg p-6 border border-gray-700 mb-6">
                    <h4 className="font-medium mb-4">Advanced Voice Settings</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2">Speaking Rate</label>
                            <div className="flex items-center">
                                <span className="dark:text-dark-text-secondary text-light-text-secondary mr-3">
                                    <LuTurtle className="text-sm" />
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    // value="50" 
                                    className="w-full h-2 rounded-lg dark:bg-dark-card-primary bg-light-card-primary accent-primary focus:ring-primary cursor-pointer"
                                />
                                <span className="dark:text-dark-text-secondary text-light-text-secondary ml-3">
                                    <LuRabbit className="text-sm" />
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block dark:text-dark-text-secondary text-light-text-secondary text-sm mb-2">Pitch</label>
                            <div className="flex items-center">
                                <span className="dark:text-dark-text-secondary text-light-text-secondary mr-3">
                                    <FaArrowDown className="text-sm" />
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    // value="50" 
                                    className="w-full h-2 rounded-lg dark:bg-dark-card-primary bg-light-card-primary accent-primary focus:ring-primary cursor-pointer"
                                />
                                <span className="dark:text-dark-text-secondary text-light-text-secondary ml-3">
                                    <FaArrowUp className="text-sm" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </Fragment>
    )
}

const AnimateWave = ({ animate = false }) => {
    return (
        <div className="flex items-center justify-center h-10 flex-1 mx-3">
            <span className={clsx("h-3 block w-[3px] my-0 mx-[2px] bg-gradient-to-b from-primary to-secondary", animate && "animate-wave")}></span>
            <span className={clsx("h-5 block w-[3px] my-0 mx-[2px] bg-gradient-to-b from-primary to-secondary [animation-delay:0.1s]", animate && "animate-wave")}></span>
            <span className={clsx("h-8 block w-[3px] my-0 mx-[2px] bg-gradient-to-b from-primary to-secondary [animation-delay:0.2s]", animate && "animate-wave")}></span>
            <span className={clsx("h-4 block w-[3px] my-0 mx-[2px] bg-gradient-to-b from-primary to-secondary [animation-delay:0.3s]", animate && "animate-wave")}></span>
            <span className={clsx("h-6 block w-[3px] my-0 mx-[2px] bg-gradient-to-b from-primary to-secondary [animation-delay:0.4s]", animate && "animate-wave")}></span>
        </div>
    )
}
