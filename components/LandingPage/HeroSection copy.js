import Image from "next/image";
import { FaMicrophone, FaPlay, FaRobot, FaStar } from "react-icons/fa";
import { IoSparklesSharp } from "react-icons/io5";
import { AgentZeeHead } from "../SVG";
import Link from "next/link";
import { useAuthContext } from "@/context/useAuthContext";
import { useEffect, useRef, useState } from "react";
import { gsap } from 'gsap';
import { TextPlugin } from "gsap/TextPlugin";
import useUpdateQueryParams from "@/hooks/updateQueryParams";
gsap.registerPlugin(TextPlugin);

export default function HeroSection() {
    const { loginUser } = useAuthContext();
    const updateQueryParams = useUpdateQueryParams();

    const triggerChatWidget = () => {
        const chatWidget = document.getElementById("webopt-widget-root").firstChild;
        if (chatWidget) chatWidget.click();
    }

    return (
        <section id="hero" className="relative pt-32 pb-20 md:pt-40 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-bg-secondary to-dark-bg-primary z-0"></div>

            <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-secondary/20 filter blur-[100px] animate-pulse-slow"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-center">
                    <div className="max-w-3xl w-full mb-12 lg:mb-0 text-center">
                        <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                            <p className="text-sm font-medium flex items-center">
                                <IoSparklesSharp className="fa-solid fa-sparkles text-yellow-400 mr-2" />
                                Introducing 3D AI Agents
                            </p>
                        </div>

                        {/* <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            The Future of <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AI Agents</span> Is Here
                        </h1> */}

                        {/* <TypingHeadline /> */}

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Reinvent your sales with our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">AI Agents</span>
                        </h1>


                        <p className="text-xl text-gray-300 mb-8">
                            Create, customize, and deploy intelligent 3D AI agents that revolutionize how your business interacts with customers.
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4  w-max mx-auto">
                            <Link
                                href={loginUser?.token ? '/dashboard/agents' : 'sign-up'}
                                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium text-center cursor-pointer"
                            >
                                Start Building For Free
                            </Link>
                            <button
                                onClick={() => { updateQueryParams({ demo: true }) }}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-8 py-3 rounded-full text-white font-medium flex items-center justify-center cursor-pointer"
                            >
                                <FaPlay className="mr-2" /> Watch Demo
                            </button>
                        </div>

                        {/* Rating section */}
                        {/* <div className="mt-12 flex items-center">
                            <div className="flex -space-x-2">
                                <Image
                                    quality={100}
                                    width={1024}
                                    height={1024}
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                                    className="w-10 h-10 rounded-full border-2 border-darkBg"
                                    alt="User"
                                />
                                <Image
                                    quality={100}
                                    width={1024}
                                    height={1024}
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                                    className="w-10 h-10 rounded-full border-2 border-darkBg"
                                    alt="User"
                                />
                                <Image
                                    quality={100}
                                    width={1024}
                                    height={1024}
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                                    className="w-10 h-10 rounded-full border-2 border-darkBg"
                                    alt="User"
                                />
                                <Image
                                    quality={100}
                                    width={1024}
                                    height={1024}
                                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
                                    className="w-10 h-10 rounded-full border-2 border-darkBg"
                                    alt="User"
                                />
                            </div>
                            <div className="ml-4">
                                <div className="flex items-center">
                                    <FaStar className="fa-solid fa-star text-yellow-400" />
                                    <FaStar className="fa-solid fa-star text-yellow-400" />
                                    <FaStar className="fa-solid fa-star text-yellow-400" />
                                    <FaStar className="fa-solid fa-star text-yellow-400" />
                                    <FaStar className="fa-solid fa-star text-yellow-400" />
                                    <span className="ml-2 text-gray-300">4.9/5</span>
                                </div>
                                <p className="text-sm text-gray-400">From 2,000+ reviews</p>
                            </div>
                        </div> */}
                    </div>

                    {/* <div className="lg:w-1/2 relative">
                        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-float">
                            <Image
                                priority
                                quality={100}
                                width={1024}
                                height={1024}
                                // src="/sample 2.png"
                                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/dee995ea88-a3432f49d780fe9cec63.png"
                                alt="futuristic 3D AI agent, purple and pink gradient, holographic interface, dark background, cinematic lighting, highly detailed"
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-secondary via-transparent to-transparent"></div>

                            <div
                                onClick={triggerChatWidget}
                                className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 cursor-pointer"
                            >
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                        <AgentZeeHead className={'text-white'} />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium">AgentZee Assistant</p>
                                        <p className="text-xs text-gray-300">How can I help optimize your customer support today?</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <FaMicrophone className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20 rotate-12 animate-float"></div>
                        <div className="absolute -bottom-5 -left-5 w-16 h-16 rounded-lg bg-secondary/10 backdrop-blur-sm border border-secondary/20 -rotate-12 animate-float [animation-delay:1s]"></div>
                    </div> */}
                </div>
            </div>
        </section>
    )
}

function TypingHeadline() {
    const textRef = useRef(null);
    const cursorRef = useRef(null);
    const tweenRef = useRef(null);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        // Blinking cursor
        const blink = gsap.fromTo(
            cursorRef.current,
            { autoAlpha: 0 },
            {
                autoAlpha: 1,
                duration: 0.5,
                repeat: -1,
                ease: "power2.inOut",
                yoyo: true
            }
        );

        // Typing animation with styled HTML
        const fullHTML = `The Future of 
      <span class='bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent font-bold'>AI</span><br/><span class='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold'>Agents</span> 
      is Here`;


        const animate = () => {
            gsap.set(textRef.current, { text: "" }); // reset
            tweenRef.current = gsap.to(textRef.current, {
                text: {
                    value: fullHTML,
                    delimiter: "",
                },
                duration: 5,
                ease: "power1.inOut",
                onComplete: () => {
                    // Wait, then restart
                    setTimeout(animate, 1500);
                },
            });
        };

        animate(); // start animation

        return () => {
            blink.kill();
            tweenRef.current?.kill();
        };
    }, []);

    return (
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span ref={textRef}></span>
            {showCursor && (
                <span ref={cursorRef} className="ml-1 animate-pulse">|</span>
            )}
        </h1>
    );
}

