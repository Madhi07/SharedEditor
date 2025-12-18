import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';
import clsx from 'clsx';
import { wallOfLove } from './constants';

export default function WallOfLove() {

    const [swiperInstance, setSwiperInstance] = useState();
    const [isPrevActive, setIsPrevActive] = useState(false);
    const [isNextActive, setIsNextActive] = useState(true);

    const updateButtonState = (swiper) => {
        setIsPrevActive(!swiper.isBeginning);
        setIsNextActive(!swiper.isEnd);
    };

    return (
        <div id="wall-of-love" className="relative">
            <div className="absolute top-0 left-0 sm:w-96 sm:h-96 w-48 h-48 rounded-full bg-secondary/20 filter blur-[150px]"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-4">
                    <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-4">
                        <p className="text-sm font-medium">Community</p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
                        Wall of Love
                        <span className="text-red-500">❤️</span>
                    </h2>
                    <p className="text-xl text-gray-300">See what our community is saying about their AgentZee experiences</p>
                </div>


                <div className='relative p-10 pb-0'>
                    <Swiper
                        onSwiper={(swiper) => {
                            setSwiperInstance(swiper);
                            updateButtonState(swiper);
                        }}
                        onSlideChange={(swiper) => updateButtonState(swiper)}
                        spaceBetween={20}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                slidesPerGroup: 1
                            },
                            768: {
                                slidesPerView: 3,
                                slidesPerGroup: 3
                            },
                        }}
                    >

                        {wallOfLove.map((link, index) => (
                            <SwiperSlide
                                key={index}
                                className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-2.5  transition-all duration-300 shadow-lg hover:shadow-2xl hover:border-primary/30"
                            >
                                <div className="relative w-full aspect-[9/16]">
                                    <iframe
                                        className="w-full h-full rounded-xl"
                                        src={link}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </SwiperSlide>
                        ))}

                    </Swiper>

                    <button
                        type='button'
                        onClick={() => swiperInstance.slidePrev()}
                        className={clsx('bg-dark-card-primary p-2.5 rounded-full absolute z-10 top-1/2 -translate-y-1/2 left-0 border border-dark-border-primary',
                            isPrevActive ? "md:hover:opacity-50" : "opacity-50"
                        )}
                        disabled={!isPrevActive}
                    >
                        <FaChevronLeft className='text-secondary font-[600]' />
                    </button>

                    <button
                        type='button'
                        onClick={() => swiperInstance.slideNext()}
                        className={clsx('bg-dark-card-primary p-2.5 rounded-full absolute z-10 top-1/2  right-0 border border-dark-border-primary',
                            isNextActive ? "md:hover:opacity-50" : "opacity-50"
                        )}
                        disabled={!isNextActive}
                    >
                        <FaChevronRight className='text-secondary font-[600]' />
                    </button>
                </div>

            </div>

        </div>
    )
}
