import { DialogPanel } from "@headlessui/react";
import ModalLayout from ".";
import Image from "next/image";
import { FaBars, FaMicrophone, FaSquare } from "react-icons/fa";
import Experience from "../Avatar/Experience";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect } from "react";

export default function ChatInterface({ open, onClose, textBoxValue, onTextBoxChange, onTextBoxKeyDown }) {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        if (listening && transcript) {
            onTextBoxChange(transcript);
        }
    }, [transcript]);

    return (
        <ModalLayout
            open={open}
            onClose={onClose}
        >
            <DialogPanel
                transition
                className="flex px-4 md:px-8 container text-left relative transform shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >

                <div className="flex gap-6 bg-light-purple w-full rounded-2xl p-4 md:p-6 h-[calc(100vh-10rem)] overflow-hidden">

                    <div id="chat-area" className="w-2/3 flex flex-col rounded-xl bg-white shadow-sm">

                        <div className="flex-1">
                            <div className="p-6 flex items-start max-w-[80%]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                    <Image
                                        src="/agentzee-face-white.png"
                                        alt="AgentZee Face"
                                        width={1024}
                                        height={1024}
                                        quality={100}
                                        loading="lazy"
                                        className="rounded-full object-contain flex"
                                    />
                                </div>
                                <div className="ml-4 bg-gray-200/50 px-4 py-2 rounded-xl shadow-sm">
                                    <p className="text-base text-black text-wrap">
                                        Hi! I’m AgentZee AI — your smart assistant. Need help navigating the dashboard or understanding any features? I’m right here.
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 pt-0 flex ml-auto flex-row-reverse max-w-[80%]">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Image
                                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                                        alt="AgentZee Face"
                                        width={1024}
                                        height={1024}
                                        quality={100}
                                        loading="lazy"
                                        className="rounded-full object-contain flex"
                                    />
                                </div>
                                <div className="mr-4 bg-gray-200/50 px-4 py-2 rounded-xl shadow-sm">
                                    <p className="text-base text-black text-wrap">
                                        Hey, can you explain what 'Engagement Score' means?
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 pt-0 flex items-start max-w-[80%]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                    <Image
                                        src="/agentzee-face-white.png"
                                        alt="AgentZee Face"
                                        width={1024}
                                        height={1024}
                                        quality={100}
                                        loading="lazy"
                                        className="rounded-full object-contain flex"
                                    />
                                </div>
                                <div className="ml-4 bg-gray-200/50 px-4 py-2 rounded-xl shadow-sm">
                                    <p className="text-base text-black text-wrap">
                                        Of course! The Engagement Score is a metric that combines time spent, clicks, and return visits to show how actively users are interacting with your platform. A higher score means your users are more engaged.
                                        <br /><br />
                                        You can hover over the score in the dashboard to see a breakdown by segment, or click ‘Details’ for trends over time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 p-4">
                            <div className="flex items-center">
                                <input
                                    autoFocus={true}
                                    type="text"
                                    placeholder="Type here"
                                    value={textBoxValue}
                                    disabled={!browserSupportsSpeechRecognition}
                                    onChange={(event) => { onTextBoxChange(event.target.value) }}
                                    onKeyDown={(event) => { onTextBoxKeyDown(event) }}
                                    className="text-black bg-transparent flex-1 border border-gray-200 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <button
                                    className="ml-3 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                                    onClick={() => { listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening() }}
                                >
                                    {listening ?
                                        <FaSquare className="text-white text-lg" /> :
                                        <FaMicrophone className="text-white text-lg" />
                                    }
                                </button>
                            </div>
                            <div className="text-center mt-3 text-xs text-gray-400">
                                Powered by AgentZee AI
                            </div>
                        </div>
                    </div>


                    <div id="agent-profile" className="w-1/3 bg-primary p-6 flex flex-col rounded-xl">

                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Agent Profile</h2>
                            <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all">
                                <FaBars />
                            </button>
                        </div>


                        <div className="flex-1 flex flex-col">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-white mb-1">Alex AI</h3>
                                <p className="text-white/80">Sales Representative</p>
                            </div>


                            <div className="w-full h-full aspect-square rounded-3xl overflow-hidden bg-white/10 mb-8 shadow-lg">

                                {/* <Experience /> */}
                            </div>

                        </div>
                    </div>
                </div>
            </DialogPanel>
        </ModalLayout>
    )
}
