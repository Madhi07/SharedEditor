import { useDashboardContext } from "@/context/useDashboardContext"
import { useEffect, useMemo, useState } from "react"
import IntegrationCard from "./IntegrationCard";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";
import { agentCustomerApiKeyApiPath, agentIntegrationDisconnectApiPath, agentIntegrationForUserApiPath, agentOauthCallbackApiPath, agentOauthUrlApiPath } from "@/constants/apiPaths";
import clsx from "clsx";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaCircleXmark, FaMagnifyingGlass } from "react-icons/fa6";
import IntegrationCardSkeleton from "./IntegrationCardSkeleton";
import { MdOutlineSearchOff } from "react-icons/md";
import { useRouter } from "next/router";
import IntegrationConnection from "@/components/Modals/Dashboard/Agents/IntegrationConnection";

export default function IntegrationsSection() {

    const router = useRouter();

    const { agentIntegrations, setAgentIntegrations } = useDashboardContext();

    const [searchTerm, setSearchTerm] = useState("");

    const [resMessages, setResMessages] = useState({
        integrations: {
            status: "ok",
            message: null
        },
        connect: {
            status: "ok",
            message: null,
            id: null
        }
    });

    const [currentOauthIntegration, setCurrentOauthIntegration] = useState({
        open: false,
        data: {}
    });

    useEffect(() => {
        initialRequirements();
    }, []);


    const initialRequirements = async () => {

        if (agentIntegrations.length > 0) return;

        setResMessages(prev => ({
            ...prev,
            integrations: {
                ...prev.integrations,
                status: "loading",
                message: null
            }
        }));

        const integrationsData = await getIntegrationsData();

        if (!integrationsData || integrationsData?.length === 0) {
            if (router?.query?.error || router?.query?.state || router?.query?.code) {
                router.push({
                    pathname: router.pathname,
                    query: {
                        index: router.query.index
                    }
                });
            }

            return;
        };

        if (router?.query?.state && router?.query?.code) {
            const integration = integrationsData?.find(item => item?.id === router?.query?.state) || null;

            if (integration?.input_schema?.length > 0) {
                setCurrentOauthIntegration(prev => ({
                    ...prev,
                    open: true,
                    data: integration
                }));
            }
            else {
                await verifyOauthConnection();
            }
        }
        else {
            if (router?.query?.error) {
                router.push({
                    pathname: router.pathname,
                    query: {
                        index: router.query.index
                    }
                });
            }
        }

    }

    const verifyOauthConnection = async () => {

        const payload = {
            integration_id: router?.query?.state,
            code: router?.query?.code,
            state: router?.query?.state,
            redirect_uri: `${process.env.WEB_URL}${window.location.pathname}`,
        }

        setResMessages(prev => ({
            ...prev,
            connect: {
                ...prev.connect,
                status: "loading",
                message: "Verifying connection...",
                id: router?.query?.state
            }
        }));

        const oauthCallbackResult = await postOauthCallback(payload);

        if (!oauthCallbackResult) {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                setResMessages(prev => ({
                    ...prev,
                    connect: {
                        ...prev.connect,
                        status: "ok",
                        message: null,
                        id: null
                    }
                }));
            }, 2000);
            router.push({
                pathname: router.pathname,
                query: {
                    index: router.query.index
                }
            });
            return;
        };

        // await getIntegrationsData();

        setAgentIntegrations(prev =>
            prev.map(item =>
                item.id === router?.query?.state ? { ...item, is_connected: oauthCallbackResult } : item
            )
        );

        setResMessages(prev => ({
            ...prev,
            connect: {
                ...prev.connect,
                status: "ok",
                message: null,
                id: null
            }
        }));

        router.push({
            pathname: router.pathname,
            query: {
                index: router.query.index
            }
        });

        return;

    }


    const postOauthCallback = async (payload = {}) => {
        const res = await createOrUpdate(payload, "POST", agentOauthCallbackApiPath, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                connect: {
                    ...prev.connect,
                    status: "err4xx",
                    message: resData?.message || "Unable to verify.",
                    id: payload?.integration_id
                }
            }));

            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                connect: {
                    ...prev.connect,
                    status: "err5xx",
                    message: res?.message || resData?.message || "Server error while verify.",
                    id: payload?.integration_id
                }
            }));

            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            return resData?.data?.success || true
        }

        return false
    }


    const getIntegrationsData = async () => {

        const res = await retrieveOrRemove("GET", agentIntegrationForUserApiPath, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                integrations: {
                    ...prev.integrations,
                    status: "err4xx",
                    message: resData?.message || "Unable to load integrations."
                }
            }));

            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                integrations: {
                    ...prev.integrations,
                    status: "err5xx",
                    message: res?.message || resData?.message || "Server error while fetching integrations."
                }
            }));

            return false;
        }

        if (res?.status === 200) {

            (resData?.length > 0) ?
                setResMessages(prev => ({
                    ...prev,
                    integrations: {
                        ...prev.integrations,
                        status: "ok",
                        message: null
                    }
                })) :
                setResMessages(prev => ({
                    ...prev,
                    integrations: {
                        ...prev.integrations,
                        status: "ok",
                        message: "No integrations added yet."
                    }
                }));
            // const newData = resData?.map(item => ({ ...item, is_connected: true }))
            setAgentIntegrations((resData?.length > 0) ? resData : []);
            return (resData?.length > 0) ? resData : []

        }

        return [];
    }


    const handleClickConnectConfigure = async (data = {}) => {
        if (Object.values(data).length === 0) return;

        if (!data?.is_connected) {

            let payload = {
                integration_id: data?.id,
            }

            if (data?.type === "oauth2") {

                payload = {
                    ...payload,
                    redirect_uri: `${process.env.WEB_URL}${window.location.pathname}`,
                    state: data?.id,
                };

                setResMessages(prev => ({
                    ...prev,
                    connect: {
                        ...prev.connect,
                        status: "loading",
                        message: "Connecting...",
                        id: data?.id
                    }
                }));

                const oauthUrl = await postOauthUrl(payload);

                if (!oauthUrl) {
                    const timeout = setTimeout(() => {
                        clearTimeout(timeout);
                        setResMessages(prev => ({
                            ...prev,
                            connect: {
                                ...prev.connect,
                                status: "ok",
                                message: null,
                                id: null
                            }
                        }));
                    }, 2000);
                    return;
                };

                setResMessages(prev => ({
                    ...prev,
                    connect: {
                        ...prev.connect,
                        status: "loading",
                        message: "Redirecting...",
                        id: data?.id
                    }
                }));

                const timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    window.location.href = oauthUrl;
                }, 1000);


            }
            else {
                setCurrentOauthIntegration(prev => ({
                    ...prev,
                    open: true,
                    data
                }));
            }

            return;
        }
        else {
            setResMessages(prev => ({
                ...prev,
                connect: {
                    ...prev.connect,
                    status: "loading",
                    message: "Disconnecting...",
                    id: data?.id
                }
            }));

            const result = await disconnectIntegrationById(data?.id);

            if (!result) {
                const timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    setResMessages(prev => ({
                        ...prev,
                        connect: {
                            ...prev.connect,
                            status: "ok",
                            message: null,
                            id: null
                        }
                    }));
                }, 2000);

                return;
            }

            // await getIntegrationsData();

            setAgentIntegrations(prev =>
                prev.map(item =>
                    item.id === data?.id ? { ...item, is_connected: result && false } : item
                )
            );

            setResMessages(prev => ({
                ...prev,
                connect: {
                    ...prev.connect,
                    status: "ok",
                    message: null,
                    id: null
                }
            }));

            return;
        }
    }

    const postOauthUrl = async (payload = {}) => {
        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", agentOauthUrlApiPath, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                connect: {
                    ...prev.connect,
                    status: "err4xx",
                    message: resData?.message || "Unable to connect.",
                    id: payload?.integration_id
                }
            }));

            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                connect: {
                    ...prev.connect,
                    status: "err5xx",
                    message: res?.message || resData?.message || "Server error while connecting.",
                    id: payload?.integration_id
                }
            }));

            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            return resData?.data?.auth_url || ""
        }

        return ""
    }

    const disconnectIntegrationById = async (id = null) => {
        if (!id) return;

        const path = agentIntegrationDisconnectApiPath.replace("<id>", id);
        const res = await retrieveOrRemove("GET", path, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {

            setResMessages(prev => ({
                ...prev,
                connect: {
                    ...prev.connect,
                    status: "err4xx",
                    message: resData?.message || "Unable to disconnect.",
                    id
                }
            }));

            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                connect: {
                    ...prev.connect,
                    status: "err5xx",
                    message: res?.message || resData?.message || "Server error while disconnect.",
                    id
                }
            }));

            return false;
        }

        if (res?.status === 204) {
            return true;
        }

        return false;
    }

    const handleIntegrationConnectionCancel = () => {
        setCurrentOauthIntegration(prev => ({
            ...prev,
            open: false,
            data: {}
        }));

        router.push({
            pathname: router.pathname,
            query: {
                index: router.query.index
            }
        });
    }

    

    const filteredIntegrations = useMemo(() => {
        return agentIntegrations?.filter(item => item?.name?.toLowerCase()?.includes(searchTerm.trim().toLowerCase()));
    }, [searchTerm, agentIntegrations])

    return (
        <div className="p-4 w-full h-full overflow-y-auto transition-all duration-300">

            <div className="flex w-full items-center justify-between mb-6">
                <div className="relative max-w-sm w-full">
                    <FaMagnifyingGlass className="dark:text-dark-text-secondary text-light-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={`Search among ${agentIntegrations?.length} integrations...`}
                        className="w-full bg-light-bg-primary rounded-xl py-2 pr-4 pl-10 outline-none border dark:border-dark-border-primary border-light-border-primary focus:border-secondary font-[500]"
                    />
                </div>
            </div>

            {resMessages?.integrations?.status === "loading" && (
                <IntegrationCardSkeleton />
            )}

            {(resMessages?.integrations?.status === "err4xx" || resMessages?.integrations?.status === "err5xx" || (resMessages?.integrations?.status === "ok" && agentIntegrations.length === 0)) && (
                <div className={clsx("flex items-center justify-center h-full")}>
                    <div className={clsx("max-w-3xl flex gap-4 items-center justify-center rounded-xl p-6 bg-light-card-primary shadow flex-col")}>
                        {resMessages?.integrations?.status === "err4xx" && (
                            <FaCircleXmark className="size-6 text-red-400" />
                        )}

                        {resMessages?.integrations?.status === "err5xx" && (
                            <FaExclamationTriangle className="size-6 text-orange-400" />
                        )}

                        {(resMessages?.integrations?.status === "ok" && agentIntegrations.length === 0) && (
                            <MdOutlineSearchOff className="size-6 text-secondary" />
                        )}

                        {resMessages?.integrations?.message && (
                            <p className="font-[500] text-lg text-center">
                                {resMessages?.integrations?.message}
                            </p>
                        )}

                        <button
                            onClick={async () => await initialRequirements()}
                            type="button"
                            className="inline-flex items-center font-[500] justify-center py-1 px-4 text-secondary border border-secondary rounded-full hover:bg-secondary hover:text-white"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            )}

            {(resMessages?.integrations?.status === "ok" && agentIntegrations.length > 0) && (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-6">
                    {filteredIntegrations?.map((item, index) => (
                        <IntegrationCard
                            key={index}
                            data={item}
                            resMessages={resMessages?.connect}
                            onConnectConfigureClick={() => handleClickConnectConfigure(item)}
                        />
                    ))}
                </div>
            )}

            {currentOauthIntegration?.open && (
                <IntegrationConnection
                    integrationData={currentOauthIntegration?.data}
                    onCancel={handleIntegrationConnectionCancel}
                />
            )}

        </div>
    )
}
