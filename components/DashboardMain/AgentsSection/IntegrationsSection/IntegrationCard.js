import clsx from "clsx";
import { integrationIcons } from "./constants";
import Image from "next/image";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCircleXmark } from "react-icons/fa6";
import { FaExclamationTriangle, FaLink, FaUnlink } from "react-icons/fa";
import { Fragment } from "react";


export default function IntegrationCard({ data = {}, onConnectConfigureClick, resMessages = {} }) {
    return (
        <div className="flex flex-col border border-light-border-primary rounded-xl bg-light-card-primary shadow md:p-6 p-4 hover:border-secondary transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
                <div className={clsx("w-10 h-10 inline-flex items-center justify-center",
                    !data?.logo && "bg-light-bg-primary"
                )}>
                    {data?.logo && (
                        <Image
                            quality={100}
                            src={data?.logo}
                            width={1024}
                            height={1024}
                            alt={data?.title}
                            className="w-full h-full object-contain"
                        />
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <div className={clsx("w-2 h-2 rounded-full",
                        data?.is_connected ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className={clsx("text-sm font-medium",
                        data?.is_connected ? "text-green-500" : "text-red-500"
                    )}>
                        {`${data?.is_connected ? "Connected" : "Not Connected"}`}
                    </span>
                </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
                {data?.title}
            </h3>
            <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm mb-4 line-clamp-3">
                {data?.description}
            </p>

            {(data?.id === resMessages?.id) && (resMessages?.status === "loading" || resMessages?.status === "err4xx" || resMessages?.status === "err5xx") ? (
                <div className="flex w-full mt-auto px-4 py-2 items-center justify-center gap-2">
                    {resMessages?.status === "loading" && (
                        <LuLoaderCircle className="text-secondary size-4 flex-shrink-0 animate-spin" />
                    )}
                    {resMessages?.status === "err4xx" && (
                        <FaCircleXmark className="text-red-400 size-4 flex-shrink-0" />
                    )}
                    {resMessages?.status === "err5xx" && (
                        <FaExclamationTriangle className="text-orange-400 size-4 flex-shrink-0" />
                    )}

                    {resMessages?.message && (
                        <p className={clsx("font-[500]",
                            resMessages?.status === "loading" && "text-secondary",
                            resMessages?.status === "err4xx" && "text-red-400",
                            resMessages?.status === "err5xx" && "text-orange-400",
                        )}>
                            {resMessages?.message}
                        </p>
                    )}
                </div>
            ) : (
                <button
                    onClick={onConnectConfigureClick}
                    type="button"
                    className="mt-auto w-full px-4 py-2 bg-gradient-to-r text-white rounded-lg from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-colors font-medium flex items-center gap-2 justify-center"
                >
                    {data?.is_connected ?
                        <Fragment>
                            <FaUnlink />
                            Disconnect
                        </Fragment> :
                        <Fragment>
                            <FaLink />
                            Connect
                        </Fragment>
                    }
                </button>
            )}
        </div>
    )
}
