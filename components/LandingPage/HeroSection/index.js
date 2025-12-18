import { IoSparkles, IoSparklesSharp } from "react-icons/io5";
import { useAuthContext } from "@/context/useAuthContext";
import { useEffect, useRef, useState } from "react";
import useUpdateQueryParams from "@/hooks/updateQueryParams";
import Typewriter from "@/components/Animations/Typewriter";
import { slideContents } from "./constants";
import clsx from "clsx";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import Image from "next/image";

export default function HeroSection() {
    const { loginUser } = useAuthContext();
    const updateQueryParams = useUpdateQueryParams();
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    const triggerChatWidget = () => {
        const chatWidget = document.getElementById("webopt-widget-root").firstChild;
        if (chatWidget) chatWidget.click();
    }

    return (
        <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-bg-secondary to-dark-bg-primary z-0"></div>

            <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-secondary/20 filter blur-[100px] animate-pulse-slow"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-center">
                    <div className="max-w-4xl w-full lg:mb-0 text-center">
                        <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                            <div className="text-sm font-medium flex items-center">
                                <IoSparklesSharp className="fa-solid fa-sparkles text-yellow-400 mr-2" />
                                <Typewriter
                                    content="Create AI Agents in one prompt..."
                                    className="text-inherit"
                                    cursorContent="|"
                                    cursorClassName="ml-2 animate-pulse"
                                    repeat={1}
                                    typingSpeed={0.05}
                                />
                            </div>
                        </div>

                        <div className="flex w-full flex-col overflow-clip rounded-2xl border border-dark-border-primary">
                            <div className="w-full hidden md:flex">
                                {slideContents.map((item, index) => (
                                    <button
                                        onClick={() => {
                                            setActiveIndex(index);
                                            swiperRef.current?.slideTo(index);
                                        }}
                                        key={item?.headline?.toLowerCase()}
                                        type="button"
                                        className={clsx("flex shrink-0 flex-grow items-center justify-center gap-2 px-2.5 py-3.5 text-dark-text-primary outline-none",
                                            (activeIndex === index) ? "border-b-2 border-secondary font-[500]" : "font-[400]"
                                        )}
                                    >
                                        {(activeIndex === index) && (
                                            <span className="block w-2 h-2 bg-secondary rounded-full"></span>
                                        )}
                                        {item?.headline}
                                    </button>
                                ))}
                            </div>

                            <Swiper
                                pagination={{
                                    clickable: true,
                                    bulletActiveClass: "!bg-primary !opacity-100",
                                }}
                                onSlideChange={(s) => setActiveIndex(s.activeIndex)}
                                onSwiper={(s) => (swiperRef.current = s)}
                                slidesPerView={1}
                                slidesPerGroup={1}
                                spaceBetween={80}
                                modules={[Pagination]}
                                breakpoints={{
                                    0: {
                                        pagination: {
                                            enabled: true
                                        }
                                    },
                                    768: {
                                        pagination: {
                                            enabled: false
                                        }
                                    },
                                }}
                                className="w-full !p-4 sm:!p-8 md:!p-16 transition-all duration-200 ease-in-out"
                            >
                                {slideContents.map((item) => (
                                    <SwiperSlide
                                        key={item?.headline?.toLowerCase()}
                                        className="!flex !flex-col md:!gap-8 !gap-6"
                                    >
                                        <div className="flex gap-4 text-left pb-2.5 border-b-2 border-dark-border-primary">
                                            <div className="w-2 flex bg-secondary/70 flex-shrink-0 rounded-sm" />
                                            <div>
                                                <h2 className="md:text-2xl text-lg font-[600] uppercase">
                                                    {item?.headline}
                                                </h2>
                                                <p className="md:text-lg text-sm font-[600] uppercase text-dark-text-secondary">
                                                    {item?.tagline}
                                                </p>
                                            </div>
                                        </div>

                                        <Image
                                            src={item?.image}
                                            width={1920}
                                            height={1080}
                                            quality={100}
                                            alt={item?.headline?.toLowerCase()}
                                            className="flex-1 w-full md:w-[70%] mx-auto"
                                        />

                                        <div className="md:space-y-4 space-y-2.5 w-full">
                                            {item.features.map((feature, index) => (
                                                <div key={index} className="gap-2 flex items-center">
                                                    <IoSparkles className="flex-shrink-0 text-secondary size-5" />
                                                    <div className="md:text-base text-sm inline-block gap-2 text-left text-wrap">
                                                        <h4 className="font-[600] text-nowrap">
                                                            {feature.title}
                                                        </h4>
                                                        <p className="font-[500] text-dark-text-secondary">
                                                            {feature.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </SwiperSlide>
                                ))}


                            </Swiper>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

