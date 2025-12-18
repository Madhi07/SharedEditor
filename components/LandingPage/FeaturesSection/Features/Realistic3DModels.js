import clsx from "clsx";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { FaExclamationTriangle, FaMagic, FaMars, FaPalette, FaPlay, FaUsers, FaVenus } from "react-icons/fa";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import { avatarModelsApiPath } from "@/constants/apiPaths";
import { formatLabel } from "@/utils";
import { FaCircleXmark } from "react-icons/fa6";
import useUpdateQueryParams from "@/hooks/updateQueryParams";
import Image from "next/image";
import ShowAvatar from "@/components/Modals/ShowAvatar";
import { useRouter } from "next/router";
import { MdOutlineSearchOff } from "react-icons/md";

export default function Realistic3DModels() {
    const router = useRouter();
    const [modelTab, setModelTab] = useState('male');
    const [models, setModels] = useState([]);
    const [resMessages, setResMessages] = useState({
        status: "loading",
        message: null
    });
    const [showAvatarPopup, setShowAvatarPopup] = useState({
        open: false,
        data: {},
    });
    const updateQueryParams = useUpdateQueryParams();

    useEffect(() => {
        getChatbotAvatars();
    }, []);

    const getChatbotAvatars = async () => {

        if (resMessages?.status !== "loading") {
            setResMessages(prev => ({
                ...prev,
                status: "loading",
                message: null
            }));
        }

        const response = await retrieveOrRemove("GET", avatarModelsApiPath);
        let resData = null;

        try {
            resData = await response?.json();
        }
        catch (e) { }

        if (response?.status === 200) {

            if (resData?.length > 0) {
                setModels(resData);
                setResMessages(prev => ({
                    ...prev,
                    status: "ok",
                    message: null
                }));
            }
            else {
                setResMessages(prev => ({
                    ...prev,
                    status: "ok",
                    message: resData?.message || "No realistic 3D models available."
                }));

            }

            return;

        }
        if (response?.status >= 400 && response?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to fetch the realistic 3D models."
            }));

            return
        }
        if (response?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: resData?.message || "Server error while fetching the realistic 3D models."
            }));

            return
        }

        return;
    }

    const handleOnClickModel = (data = {}) => {
        // if (Object.values(data).length === 0) return;

        // setShowAvatarPopup({
        //     open: true,
        //     data,
        // })
        router.push(`/try-now?avatar-id=${data?.id}`);

    }


    const currentModels = useMemo(() => {
        return models.filter(item => item?.gender === modelTab);
    }, [models, modelTab]);

    return (
        <Fragment>
            <div className="flex justify-center mb-8">
                <div className="flex bg-dark-bg-secondary/50 border border-white/10 rounded-full p-1">
                    <button
                        onClick={() => setModelTab('male')}
                        className={clsx("inline-flex items-center px-6 py-2 rounded-full font-medium transition-all ",
                            modelTab === "male" ? "bg-gradient-to-r from-primary to-secondary text-white" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <FaMars className="mr-2" />Male Models
                    </button>
                    <button
                        onClick={() => setModelTab('female')}
                        className={clsx("inline-flex items-center px-6 py-2 rounded-full font-medium transition-all ",
                            modelTab === "female" ? "bg-gradient-to-r from-primary to-secondary text-white" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <FaVenus className="mr-2" />Female Models
                    </button>
                </div>
            </div>

            <div id="models" className="mb-16">

                {resMessages?.status === "loading" && (
                    <ModelCardSkeleton />
                )}

                {(resMessages?.status === "err4xx" || resMessages?.status === "err5xx" || (resMessages?.status === "ok" && models.length === 0)) && (
                    <div className="p-6 bg-dark-card-primary rounded-xl max-w-lg mx-auto flex flex-col items-center justify-center">
                        {resMessages?.status === "err4xx" && (
                            <FaCircleXmark className="text-red-400 size-10" />
                        )}

                        {resMessages?.status === "err5xx" && (
                            <FaExclamationTriangle className="text-orange-400 size-10" />
                        )}

                        {(resMessages?.status === "ok" && models.length === 0) && (
                            <MdOutlineSearchOff className="text-primary size-10" />
                        )}

                        {resMessages?.message && (
                            <p className="mt-4 text-lg font-[500]">
                                {resMessages?.message}
                            </p>
                        )}


                        <button
                            onClick={async () => await getChatbotAvatars()}
                            type="button"
                            className="px-4 py-1 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-[500] mt-4"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {(resMessages?.status === "ok" && models.length >= 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentModels.map((model, index) => (
                            <div
                                onClick={() => { handleOnClickModel(model) }}
                                key={index}
                                className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6 text-center group hover:border-primary transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-full h-64 rounded-lg mb-4 bg-dark-bg-secondary/50 border border-white/10 group-hover:border-primary/50 overflow-hidden flex items-center justify-center">
                                    <Image
                                        quality={100}
                                        width={1080}
                                        height={1920}
                                        alt={model?.name || "Avatar Preview"}
                                        className="w-auto h-[90%]"
                                        src={model?.avatar_preview_image_url || ""}
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary">{model.name}</h3>
                                <p className="text-gray-400">{formatLabel(model.ethnicity)} • {formatLabel(model.type)}</p>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                        <FaUsers className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">10+ Models</h3>
                    <p className="text-gray-300">Diverse collection of professional 3D avatars</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border-white/5 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                        <FaPalette className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Full Customization</h3>
                    <p className="text-gray-300">Modify appearance to match your brand</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border-white/5 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                        <FaMagic className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI-Powered</h3>
                    <p className="text-gray-300">Realistic animations and expressions</p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Create Your Agent?</h2>
                <p className="text-gray-300 mb-6">Start building your custom 3D agent today</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={"/sign-up"}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium"
                    >
                        Try Now
                    </Link>
                    <button
                        onClick={() => { updateQueryParams({ demo: true }) }}
                        className="inline-flex items-center border border-white/20 hover:border-white/40 transition-colors px-8 py-3 rounded-full text-white font-medium"
                    >
                        <FaPlay className="mr-2" />
                        Watch Demo
                    </button>
                </div>
            </div>

            {showAvatarPopup?.open && (
                <ShowAvatar
                    data={showAvatarPopup?.data}
                    onClose={() => setShowAvatarPopup({ open: false, data: {} })}
                />
            )}
        </Fragment>
    )
}

const ModelCardSkeleton = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6"
                >
                    <div className="w-full h-64 rounded-lg mb-4 bg-gray-900 border border-white/10 overflow-hidden animate-pulse" />
                    <span className="block w-[40%] mx-auto h-4 animate-pulse bg-gray-800 rounded-lg mb-2" />
                    <span className="block w-[60%] mx-auto h-4 animate-pulse bg-gray-800 rounded-lg" />
                </div>
            ))}
        </div>
    )
}
