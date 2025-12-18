import useUpdateQueryParams from "@/hooks/updateQueryParams";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { FaBook, FaCheck, FaGlobe, FaMobileAlt, FaMouse, FaPlay, FaVrCardboard } from "react-icons/fa";

export default function NoCodeIntegration() {
    const updateQueryParams = useUpdateQueryParams();
    return (
        <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-2xl font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Choose Your Agent</h3>
                    <p className="text-gray-300">Select from our library of pre-built agents or customize your own with our visual editor.</p>
                </div>

                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-2xl font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Drag & Drop</h3>
                    <p className="text-gray-300">Simply drag your agent into your platform using our intuitive interface - no code needed.</p>
                </div>

                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-2xl font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Go Live</h3>
                    <p className="text-gray-300">Your AI agent is ready to interact with users instantly. Monitor and optimize in real-time.</p>
                </div>
            </div>

            <div className="mb-20">
                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-center mb-8">See It In Action</h2>
                    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-white/10">
                        <Image
                            quality={100}
                            width={1024}
                            height={1024}
                            className="w-full h-full object-cover"
                            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/4e8fb0aca0-ac61f67264e2110410ec.png"
                            alt="drag and drop interface, no-code platform, visual website builder, AI agent integration, modern UI dashboard, purple and pink gradients, dark theme"
                        />

                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10">
                            <div className="flex items-center">
                                <FaMouse className="text-primary mr-2" />
                                <span className="text-sm font-medium">Drag to integrate</span>
                            </div>
                        </div>

                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                                <span className="text-sm">Live in 30 seconds</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Integration Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                            <FaGlobe className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Website</h3>
                        <p className="text-gray-300 mb-4">Embed agents directly into your website with a simple widget.</p>
                        <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                            <li>WordPress plugin</li>
                            <li>HTML embed code</li>
                            <li>Shopify integration</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-4">
                            <FaMobileAlt className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Mobile Apps</h3>
                        <p className="text-gray-300 mb-4">Native SDK for iOS and Android applications.</p>
                        <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                            <li>React Native</li>
                            <li>Flutter support</li>
                            <li>Native iOS/Android</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                            <FaVrCardboard className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">VR/AR</h3>
                        <p className="text-gray-300 mb-4">Immersive 3D agents for virtual environments.</p>
                        <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                            <li>Unity plugin</li>
                            <li>Unreal Engine</li>
                            <li>WebXR support</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6">Visual Editor</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <FaCheck className="text-green-400 mr-3" />
                            <span>Drag-and-drop interface</span>
                        </div>
                        <div className="flex items-center">
                            <FaCheck className="text-green-400 mr-3" />
                            <span>Real-time preview</span>
                        </div>
                        <div className="flex items-center">
                            <FaCheck className="text-green-400 mr-3" />
                            <span>Custom styling options</span>
                        </div>
                        <div className="flex items-center">
                            <FaCheck className="text-green-400 mr-3" />
                            <span>Responsive design</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6">One-Click Deploy</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <FaCheck className="text-green-400 mr-3" />
                            <span>Instant deployment</span>
                        </div>
                        <div className="flex items-center">
                            <FaCheck className="text-green-400 mr-3" />
                            <span>Auto-scaling infrastructure</span>
                        </div>
                        <div className="flex items-center">
                            <FaCheck className="text-green-400 mr-3" />
                            <span>Global CDN delivery</span>
                        </div>
                        <div className="flex items-center">
                            <FaCheck className="text-green-400 mr-3" />
                            <span>99.9% uptime guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Integrating Today</h2>
                    <p className="text-xl text-gray-300 mb-8">Get your AI agent up and running in minutes, not months</p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            href={"/sign-up"}
                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium text-center cursor-pointer"
                        >
                            Try Free Demo
                        </Link>
                        <button
                            onClick={() => { updateQueryParams({ demo: true }) }}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-8 py-3 rounded-full text-white font-medium flex items-center justify-center cursor-pointer"
                        >
                            <FaPlay className="mr-2" /> Watch Demo
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
