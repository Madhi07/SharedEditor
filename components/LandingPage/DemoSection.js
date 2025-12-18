import useUpdateQueryParams from "@/hooks/updateQueryParams";
import Link from "next/link";
import { FaMinus, FaPaperPlane, FaPlay, FaRobot, FaTimes } from "react-icons/fa";

export default function DemoSection() {
    const updateQueryParams = useUpdateQueryParams();

    const triggerChatWidget = () => {
        const chatWidget = document?.getElementById("webopt-widget-root")?.firstChild;
        if (chatWidget) chatWidget?.click();
    }

    return (
        <section id="demo" className="py-20 relative">
            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary/80 border border-white/5 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/30 filter blur-[150px] z-0"></div>

                    <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                        <div className="lg:w-1/2">
                            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                                <p className="text-sm font-medium">Interactive Demo</p>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">See AgentZee in Action</h2>
                            <p className="text-xl text-gray-300 mb-8">Experience how our 3D AI agents can transform your customer interactions. Try the live demo or watch our walkthrough video.</p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    href={"/sign-up"}
                                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium text-center cursor-pointer"
                                >
                                    Try Live Demo
                                </Link>
                                <button
                                    onClick={() => { updateQueryParams({ demo: true }) }}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-8 py-3 rounded-full text-white font-medium flex items-center justify-center cursor-pointer"
                                >
                                    <FaPlay className="mr-2" /> Watch Video
                                </button>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/69715422bc-41252c5e9f068f545544.png" alt="futuristic 3D AI agent interface, dashboard with analytics, dark theme with purple and pink accents, holographic display" />

                                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-secondary via-transparent to-transparent"></div>

                                <div className="absolute top-4 left-4 right-4 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                            <FaRobot className="size-4 text-white text-sm" />
                                        </div>
                                        <p className="ml-3 text-sm font-medium">AgentZee Demo Interface</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                            <FaMinus className="text-white text-xs" />
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                            <FaTimes className="text-white text-xs" />
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={triggerChatWidget}
                                    className="absolute bottom-4 left-4 right-4 flex space-x-2 cursor-pointer"
                                >
                                    <div className="flex-1 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                        <input disabled type="text" placeholder="Ask something..." className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 pointer-events-none" />
                                    </div>
                                    <button className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                        <FaPaperPlane className="text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
