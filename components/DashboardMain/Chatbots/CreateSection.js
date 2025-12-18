import clsx from "clsx";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Fragment, useState } from "react";
import { deployPlatformOptions } from "./constants";
import { createOrUpdate } from "@/utils/fetchUtils";
import { chatbotsApiPath } from "@/constants/apiPaths";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCircleXmark } from "react-icons/fa6";
import { useAuthContext } from "@/context/useAuthContext";
import { useDashboardContext } from "@/context/useDashboardContext";
import { Router, useRouter } from "next/router";

export default function CreateSection({ setShowCreateSection, formChatbotData, setFormChatbotData }) {

    const router = useRouter();

    const { loginUser } = useAuthContext();

    const { setChatbots } = useDashboardContext();

    // const [formChatbotData, setFormChatbotData] = useState({
    //     name: "",
    //     platforms: []
    // });

    const [resMessages, setResMessages] = useState({
        status: null,
        message: null
    });

    const handleChatbotNameChange = (event) => {
        setFormChatbotData(prev => ({
            ...prev,
            name: event.target.value
        }))
    }

    const onPlatformClick = (id = null) => {
        if (!id) return false;

        setFormChatbotData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(id) ?
                prev.platforms.filter(item => item !== id) :
                [...prev.platforms, id]
        }));

    }

    const postChatbots = async (payload = {}) => {
        if (Object.values(payload).length === 0) return false;

        setResMessages(prev => ({
            ...prev,
            status: "loading",
            message: "Creating your chatbot..."
        }));

        const res = await createOrUpdate(payload, "POST", chatbotsApiPath, true);
        let resData = null;

        try {
            resData = await res?.json()
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Something seems wrong with your request. Please check the details and try again."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Oops! Our server is having trouble. Please try again later."
            }));
            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            setResMessages(prev => ({
                ...prev,
                status: "ok",
                message: "Your chatbot has been created successfully!"
            }));
            return resData;
        }
    }

    const handleSubmit = async () => {
        const payload = {
            name: formChatbotData?.name,
            platforms: formChatbotData?.platforms
        };
        let result = null;
        if (formChatbotData?.type === "Create") {
            payload["company"] = loginUser?.company_profile_id;
            result = await postChatbots(payload);
        }

        if (formChatbotData?.type === "Edit") {
            result = await updateChatbotById(formChatbotData?.chatbotId, payload);
        }


        if (result) {
            const timeout = setTimeout(async () => {
                clearTimeout(timeout);
                setFormChatbotData(prev => ({
                    ...prev,
                    chatbotId: "",
                    type: "Create",
                    name: "",
                    platforms: []
                }));
                setResMessages(prev => ({
                    ...prev,
                    status: null,
                    message: null
                }));

                setChatbots(prev => {
                    const exists = prev.some(cb => cb.id === result.id);
                    if (exists) {
                        return prev.map(cb => cb.id === result.id ? result : cb);
                    } else {
                        return [result, ...prev];
                    }
                });

                router.push({
                    pathname: router.pathname,
                    query: {
                        index: router?.query?.index,
                        id: result?.id
                    }
                });
                setShowCreateSection(false)

            }, 2000);
        }

        return true;
    }


    const updateChatbotById = async (id = null, payload = {}) => {

        if (!id || Object.values(payload).length === 0) return;

        setResMessages(prev => ({
            ...prev,
            status: "loading",
            message: "Updating your chatbot..."
        }));

        const res = await createOrUpdate(payload, "PATCH", `${chatbotsApiPath}${id}/`, true);
        let resData = null;

        try {
            resData = await res?.json()
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to update chatbot. Please check the details and try again."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Something went wrong on our end. Please try again later."
            }));
            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            setResMessages(prev => ({
                ...prev,
                status: "ok",
                message: "Chatbot updated successfully"
            }));
            return resData;
        }
    }

    const handleClickCancel = () => {

        setShowCreateSection(false);

        setFormChatbotData(prev => ({
            ...prev,
            chatbotId: "",
            type: "Create",
            name: "",
            platforms: []
        }));


        router.push({
            pathname: router.pathname,
            query: {
                index: router?.query?.index,
                id: formChatbotData?.chatbotId || undefined
            }
        });

    }

    return (
        <div className="flex-1 p-4 overflow-y-auto">

            <div className="text-center lg:my-12 my-8 mx-auto max-w-lg">
                <h2 className="lg:text-3xl text-2xl font-bold text-light-text-primary mb-4">
                    Select Platforms to {formChatbotData?.type} Chatbot
                </h2>
                <p className="text-lg text-light-text-secondary">
                    Choose the platforms where your chatbot will be available
                </p>
            </div>

            <div className="mx-auto max-w-4xl">
                <div className="lg:mb-8 mb-6">
                    <label
                        htmlFor="chatbot-name"
                        className="block font-[500] text-light-text-secondary mb-2 text-left"
                    >
                        Chatbot Name
                    </label>
                    <input
                        value={formChatbotData?.name}
                        onChange={handleChatbotNameChange}
                        type="text"
                        id="chatbot-name"
                        name="chatbot-name"
                        placeholder="Enter your chatbot name"
                        className="outline-none w-full px-4 py-3 rounded-xl border bg-light-card-primary border-light-border-primary focus:border-secondary text-light-text-primary"
                    />
                </div>

                <div
                    id="platform-grid"
                    className="grid xl:grid-cols-4 grid-cols-2 gap-6"
                >
                    {deployPlatformOptions.map((option) => (
                        <button
                            onClick={() => onPlatformClick(option.id)}
                            type="button"
                            key={option.id}
                            className={clsx("relative cursor-pointer group shadow-card lg:p-6 p-4 rounded-2xl transition-all duration-200 text-center w-48 bg-gradient-to-r mx-auto",
                                formChatbotData?.platforms?.includes(option.id) ? "from-primary/60 to-secondary/60" : "hover:from-primary/60 hover:to-secondary/60"
                            )}
                        >
                            {formChatbotData?.platforms?.includes(option.id) && (
                                <FaCheckCircle className="absolute text-white top-4 right-4" />
                            )}
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200/40 rounded-2xl flex items-center justify-center">
                                <option.icon
                                    className={clsx("flex-shrink-0 size-7",
                                        formChatbotData?.platforms?.includes(option.id) ? "size-8 text-primary" : "group-hover:size-8 group-hover:text-primary text-light-text-secondary"
                                    )}
                                />
                            </div>
                            <h3 className={clsx("font-semibold mb-2",
                                formChatbotData?.platforms?.includes(option.id) ? "text-white" : "text-light-text-primary group-hover:text-white"
                            )}>
                                {option.name}
                            </h3>
                            <p className={clsx("text-sm",
                                formChatbotData?.platforms?.includes(option.id) ? "text-gray-200" : "text-light-text-secondary group-hover:text-gray-200"
                            )}>
                                {option.description}
                            </p>
                        </button>
                    ))}
                </div>

                {(resMessages?.status === "ok" || resMessages?.status === "loading" || resMessages?.status === "err4xx" || resMessages?.status === "err5xx") && (
                    <div className="flex items-center justify-center mt-6">
                        {resMessages?.status === "loading" && (
                            <LuLoaderCircle className="size-6 text-secondary animate-spin flex-shrink-0" />
                        )}

                        {resMessages?.status === "ok" && (
                            <FaCheckCircle className="size-6 text-green-400 flex-shrink-0" />
                        )}

                        {resMessages?.status === "err4xx" && (
                            <FaCircleXmark className="size-6 text-red-400 flex-shrink-0" />
                        )}

                        {resMessages?.status === "err5xx" && (
                            <FaExclamationTriangle className="size-6 text-orange-400 flex-shrink-0" />
                        )}

                        {resMessages?.message && (
                            <p className="text-center text-light-text-primary ml-2.5 font-[500] text-lg">
                                {resMessages?.message}
                            </p>
                        )}
                    </div>
                )}


                {formChatbotData?.type === "Create" ? (
                    <Fragment>
                        {(formChatbotData?.name?.trim() && formChatbotData?.platforms?.length > 0 && resMessages?.status !== "ok") && (
                            <div className="text-center mt-6">
                                <button
                                    onClick={handleSubmit}
                                    disabled={resMessages?.status === "loading"}
                                    id="done-button"
                                    className="inline-flex items-center justify-center px-4 py-2 text-lg font-semibold text-white rounded-full transition-all duration-200 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    Get Started
                                </button>
                            </div>
                        )}
                    </Fragment>
                ) : (
                    <Fragment>
                        {(resMessages?.status !== "loading" && resMessages?.status !== "ok") && (
                            <div className="text-center mt-6 mx-auto flex w-max gap-4">
                                <button
                                    onClick={handleClickCancel}
                                    disabled={resMessages?.status === "loading"}
                                    className="inline-flex items-center justify-center px-4 py-2 text-lg font-semibold text-secondary rounded-full transition-all duration-200 border-2 border-secondary hover:bg-secondary hover:text-white cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!formChatbotData?.name?.trim() || formChatbotData?.platforms?.length === 0}
                                    className="inline-flex items-center justify-center px-4 py-2 text-lg font-semibold text-white rounded-full transition-all duration-200 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 cursor-pointer disabled:!cursor-not-allowed"
                                >
                                    Save Changes
                                </button>

                            </div>
                        )}
                    </Fragment>
                )}

            </div>


        </div>
    )
}
