import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaPlus, FaTimes } from "react-icons/fa";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaCircleCheck } from "react-icons/fa6";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { chatbotCustomizationsWebsiteApiPath, chatPanelCustomerImagesApiPath, chatPanelCustomerVideosApiPath, chatPanelImagesApiPath, chatPanelVideosApiPath } from "@/constants/apiPaths";
import { LuLoaderCircle } from "react-icons/lu";
import clsx from "clsx";
import { useDashboardContext } from "@/context/useDashboardContext";
import { MdSearchOff } from "react-icons/md";
import { useRouter } from "next/router";

export default function AvatarBgStyles({
    open = false,
    displayMode = null,
    onClose = () => null
}) {

    const router = useRouter();

    const fileRef = useRef();

    const { chatbotCustomizationData, setChatbotCustomizationData, chatbotConfigurations, setChatbotConfigurations, chatpanelImages, setChatpanelImages, chatpanelVideos, setChatpanelVideos } = useDashboardContext();

    const [fetchingField, setFetchingField] = useState({
        chatpanel_bg_styles: {
            status: "ok",
            message: null
        }
    });

    const [patchingUrl, setPatchingUrl] = useState(null);


    console.log(chatbotCustomizationData)


    useEffect(() => {

        if (displayMode === "image" && chatpanelImages?.length === 0) {
            getChatpanelImages();
            return;
        }

        if (displayMode === "video" && chatpanelVideos?.length === 0) {
            getChatpanelVideos();
            return;
        }

    }, [displayMode])


    const getChatpanelImages = async () => {

        setFetchingField(prev => ({
            ...prev,
            chatpanel_bg_styles: {
                ...prev?.chatpanel_bg_styles,
                status: "loading",
                message: "Fetching background images..."
            }
        }));
        const res1 = await retrieveOrRemove("GET", chatPanelImagesApiPath, true);
        const res2 = await retrieveOrRemove("GET", chatPanelCustomerImagesApiPath, true);

        if ((res1?.status >= 400 && res1?.status < 500) || (res2?.status >= 400 && res2?.status < 500)) {
            setFetchingField(prev => ({
                ...prev,
                chatpanel_bg_styles: {
                    ...prev?.chatpanel_bg_styles,
                    status: "err4xx",
                    message: "Unable to fetch the background images."
                }
            }));
            return false;
        }

        if (res1?.status >= 500 || res2?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                chatpanel_bg_styles: {
                    ...prev?.chatpanel_bg_styles,
                    status: "err5xx",
                    message: "Server error while fetching the background images."
                }
            }));
            return false;
        }

        if (res1?.status === 200 && res2?.status === 200) {
            const res1Data = await res1?.json();
            const res2Data = await res2?.json();

            setChatpanelImages([...res1Data, ...res2Data]);

            if (res1Data?.length === 0 && res2Data?.length === 0) {
                setFetchingField(prev => ({
                    ...prev,
                    chatpanel_bg_styles: {
                        ...prev?.chatpanel_bg_styles,
                        status: "ok",
                        message: "No background images."
                    }
                }));
            }
            else {
                setFetchingField(prev => ({
                    ...prev,
                    chatpanel_bg_styles: {
                        ...prev?.chatpanel_bg_styles,
                        status: "ok",
                        message: null
                    }
                }));
            }

            return true;
        }
    }

    const getChatpanelVideos = async () => {

        setFetchingField(prev => ({
            ...prev,
            chatpanel_bg_styles: {
                ...prev?.chatpanel_bg_styles,
                status: "loading",
                message: "Fetching background videos..."
            }
        }));
        const res1 = await retrieveOrRemove("GET", chatPanelVideosApiPath, true);
        const res2 = await retrieveOrRemove("GET", chatPanelCustomerVideosApiPath, true);

        if ((res1?.status >= 400 && res1?.status < 500) || (res2?.status >= 400 && res2?.status < 500)) {
            setFetchingField(prev => ({
                ...prev,
                chatpanel_bg_styles: {
                    ...prev?.chatpanel_bg_styles,
                    status: "err4xx",
                    message: "Unable to fetch the background videos."
                }
            }));
            return false;
        }

        if (res1?.status >= 500 || res2?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                chatpanel_bg_styles: {
                    ...prev?.chatpanel_bg_styles,
                    status: "err5xx",
                    message: "Server error while fetching the background videos."
                }
            }));
            return false;
        }

        if (res1?.status === 200 && res2?.status === 200) {
            const res1Data = await res1?.json();
            const res2Data = await res2?.json();

            setChatpanelVideos([...res1Data, ...res2Data]);

            if (res1Data?.length === 0 && res2Data?.length === 0) {
                setFetchingField(prev => ({
                    ...prev,
                    chatpanel_bg_styles: {
                        ...prev?.chatpanel_bg_styles,
                        status: "ok",
                        message: "No background videos."
                    }
                }));
            }
            else {
                setFetchingField(prev => ({
                    ...prev,
                    chatpanel_bg_styles: {
                        ...prev?.chatpanel_bg_styles,
                        status: "ok",
                        message: null
                    }
                }));
            }




            return true;
        }
    }

    const patchWebsiteCustomizationData = async (payload = {}, field = null) => {

        if (Object.values(payload).length === 0 || !field) return;

        const res = await createOrUpdate(payload, "PATCH", `${chatbotCustomizationsWebsiteApiPath}${chatbotCustomizationData?.website?.id}/`, true);


        if (res?.status >= 400 && res?.status < 500) {
            let resData = null;
            if (res?.status === 400) {
                resData = await res?.json();
            }
            setFetchingField(prev => ({
                ...prev,
                [field]: {
                    ...prev?.[field],
                    status: "err4xx",
                    message: resData?.[field]?.[0] || "Unable to update the background style."
                }
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                [field]: {
                    ...prev?.[field],
                    status: "err5xx",
                    message: "Server issue, please try again later."
                }
            }));
            return false;
        }

        if (res?.status === 200) {
            const resData = await res?.json();
            setChatbotCustomizationData(prev => ({
                ...prev,
                website: {
                    ...prev.website,
                    ...resData
                }
            }));

            return true;
        }

    }

    const postChatpanelCustomerImage = async (payload = null, field = null) => {

        if (!payload || !field) return;

        const res = await createOrUpdate(payload, "POST", chatPanelCustomerImagesApiPath, true);

        if (res?.status >= 400 && res?.status < 500) {
            let resData = null;
            if (res?.status === 400) {
                resData = await res?.json();
            }
            setFetchingField(prev => ({
                ...prev,
                [field]: {
                    ...prev?.[field],
                    status: "err4xx",
                    message: resData?.[field]?.[0] || "Unable to upload your image."
                }
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                [field]: {
                    ...prev?.[field],
                    status: "err5xx",
                    message: "Server issue, please try again later."
                }
            }));
            return false;
        }

        if (res?.status === 201) {
            return true;
        }

    }

    const postChatpanelCustomerVideo = async (payload = null, field = null) => {

        if (!payload || !field) return;

        const res = await createOrUpdate(payload, "POST", chatPanelCustomerVideosApiPath, true);

        if (res?.status >= 400 && res?.status < 500) {
            let resData = null;
            if (res?.status === 400) {
                resData = await res?.json();
            }
            setFetchingField(prev => ({
                ...prev,
                [field]: {
                    ...prev?.[field],
                    status: "err4xx",
                    message: resData?.[field]?.[0] || "Unable to upload your video."
                }
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFetchingField(prev => ({
                ...prev,
                [field]: {
                    ...prev?.[field],
                    status: "err5xx",
                    message: "Server issue, please try again later."
                }
            }));
            return false;
        }

        if (res?.status === 201) {
            return true;
        }

    }


    const handleUploadFile = async (event) => {
        if (event.target.files.length === 0) return;

        setFetchingField(prev => ({
            ...prev,
            chatpanel_bg_styles: {
                ...prev?.chatpanel_bg_styles,
                status: "loading",
                message: `Uploading your ${displayMode}. Please wait...`
            }
        }));

        const formData = new FormData();
        formData.append("chatbot_id", router?.query?.id);

        if (displayMode === "image") {
            formData.append("image", event.target.files[0]);
            const result = await postChatpanelCustomerImage(formData, "chatpanel_bg_styles");
            if (result) {
                await getChatpanelImages();
            }
            return
        }

        if (displayMode === "video") {
            formData.append("video", event.target.files[0]);
            const result = await postChatpanelCustomerVideo(formData, "chatpanel_bg_styles");
            if (result) {
                await getChatpanelVideos();
            }
            return
        }

    }


    const handleClickStyles = async (data = {}) => {

        if (chatbotConfigurations?.configure?.website?.display_mode === "image" && data?.image_url === chatbotCustomizationData?.website?.chat_panel_image_url) return;

        if (chatbotConfigurations?.configure?.website?.display_mode === "video" && data?.video_url === chatbotCustomizationData?.website?.chat_panel_video_url) return;

        let payload = {
            display_mode: displayMode
        };

        if (displayMode === "image") {
            setPatchingUrl(data?.image_url);
            payload['image_id'] = data?.id;
            payload['chat_panel_image_type'] = data?.type;
        }

        if (displayMode === "video") {
            setPatchingUrl(data?.video_url);
            payload['video_id'] = data?.id;
            payload['chat_panel_video_type'] = data?.type;
        }

        await patchWebsiteCustomizationData(payload, "chatpanel_bg_styles");

        setChatbotConfigurations(prev => ({
            ...prev,
            configure: {
                ...prev?.configure,
                website: {
                    ...prev?.configure?.website,
                    display_mode: displayMode
                }
            }
        }));
        setPatchingUrl(null);

        return;
    }


    const chatpanelBgStyles = useMemo(() => {
        const data = displayMode === "image" ? chatpanelImages :
            displayMode === "video" ? chatpanelVideos : [];
        return data?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
    }, [chatpanelImages, chatpanelVideos]);

    return (
        <Dialog open={open} onClose={() => null} className="relative z-20">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-dark-bg-secondary/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center p-6 text-center items-center">

                    <DialogPanel
                        transition
                        className="flex flex-col dark:bg-dark-card-primary bg-light-card-primary rounded-xl max-w-xl w-full min-h-[300px] h-full max-h-[450px] border-gray-700 relative text-left transform transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="p-6 border-b border-gray-300 rounded-b-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold dark:text-dark-text-primary text-light-text-primary">
                                    {`Choose an ${displayMode === "image" ? "Image" : displayMode === "video" ? "Video" : ""}`}
                                </h3>
                                <button
                                    id="closeModal"
                                    className="dark:text-dark-text-secondary text-light-text-secondary"
                                    onClick={onClose}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto no-scrollbar flex flex-wrap gap-4 transition-all duration-300 ease-in-out">

                            {fetchingField?.chatpanel_bg_styles?.status === "loading" && (
                                <div className="p-4 w-full flex items-center justify-center gap-2.5 font-[500]">
                                    <LuLoaderCircle className="text-secondary animate-spin size-6" />
                                    <p className="text-light-text-primary">
                                        {fetchingField?.chatpanel_bg_styles?.message}
                                    </p>
                                </div>
                            )}

                            {fetchingField?.chatpanel_bg_styles?.status === "err4xx" && (
                                <div className="p-4 w-full flex items-center justify-center flex-col gap-2.5 font-[500]">
                                    <FaExclamationCircle className="text-red-400 size-8" />
                                    <p className="text-light-text-primary">
                                        {fetchingField?.chatpanel_bg_styles?.message}
                                    </p>
                                    <button
                                        onClick={async () => displayMode === "image" ? await getChatpanelImages() : displayMode === "video" ? await getChatpanelVideos() : null}
                                        type="button"
                                        className="py-0.5 px-4 rounded-full text-secondary border border-secondary hover:bg-secondary hover:text-white"
                                    >
                                        Reload
                                    </button>
                                </div>
                            )}

                            {fetchingField?.chatpanel_bg_styles?.status === "err5xx" && (
                                <div className="p-4 w-full flex items-center justify-center flex-col gap-2.5 font-[500]">
                                    <FaExclamationTriangle className="text-orange-400 size-8" />
                                    <p className="text-light-text-primary">
                                        {fetchingField?.chatpanel_bg_styles?.message}
                                    </p>
                                    <button
                                        onClick={async () => displayMode === "image" ? await getChatpanelImages() : displayMode === "video" ? await getChatpanelVideos() : null}
                                        type="button"
                                        className="py-0.5 px-4 rounded-full text-secondary border border-secondary hover:bg-secondary hover:text-white"
                                    >
                                        Reload
                                    </button>
                                </div>
                            )}

                            {fetchingField?.chatpanel_bg_styles?.status === "ok" && (
                                (chatpanelBgStyles?.length > 0) ? (
                                    <Fragment>
                                        <button
                                            type="button"
                                            title="Add New"
                                            onClick={() => fileRef?.current?.click()}
                                            className="rounded-lg overflow-hidden flex items-center justify-center w-28 h-16 dark:bg-dark-bg-primary bg-light-bg-primary hover:bg-opacity-50 shadow"
                                        >
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                id="fileInput"
                                                className="hidden"
                                                onChange={handleUploadFile}
                                                accept={displayMode === "image" ? "image/*" : displayMode === "video" ? "video/*" : undefined}
                                            />
                                            <FaPlus className="w-6 h-6 text-secondary" />
                                        </button>

                                        {chatpanelBgStyles.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleClickStyles(item)}
                                                className="rounded-lg overflow-hidden w-28 h-16 group relative cursor-pointer border dark:border-dark-border-primary border-light-border-primary"
                                            >
                                                {(displayMode === "image") &&
                                                    <Fragment>
                                                        {((chatbotCustomizationData?.website?.chat_panel_image_url === item?.image_url) && chatbotConfigurations?.configure?.website?.display_mode === "image") ?
                                                            <div className="flex items-center justify-center absolute inset-0 bg-white/20">
                                                                <FaCircleCheck className="text-secondary" />
                                                            </div> :
                                                            <div className={clsx("items-center justify-center absolute inset-0 bg-white/20",
                                                                (patchingUrl === item?.image_url) ? "flex" : "hidden group-hover:flex")}
                                                            >
                                                                {(patchingUrl === item?.image_url) &&
                                                                    <LuLoaderCircle className="text-secondary size-5 animate-spin" />
                                                                }
                                                            </div>
                                                        }

                                                        <Image
                                                            src={item?.image_url || null}
                                                            alt={"Avatar background image"}
                                                            quality={100}
                                                            width={1080}
                                                            height={1920}
                                                            loading="lazy"
                                                            className="w-full h-full flex object-fill"
                                                        />
                                                    </Fragment>
                                                }

                                                {(displayMode === "video") &&
                                                    <Fragment>
                                                        {((chatbotCustomizationData?.website?.chat_panel_video_url === item?.video_url) && chatbotConfigurations?.configure?.website?.display_mode === "video") ?
                                                            <div className="flex items-center justify-center absolute inset-0 bg-white/20">
                                                                <FaCircleCheck className="text-secondary" />
                                                            </div> :
                                                            <div className={clsx("items-center justify-center absolute inset-0 bg-white/20",
                                                                (patchingUrl === item?.video_url) ? "flex" : "hidden group-hover:flex "
                                                            )}>
                                                                {(patchingUrl === item?.video_url) &&
                                                                    <LuLoaderCircle className="text-secondary size-5 animate-spin" />
                                                                }
                                                            </div>
                                                        }

                                                        <video
                                                            src={item?.video_url || null}
                                                            alt={"Avatar background video"}
                                                            autoPlay
                                                            playsInline
                                                            loop
                                                            controls={false}
                                                            className="w-full h-full flex object-fill"
                                                        />
                                                    </Fragment>
                                                }
                                            </div>
                                        ))}
                                    </Fragment>
                                ) : (
                                    <div className="p-4 w-full flex items-center justify-center flex-col gap-2.5 font-[500]">
                                        <MdSearchOff className="text-secondary size-8" />
                                        <p className="text-light-text-primary">
                                            {fetchingField?.chatpanel_bg_styles?.message}
                                        </p>
                                        <div className="inline-flex sm:flex-row flex-col items-center gap-2">
                                            <button
                                                onClick={() => fileRef?.current?.click()}
                                                type="button"
                                                className="py-0.5 px-4 rounded-full text-secondary border border-secondary hover:bg-secondary hover:text-white"
                                            >
                                                <input
                                                    ref={fileRef}
                                                    type="file"
                                                    id="fileInput"
                                                    className="hidden"
                                                    onChange={handleUploadFile}
                                                    accept={displayMode === "image" ? "image/*" : displayMode === "video" ? "video/*" : undefined}
                                                />
                                                Add New
                                            </button>
                                            <button
                                                onClick={async () => displayMode === "image" ? await getChatpanelImages() : displayMode === "video" ? await getChatpanelVideos() : null}
                                                type="button"
                                                className="py-0.5 px-4 rounded-full text-secondary border border-secondary hover:bg-secondary hover:text-white"
                                            >
                                                Reload
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}


                        </div>
                        <div className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center mb-2">
                                <FaInfoCircle className="text-secondary mr-2" />
                                <span className="text-sm font-medium dark:text-dark-text-secondary text-light-text-secondary">
                                    All {displayMode} formats supported.
                                </span>
                            </div>

                        </div>
                    </DialogPanel>

                </div>
            </div>
        </Dialog>
    )
}
