import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { features } from "./constants";
import { useRouter } from "next/router";

export default function LeftCard() {
    const router = useRouter();

    const mapFeatures = router.pathname === "/login" ? features.slice(0, 3) : features;
    return (
        <Fragment>
            <div className="md:mb-8 mx-auto md:mx-0 text-center md:text-left">
                <Link
                    href={"/"}
                    className="flex items-center cursor-pointer mb-2"
                >
                    <Image
                        src={'/agentzee-logo.png'}
                        alt="AgentZee AI"
                        unoptimized
                        quality={100}
                        width={1920}
                        height={1080}
                        className="w-48 object-contain h-auto"
                    ></Image>
                </Link>
                <span className="text-sm opacity-80">The Future of AI Agent</span>
            </div>

            <div className="hidden md:flex flex-col flex-1">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="relative max-h-[300px] max-w-[300px]">
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-float">
                            <Image
                                priority
                                quality={100}
                                width={1024}
                                height={1024}
                                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/dee995ea88-a3432f49d780fe9cec63.png"
                                alt="futuristic 3D AI agent, purple and pink gradient, holographic interface, dark background, cinematic lighting, highly detailed"
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-secondary via-transparent to-transparent"></div>

                        </div>
                        <div className="absolute  -top-10 -right-10 w-20 h-20 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20 rotate-12 animate-float"></div>
                        <div className="absolute -bottom-5 -left-5 w-16 h-16 rounded-lg bg-secondary/10 backdrop-blur-sm border border-secondary/20 -rotate-12 animate-float [animation-delay:1s]"></div>
                    </div>
                </div>

                {/* <div className="mt-8">
                    <div className="text-xl font-semibold mb-4">Powerful features</div>
                    <ul className="space-y-2 grid">
                        {mapFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center">
                                <feature.icon className="mr-2" />
                                {feature.title}
                            </li>
                        ))}
                    </ul>
                </div> */}
            </div>
        </Fragment>

    )
}
