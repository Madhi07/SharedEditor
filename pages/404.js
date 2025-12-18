import MainLayout from "@/components/MainLayout";
import { AgentZeeHead } from "@/components/SVG";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaArrowLeft, FaExclamation, FaExclamationTriangle, FaHome, FaQuestion, FaSearch, FaTimes } from "react-icons/fa";

export default function Page404() {
    const router = useRouter();
    return (
        <MainLayout>
            <section id="error-404" className="relative py-20 md:py-40 overflow-hidden flex items-center">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-bg-secondary to-dark-bg-primary z-0"></div>


                <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-secondary/20 filter blur-[100px] animate-pulse-slow"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
                            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                                <p className="text-sm font-medium flex items-center justify-center lg:justify-start">
                                    <FaExclamationTriangle className="text-yellow-400 mr-2" />
                                    Error 404
                                </p>
                            </div>

                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">404</span>
                            </h1>

                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Page Not Found</h2>

                            <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                                Oops! It looks like our AI agents couldn't locate the page you're looking for. The page might have been moved, deleted, or doesn't exist.
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                                <Link
                                    href={'/'}
                                    className="inline-flex items-center bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium text-center cursor-pointer"
                                >
                                    <FaHome className="mr-2 text-lg" />Go Home
                                </Link>
                                <button
                                    onClick={() => router.back()}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-8 py-3 rounded-full text-white font-medium flex items-center justify-center cursor-pointer"
                                >
                                    <FaArrowLeft className="mr-2" /> Go Back
                                </button>
                            </div>

                            <div className="mt-12">
                                <p className="text-gray-400 mb-4">Popular pages:</p>
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    <Link href={'/#features'} className="text-secondary hover:underline transition-colors cursor-pointer">Features</Link>
                                    <Link href={"/#pricing"} className="text-secondary hover:underline transition-colors cursor-pointer">Pricing</Link>
                                    <Link href={""} className="text-secondary hover:underline transition-colors cursor-pointer">Documentation</Link>
                                    <Link href={""} className="text-secondary hover:underline transition-colors cursor-pointer">Support</Link>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-float">
                                <Image
                                    priority
                                    quality={100}
                                    width={1024}
                                    height={1024}
                                    className="w-full h-full object-cover"
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/49186f7511-49781f1d33e06325b721.png"
                                    alt="futuristic 3D AI robot looking confused, holographic error symbols floating around, purple and pink gradient lighting, dark space background, glitch effects"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-secondary via-transparent to-transparent"></div>

                                <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                            <AgentZeeHead className={'text-white'}/>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium">AgentZee Assistant</p>
                                            <p className="text-xs text-gray-300">I couldn't find that page, but I'm here to help you navigate!</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <FaExclamation className=" text-red-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-2xl bg-red-500/10 backdrop-blur-sm border border-red-500/20 rotate-12 animate-float flex items-center justify-center">
                                <FaTimes className=" text-red-400 text-2xl" />
                            </div>
                            <div className="absolute -bottom-5 -left-5 w-16 h-16 rounded-lg bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 -rotate-12 animate-float flex items-center justify-center [animation-delay:1s]">
                                <FaQuestion className="text-yellow-400" />
                            </div>
                            <div className="absolute top-1/3 -left-8 w-20 h-20 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 animate-float flex items-center justify-center [animation-delay:2s]">
                                <FaSearch className="text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}
