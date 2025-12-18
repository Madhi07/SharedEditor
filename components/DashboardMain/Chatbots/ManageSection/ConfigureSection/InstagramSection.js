import { FaCheckCircle, FaExclamationTriangle, FaInstagram, FaTrash } from "react-icons/fa";
import ChatbotIntegrationInstructions from "./ChatbotIntegrationInstructions";
import { chatbotIntegrationInstructions } from "./constants";
import { useAuthContext } from "@/context/useAuthContext";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { chatbotCustomizationsDisconnectInstagramApiPath, chatbotCustomizationsInstagramApiPath, chatbotInstagramPageListApiPath } from "@/constants/apiPaths";
import { useDashboardContext } from "@/context/useDashboardContext";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCircleXmark } from "react-icons/fa6";
import Link from "next/link";
import { formatLabel } from "@/utils";
import { chatbotConfigurationData } from "../constants";
import Image from "next/image";

export default function InstagramSection({ formMessages = {}, setFormMessages }) {

    const router = useRouter();

    const { loginUser, updateLoginUser } = useAuthContext();

    const { chatbotCustomizationData, chatbotConfigurations, setChatbotConfigurations, chatbotInstagramPages, setChatbotInstagramPages, setChatbotCustomizationData } = useDashboardContext();

    const [component, setComponent] = useState("instructions");

    console.log(chatbotConfigurations)

    const [resMessages, setResMessages] = useState({
        status: null,
        message: null
    });

    const [fetchField, setFetchField] = useState({
        connection: {
            status: null,
            message: null
        },
        events: {
            name: null,
            status: null,
            message: null
        }
    });

    useEffect(() => {
        initialRequirements();
    }, []);

    const initialRequirements = async () => {

        if (!chatbotConfigurations?.configure?.instagram?.page_id) {
            // let fbPageListRes = null;
            if (router?.query?.code && router?.query?.provider === "instagram") {
                setResMessages(prev => ({
                    ...prev,
                    status: "loading",
                    message: "Connecting your instagram account..."
                }));

                const accessTokenRes = await getAccessToken();

                if (accessTokenRes) {
                    const fbPageListRes = await getChatbotInstagramPageList({
                        access_token: accessTokenRes?.accessToken
                    });

                    if (fbPageListRes) {
                        setResMessages(prev => ({
                            ...prev,
                            status: null,
                            message: null
                        }));

                        setComponent("select-page");
                    }

                    router.replace({
                        pathname: router.pathname,
                        query: {
                            index: router?.query?.index,
                            id: router?.query?.state,
                        }
                    });
                }
            }
            else {
                if (chatbotInstagramPages?.length > 0) {
                    setComponent("select-page");
                }
                else {
                    setComponent("instructions");
                }
            }
        }
        else {
            setComponent("connected");
        }

    };

    const patchChatbotInstagramCustomizationById = async (id = null, payload = {}) => {
        if (!id || Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "PATCH", `${chatbotCustomizationsInstagramApiPath}${id}/`, true);
        let resData = null;

        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: "We couldn't connect to Instagram Page. Please reconnect your account and try again."
            }));
            return false
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || "Instagram is temporarily unavailable. Please try again in a few minutes."
            }));
            return false
        }

        if (res?.status === 200 || res?.status === 201) {
            // setResMessages(prev => ({
            //     ...prev,
            //     status: "ok",
            //     message: null
            // }));
            return resData || false
        }

        return false;

    }

    const disconnectInstagram = async (id = null) => {
        if (!id) return;

        const path = chatbotCustomizationsDisconnectInstagramApiPath.replace("<id>", id);
        const res = await retrieveOrRemove("GET", path, true);
        let resData = null;

        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: "Unable to disconnect the Instagram Account. Please try again."
            }));
            return false
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || "Instagram is temporarily unavailable. Please try again in a few minutes."
            }));
            return false
        }

        if (res?.status === 200 || res?.status === 201) {
            return resData || false
        }

        return false;
    }

    const handleInstagramConnect = async () => {

        if (!chatbotConfigurations?.configure?.instagram?.page_id) {
            setFetchField(prev => ({
                ...prev,
                connection: {
                    ...prev.connection,
                    status: "loading",
                    message: "Connecting..."
                }
            }))
            window.location.href = `/api/oauth/login?provider=instagram&state=${router?.query?.id}`;
            return;
        }
        else {
            setFetchField(prev => ({
                ...prev,
                connection: {
                    ...prev.connection,
                    status: "loading",
                    message: "Disconnecting..."
                }
            }));

            const result = await disconnectInstagram(chatbotCustomizationData?.instagram?.id);
            if (!result) return;

            setChatbotCustomizationData(prev => ({
                ...prev,
                instagram: {
                    ...prev?.instagram,
                    ...result?.data
                }
            }));

            handlePageConnectCancel();

            setFetchField(prev => ({
                ...prev,
                connection: {
                    ...prev.connection,
                    status: null,
                    message: null
                }
            }));



            return;
        }
    }

    const getAccessToken = async () => {
        const res = await fetch(
            `${process.env.WEB_URL}/api/get-token?provider=${router?.query?.provider}`,
            {
                method: "GET"
            }
        );

        let resData = null;

        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: "We couldn't connect to Instagram. Please reconnect your account and try again."
            }));
            return false
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || "Instagram is temporarily unavailable. Please try again in a few minutes."
            }));
            return false
        }

        if (res?.status === 200 || res?.status === 201) {
            // setResMessages(prev => ({
            //     ...prev,
            //     status: "ok",
            //     message: null
            // }));
            return resData || false
        }

        return false
    }

    const getChatbotInstagramPageList = async (payload = {}) => {
        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", chatbotInstagramPageListApiPath, true);

        let resData = null;

        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: "We couldn't access your Instagram Accounts. Please check your permissions or reconnect your account."
            }));
            return false
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || "Instagram is temporarily unavailable. Please try again in a few minutes."
            }));
            return false
        }

        if (res?.status === 200 || res?.status === 201) {
            if (resData?.data?.length === 0) {
                setResMessages(prev => ({
                    ...prev,
                    status: "no-data",
                    message: "No Instagram Accounts found. Make sure you've selected Pages you manage during connection"
                }));

                return false
            }
            setChatbotInstagramPages(resData?.data);
            return resData?.data || []
        }

        return false

    }

    const handlePageConnect = async () => {
        setFetchField(prev => ({
            ...prev,
            connection: {
                ...prev.connection,
                status: "loading",
                message: "Connecting..."
            }
        }));

        const payload = {
            page_id: chatbotConfigurations?.configure?.instagram?.page_id,
            access_token: chatbotConfigurations?.configure?.instagram?.metadata?.access_token,
            metadata: chatbotConfigurations?.configure?.instagram?.metadata
        }

        const resData = await patchChatbotInstagramCustomizationById(chatbotCustomizationData?.instagram?.id, payload);

        if (!resData) {
            return;
        }

        setChatbotCustomizationData(prev => ({
            ...prev,
            instagram: {
                ...prev?.instagram,
                ...resData
            }
        }));

        setChatbotConfigurations(prev => ({
            ...prev,
            configure: {
                ...prev.configure,
                instagram: {
                    ...prev.configure.instagram,
                    events: resData?.events
                }
            }
        }));

        setComponent("connected");

        setFetchField(prev => ({
            ...prev,
            connection: {
                ...prev.connection,
                status: null,
                message: null
            }
        }));

    }

    const handlePageClick = (data = {}) => {
        if (Object.values(data).length === 0) return;

        setChatbotConfigurations(prev => ({
            ...prev,
            configure: {
                ...prev.configure,
                instagram: {
                    ...prev.configure.instagram,
                    page_id: data?.instagram_business_account?.id,
                    metadata: data
                }
            }
        }));
    }

    const handlePageConnectCancel = () => {
        setChatbotInstagramPages([]);
        const instagramConfigurations = chatbotConfigurationData.find(item => item?.step === "configure")?.data?.instagram;
        setChatbotConfigurations(prev => ({
            ...prev,
            configure: {
                ...prev.configure,
                instagram: instagramConfigurations
            }
        }));
        setComponent("instructions");
    }

    const handleRetry = () => {
        setResMessages(prev => ({
            ...prev,
            status: null,
            message: null
        }));
        setFetchField(prev => ({
            ...prev,
            connection: {
                ...prev.connection,
                status: null,
                message: null
            }
        }));
        // setComponent("instructions")

    }

    const handleWebhookEventsChange = async (data = {}) => {

        if (Object.values(data).length === 0) return;

        const newEvents = chatbotConfigurations?.configure?.instagram?.events?.map(item =>
            (item?.name === data?.name) ?
                {
                    ...item,
                    enabled: !item?.enabled
                } :
                item
        );

        setFetchField(prev => ({
            ...prev,
            events: {
                ...prev.events,
                name: data?.name,
                status: "loading",
                message: null
            }
        }));

        const payload = {
            events: newEvents
        }

        const resData = await patchChatbotInstagramCustomizationById(chatbotCustomizationData?.instagram?.id, payload);

        if (!resData) {
            return;
        }

        setChatbotCustomizationData(prev => ({
            ...prev,
            instagram: {
                ...prev?.instagram,
                ...resData
            }
        }));

        setChatbotConfigurations(prev => ({
            ...prev,
            configure: {
                ...prev.configure,
                instagram: {
                    ...prev.configure.instagram,
                    events: resData?.events
                }
            }
        }));

        setFetchField(prev => ({
            ...prev,
            events: {
                ...prev.events,
                name: null,
                status: null,
                message: null
            }
        }));
    }

    return (
        <div className="w-full">
            <div className="inline-flex items-center mb-4 gap-2.5">
                <FaInstagram className="flex-shrink-0 size-6" />
                <h3 className="text-xl font-medium">
                    Instagram
                </h3>
            </div>

            <div className="w-full xl:p-6 p-4 rounded-lg bg-light-card-primary shadow border border-light-border-primary">

                {(resMessages?.status === "loading" || resMessages?.status === "err4xx" || resMessages?.status === "err5xx") ? (
                    <div className={clsx("flex items-center justify-center p-4 text-center gap-2.5",
                        resMessages?.status === "loading" ? "flex-row" : "flex-col"
                    )}>
                        {resMessages?.status === "loading" && (
                            <LuLoaderCircle className="animate-spin text-2xl text-secondary" />
                        )}

                        {resMessages?.status === "err4xx" && (
                            <FaCircleXmark className="text-2xl text-red-400" />
                        )}

                        {resMessages?.status === "err5xx" && (
                            <FaExclamationTriangle className="text-2xl text-orange-400" />
                        )}

                        {resMessages?.message && (
                            <p className="text-light-text-primary text-lg font-[500]">
                                {resMessages?.message}
                            </p>
                        )}

                        {resMessages?.status !== "loading" && (
                            <button
                                onClick={handleRetry}
                                className="inline-flex rounded-full items-center justify-center px-4 py-1 font-[500] from-primary to-secondary bg-gradient-to-r text-white hover:opacity-90"
                            >
                                Retry
                            </button>
                        )}
                    </div>
                ) : (
                    <Fragment>

                        {(component === "instructions" || component === "connected") && (
                            <div className="flex items-center mb-4 justify-between">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mr-4">
                                        <FaInstagram className="text-white text-3xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl text-light-text-primary font-[600]">Instagram</h2>
                                        <div className="flex items-center mt-1">
                                            {chatbotConfigurations?.configure?.instagram?.page_id && (
                                                <Fragment>
                                                    <Link
                                                        target="_blank"
                                                        className="text-light-text-secondary font-[500] underline"
                                                        href={`https://instagram.com/${chatbotConfigurations?.configure?.instagram?.metadata?.instagram_business_account?.username}`}
                                                    >
                                                        {chatbotConfigurations?.configure?.instagram?.metadata?.instagram_business_account?.username} ({chatbotConfigurations?.configure?.instagram?.metadata?.name})
                                                    </Link>
                                                    <span className="mx-1.5">|</span>
                                                </Fragment>
                                            )}
                                            <div className={clsx("w-2 h-2 rounded-full mr-2",
                                                (chatbotConfigurations?.configure?.instagram?.page_id) ? "bg-green-400" : "bg-gray-400"
                                            )} />
                                            <span className={clsx("text-sm font-medium",
                                                (chatbotConfigurations?.configure?.instagram?.page_id) ? "text-green-400" : "text-light-text-secondary"
                                            )}>
                                                {(chatbotConfigurations?.configure?.instagram?.page_id) ?
                                                    "Connected" :
                                                    "Not Connected"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        disabled={fetchField?.connection?.status === "loading"}
                                        onClick={handleInstagramConnect}
                                        className="w-max gap-2 inline-flex items-center justify-center bg-gradient-to-r from-primary to-secondary hover:opacity-80 text-white font-semibold xl:p-4 p-3 rounded-xl transition-all duration-200 focus-visible text-base flex-shrink-0 disabled:opacity-80"
                                    >
                                        {chatbotConfigurations?.configure?.instagram?.page_id ?
                                            <Fragment>
                                                {fetchField?.connection?.status === "loading" ?
                                                    <Fragment>
                                                        <LuLoaderCircle className="text-xl animate-spin" />
                                                        {fetchField.connection.message}
                                                    </Fragment> :
                                                    <Fragment>
                                                        <FaTrash className="text-xl" />
                                                        Disconnect
                                                    </Fragment>
                                                }
                                            </Fragment> :
                                            <Fragment>
                                                {fetchField?.connection?.status === "loading" ?
                                                    <Fragment>
                                                        <LuLoaderCircle className="text-xl animate-spin" />
                                                        {fetchField.connection.message}
                                                    </Fragment> :
                                                    <Fragment>
                                                        <FaInstagram className="text-xl" />
                                                        Connect Instagram
                                                    </Fragment>
                                                }
                                            </Fragment>
                                        }
                                    </button>
                                </div>

                            </div>
                        )}

                        {component === "instructions" && (
                            <Fragment>

                                <p className="text-light-text-secondary text-base mb-4">
                                    Connect your Instagram Business account to automatically respond to direct messages and engage with your followers.
                                </p>

                                <ChatbotIntegrationInstructions
                                    data={chatbotIntegrationInstructions.instagram}
                                />
                            </Fragment>
                        )}

                        {component === "select-page" && (
                            <Fragment>
                                <h2 className="text-lg text-light-text-primary font-[600] mb-4">
                                    Choose any one Instagram Account to connect
                                </h2>

                                <div className="overflow-hidden w-full rounded-lg border border-light-border-primary bg-light-bg-primary mb-4">
                                    <table className="table-auto w-full text-left">
                                        <thead>
                                            <tr className="border-b border-light-border-primary">
                                                <th className="p-4 font-[600] text-light-text-primary">
                                                    Instagram Accounts
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {chatbotInstagramPages.map((item, index) => (
                                                <tr
                                                    onClick={() => handlePageClick(item)}
                                                    key={index}
                                                    className={clsx("border-b border-light-border-primary cursor-pointer hover:bg-secondary/5",
                                                        (chatbotConfigurations?.configure?.instagram?.page_id === item?.instagram_business_account?.id) ? "bg-secondary/5" : "hover:bg-secondary/5"
                                                    )}
                                                >
                                                    <td className="py-3 px-4 text-light-text-primary flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-8 overflow-hidden inline-flex items-center justify-center rounded-full bg-primary/70 text-center font-[500] text-white">

                                                                <Image
                                                                    src={item?.instagram_business_account?.profile_picture_url || ""}
                                                                    alt={"Instagram Profile Picture"}
                                                                    quality={100}
                                                                    width={1024}
                                                                    height={1024}
                                                                    className="w-full h-full"
                                                                />
                                                            </div>
                                                            <span className="block font-[500] text-light-text-primary">
                                                                {item?.instagram_business_account?.username} ({item?.name})
                                                            </span>
                                                        </div>

                                                        {(chatbotConfigurations?.configure?.instagram?.page_id === item?.instagram_business_account?.id) && (
                                                            <FaCheckCircle className="text-green-400" />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex gap-4 items-center justify-center ml-auto w-max">
                                    <button
                                        onClick={handlePageConnectCancel}
                                        type="button"
                                        className="bg-gray-100 font-[500] rounded-full px-4 py-1.5 hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePageConnect}
                                        disabled={fetchField?.connection?.status === "loading" || !chatbotConfigurations?.configure?.instagram?.page_id}
                                        type="button"
                                        className="font-[500] rounded-full px-4 py-1.5 bg-gradient-to-r from-primary to-secondary hover:opacity-80 text-white disabled:opacity-80 inline-flex gap-2 items-center"
                                    >
                                        {fetchField?.connection?.status === "loading" ?
                                            <Fragment>
                                                <LuLoaderCircle className="animate-spin" />
                                                {fetchField.connection.message}
                                            </Fragment> :
                                            <Fragment>
                                                Connect
                                            </Fragment>
                                        }
                                    </button>
                                </div>
                            </Fragment>
                        )}

                        {component === "connected" && (
                            <Fragment>
                                <h3 className="text-lg font-semibold mb-3">
                                    Webhook Subscriptions
                                </h3>

                                <div className="space-y-2 w-full">
                                    {chatbotConfigurations?.configure?.instagram?.events?.map((item, index) => (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h6 className="font-[500] text-light-text-primary">
                                                    {item?.name}
                                                </h6>
                                                {(fetchField?.events?.status === "loading" && fetchField?.events?.name === item?.name) ? (
                                                    <LuLoaderCircle className="flex-shrink-0 text-xl text-secondary animate-spin" />
                                                ) : (
                                                    <ToggleSwitch
                                                        checked={item?.enabled}
                                                        onChange={() => handleWebhookEventsChange(item)}
                                                    />
                                                )}
                                            </div>
                                            <p className="text-sm text-light-text-secondary">
                                                {item?.description}
                                            </p>
                                        </div>
                                    ))}

                                </div>
                            </Fragment>
                        )}
                    </Fragment>
                )}



            </div>
        </div>
    )
}


const ToggleSwitch = ({ checked = false, onChange }) => {
    return (
        <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 outline-offset-2 outline-secondary ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out has-[:checked]:bg-secondary has-[:focus-visible]:outline has-[:focus-visible]:outline-2">
            <span className="size-5 rounded-full bg-light-card-primary shadow-sm ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-[:checked]:translate-x-5" />
            <input
                type="checkbox"
                onChange={onChange}
                checked={checked}
                className="absolute inset-0 appearance-none focus:outline-none cursor-pointer"
            />
        </div>
    )
}