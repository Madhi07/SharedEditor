import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Experience from "../Avatar/Experience";
import { useState } from "react";
import { MdAccessibility, MdAirlineSeatReclineExtra, MdRecordVoiceOver } from "react-icons/md";
import clsx from "clsx";
import { FaPerson } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import AvatarViewer from "../Avatar/AvatarViewer";
import Link from "next/link";

export default function ShowAvatar({ onClose = () => null, data = {} }) {

    const [animationName, setAnimationName] = useState("A-Pose");

    return (
        <Dialog open={true} onClose={onClose} className="relative z-20">
            <DialogBackdrop
                transition
                className="fixed z-10 inset-0 bg-dark-bg-secondary/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center p-6 text-center items-center">
                    <DialogPanel
                        transition
                        className="max-w-md w-full h-[512px] mx-auto flex flex-col justify-center items-center bg-dark-card-primary backdrop-blur rounded-2xl overflow-hidden relative transform transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >

                        <button
                            onClick={onClose}
                            type="button"
                            className="p-1.5 text-white bg-black/50 rounded-full text-sm absolute right-4 top-4 z-30 hover:opacity-80"
                        >
                            <FaTimes />
                        </button>

                        {data?.three_d_file_url && (
                            <AvatarViewer
                                avatarPath={data?.three_d_file_url}
                                avatarThumbnail={data?.avatar_preview_image_url}
                                animationName={animationName}
                                scale={1.5}
                            />
                        )}
                        {/* <Experience
                            key={data?.three_d_file_url}
                            scale={2.4}
                            avatarPath={data?.three_d_file_url}
                            thumbnail={data?.avatar_preview_image_url}
                            animationName={animationName}
                        /> */}

                        <div className="absolute flex flex-col gap-4 bottom-6 right-6">
                            <button
                                onClick={() => setAnimationName("A-Pose")}
                                type="button"
                                className={clsx("p-2 relative inline-flex items-center justify-center rounded-full bg-primary text-white ring-offset-2 ring-offset-dark-card-primary ring-secondary group",
                                    animationName === "A-Pose" ? "ring-2" : "hover:ring-2"
                                )}
                            >
                                <MdAccessibility className="flex-shrink-0" />
                                <span className="bg-dark-bg-primary rounded-lg text-white absolute p-2 w-max text-sm group-hover:block hidden right-10">
                                    A Pose
                                </span>
                            </button>
                            <button
                                onClick={() => setAnimationName("relaxing")}
                                type="button"
                                className={clsx("p-2 relative inline-flex items-center justify-center rounded-full bg-primary text-white ring-offset-2 ring-offset-dark-card-primary ring-secondary group",
                                    animationName === "relaxing" ? "ring-2" : "hover:ring-2"
                                )}
                            >
                                <MdAirlineSeatReclineExtra className="flex-shrink-0" />
                                <span className="bg-dark-bg-primary rounded-lg text-white absolute p-2 w-max text-sm group-hover:block hidden right-10">
                                    Relaxing
                                </span>
                            </button>
                            <button
                                onClick={() => setAnimationName("standing")}
                                type="button"
                                className={clsx("p-2 inline-flex items-center justify-center rounded-full bg-primary text-white ring-offset-2 ring-offset-dark-card-primary ring-secondary group",
                                    animationName === "standing" ? "ring-2" : "hover:ring-2"
                                )}
                            >
                                <FaPerson className="flex-shrink-0" />
                                <span className="bg-dark-bg-primary rounded-lg text-white absolute p-2 w-max text-sm group-hover:block hidden right-10">
                                    Standing
                                </span>
                            </button>
                            <button
                                onClick={() => setAnimationName("talking")}
                                type="button"
                                className={clsx("p-2 inline-flex items-center justify-center rounded-full bg-primary text-white ring-offset-2 ring-offset-dark-card-primary ring-secondary group",
                                    animationName === "talking" ? "ring-2" : "hover:ring-2"
                                )}
                            >
                                <MdRecordVoiceOver className="flex-shrink-0" />
                                <span className="bg-dark-bg-primary rounded-lg text-white absolute p-2 w-max text-sm group-hover:block hidden right-10">
                                    Talking
                                </span>
                            </button>

                        </div>

                        <Link
                            href={`/try-now?avatar-id=${data?.id}`}
                            className="flex absolute z-10 bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 font-[500] text-secondary border border-secondary rounded-full hover:bg-secondary hover:text-white"
                        >
                            Try Now
                        </Link>

                    </DialogPanel>
                </div>
            </div >
        </Dialog >
    )
}
