import { AgentZeeHead } from "@/components/SVG";
import useUpdateQueryParams from "@/hooks/updateQueryParams";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { FaChartLine, FaHandPaper, FaHandPointRight, FaHeart, FaKeyboard, FaPlay, FaSmile, FaThumbsUp, FaUniversalAccess, FaUser, FaUsers } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa6";

export default function MultiModalCommunication() {
    const updateQueryParams = useUpdateQueryParams();
    return (
        <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">

                <div id="text-comm" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
                        <FaKeyboard className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Text Communication</h3>
                    <p className="text-gray-300 mb-6">Natural language processing enables fluid text conversations with context awareness and emotional intelligence.</p>
                    <div className="bg-black/30 rounded-lg p-4 text-left">
                        <div className="flex items-start space-x-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <FaUser className=" text-white text-sm" />
                            </div>
                            <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">
                                "I'm feeling frustrated with my order"
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                <AgentZeeHead className=" !text-white !size-5" />
                            </div>
                            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg px-3 py-2 text-sm">
                                "I understand your frustration. Let me help resolve this immediately."
                            </div>
                        </div>
                    </div>
                </div>


                <div id="voice-comm" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6">
                        <FaMicrophone className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Voice Communication</h3>
                    <p className="text-gray-300 mb-6">Advanced speech synthesis with emotional tone matching for natural voice interactions and real-time responses.</p>
                    <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex space-x-1">
                                <div className="w-2 h-8 bg-primary rounded animate-pulse"></div>
                                <div className="w-2 h-12 bg-primary/80 rounded animate-pulse [animation-delay:0.1s]" ></div>
                                <div className="w-2 h-6 bg-primary/60 rounded animate-pulse [animation-delay:0.2s]" ></div>
                                <div className="w-2 h-10 bg-primary rounded animate-pulse [animation-delay:0.3s]" ></div>
                                <div className="w-2 h-4 bg-primary/70 rounded animate-pulse [animation-delay:0.4s]" ></div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">Voice tone: Empathetic & Professional</p>
                        <p className="text-xs text-gray-500 mt-2">Processing speech in real-time...</p>
                    </div>
                </div>


                <div id="gesture-comm" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                        <FaHandPaper className=" text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Gesture & Expression</h3>
                    <p className="text-gray-300 mb-6">3D avatars use facial expressions, hand gestures, and body language to convey emotions and enhance communication.</p>
                    <div className="bg-black/30 rounded-lg p-4">
                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                            <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded p-2 text-xs">
                                <FaSmile className=" text-yellow-400 mb-1 mx-auto" />
                                <div>Happy</div>
                            </div>
                            <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded p-2 text-xs">
                                <FaHandPointRight className=" text-blue-400 mb-1 mx-auto" />
                                <div>Pointing</div>
                            </div>
                            <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded p-2 text-xs">
                                <FaThumbsUp className=" text-green-400 mb-1 mx-auto" />
                                <div>Approval</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Synchronized with speech patterns</p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 md:p-12 mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Seamless Integration</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">All Modes Working Together</h3>
                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-black/30 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                                    <FaKeyboard className=" text-white" />
                                </div>
                                <div>
                                    <p className="font-medium">Text Input Detected</p>
                                    <p className="text-sm text-gray-400">Processing natural language...</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-black/30 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-4">
                                    <FaMicrophone className=" text-white" />
                                </div>
                                <div>
                                    <p className="font-medium">Voice Response Generated</p>
                                    <p className="text-sm text-gray-400">Matching emotional tone...</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-black/30 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-4">
                                    <FaHandPaper className=" text-white" />
                                </div>
                                <div>
                                    <p className="font-medium">Gestures Synchronized</p>
                                    <p className="text-sm text-gray-400">Enhancing communication...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <Image
                            quality={100}
                            width={1024}
                            height={1024}
                            className="w-full h-[400px] object-cover rounded-xl"
                            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/8239617e67-9e698b6cd7253c303179.png"
                            alt="3D AI avatar communicating with multiple modes, holographic interface, gestures and speech bubbles, futuristic design, purple and pink gradients"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-secondary/50 via-transparent to-transparent rounded-xl"></div>
                    </div>
                </div>
            </div>

            <div className="mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Multi-Modal Matters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-4">
                                <FaChartLine className=" text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Higher Engagement</h3>
                        </div>
                        <p className="text-gray-300">Multi-modal interactions increase user engagement by 3x compared to text-only communication.</p>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-4">
                                <FaUsers className=" text-white size-5" />
                            </div>
                            <h3 className="text-xl font-bold">Better Understanding</h3>
                        </div>
                        <p className="text-gray-300">Visual and auditory cues help convey complex information more effectively than text alone.</p>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-4">
                                <FaHeart className=" text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Emotional Connection</h3>
                        </div>
                        <p className="text-gray-300">Voice tone and gestures create deeper emotional bonds between users and AI agents.</p>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-4">
                                <FaUniversalAccess className=" text-white size-5" />
                            </div>
                            <h3 className="text-xl font-bold">Accessibility</h3>
                        </div>
                        <p className="text-gray-300">Multiple communication modes ensure accessibility for users with different abilities and preferences.</p>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience Multi-Modal AI</h2>
                    <p className="text-xl text-gray-300 mb-8">See how our agents communicate naturally across all channels</p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            href={"/sign-up"}
                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium text-center cursor-pointer"
                        >
                            Try Interactive Demo
                        </Link>
                        <button
                            onClick={() => { updateQueryParams({ demo: true }) }}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-8 py-3 rounded-full text-white font-medium flex items-center justify-center cursor-pointer"
                        >
                            <FaPlay className=" mr-2" /> Watch Demo
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
