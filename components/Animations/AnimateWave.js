import clsx from "clsx"

export const AnimateWave = ({ animate = false, bgColor = "", rootClass = "" }) => {
    return (
        <div className={clsx("flex items-center justify-center",
            rootClass
        )}>
            <span className={clsx("h-3 block w-[3px] my-0 mx-[2px]", bgColor, animate && "animate-wave")}></span>
            <span className={clsx("h-5 block w-[3px] my-0 mx-[2px] [animation-delay:0.1s]", bgColor, animate && "animate-wave")}></span>
            <span className={clsx("h-8 block w-[3px] my-0 mx-[2px] [animation-delay:0.2s]", bgColor, animate && "animate-wave")}></span>
            <span className={clsx("h-4 block w-[3px] my-0 mx-[2px] [animation-delay:0.3s]", bgColor, animate && "animate-wave")}></span>
            <span className={clsx("h-6 block w-[3px] my-0 mx-[2px] [animation-delay:0.4s]", bgColor, animate && "animate-wave")}></span>
        </div>
    )
}