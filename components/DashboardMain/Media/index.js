import { useRouter } from "next/router";

import ImageGenerator from "./Image";
import VideoGenerator from "./Video";
import PromptGenerator from "./Reels";

import { MediaProvider } from "@/components/DashboardMain/Media/context";
import CarouselGenerator from "./Carousel";
import { BlogGenerator } from "./Blog";
import MediaContextProvider from "./context";

export default function MediaSection() {
    const router = useRouter();

    const secondPath = `/${router?.query?.index?.[1]}`;
    return (
        <MediaContextProvider>
            <div className="w-full h-full transition-all duration-300  relative flex">
                <div className="flex-1 ">
                    {(secondPath === "/image") && (
                        <ImageGenerator />
                    )}
                    {(secondPath === "/video") && (
                        <VideoGenerator />
                    )}
                    {(secondPath === "/reels") && (
                        <PromptGenerator />
                    )}
                    {(secondPath === "/carousel") && (
                        <CarouselGenerator />
                    )}
                    {(secondPath === "/blog") && (
                        <BlogGenerator />
                    )}
                </div>
            </div>
        </MediaContextProvider>

    )
}
