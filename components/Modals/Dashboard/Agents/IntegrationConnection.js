import { agentCustomerApiKeyApiPath, agentCustomerDatabaseCredentialApiPath, agentOauthCallbackApiPath } from "@/constants/apiPaths";
import { useDashboardContext } from "@/context/useDashboardContext";
import { createOrUpdate } from "@/utils/fetchUtils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function IntegrationConnection({ integrationData = {}, onCancel, verifyOauthConnection }) {

    const router = useRouter();

    const { setAgentIntegrations } = useDashboardContext();

    const [resMessages, setResMessages] = useState({
        status: null,
        message: null
    });

    const postCustomerApiKey = async (payload = {}) => {

        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", agentCustomerApiKeyApiPath, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {

            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.detail || resData?.message || "Unable to connect.",
            }));


            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Server error while connecting.",
            }));

            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            return resData
        }

        return {}
    }

    const postCustomerDatabaseCredential = async (payload = {}) => {

        if (Object.values(payload).length === 0) return;

        const res = await createOrUpdate(payload, "POST", agentCustomerDatabaseCredentialApiPath, true);
        let resData = null;
        try {
            resData = await res?.json();
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {

            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.detail || resData?.message || "Unable to connect.",
            }));


            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Server error while connecting.",
            }));

            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            return resData
        }

        return {}
    }

    const handleOnSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        await handleIntegrationConnect({
            ...Object.fromEntries(formData.entries())
        });

    }

    const handleIntegrationConnect = async (data = {}) => {

        if (Object.values(data).length === 0) return;

        setResMessages(prev => ({
            ...prev,
            status: "loading",
            message: "Connecting...",
        }));

        let payload = {
            integration_id: router?.query?.state || integrationData?.id,
        }

        let result = false;

        if (integrationData?.type === "oauth2") {
            payload = {
                ...payload,
                input_schema: data,
                code: router?.query?.code,
                state: router?.query?.state,
                redirect_uri: `${process.env.WEB_URL}${window.location.pathname}`,
            }
            const callbackRes = await postOauthCallback(payload);

            if (!callbackRes) return;

            result = callbackRes;

        }
        else {
            payload = {
                ...payload,
                ...data
            };

            let connectRes = null;

            if (integrationData?.type === "api_key") {
                connectRes = await postCustomerApiKey(payload)
            }

            if (integrationData?.type === "database") {
                connectRes = await postCustomerDatabaseCredential(payload);
            }

            if (!connectRes || Object.values(connectRes).length === 0) return;

            result = true;

        }

        setAgentIntegrations(prev =>
            prev.map(item =>
                item.id === integrationData?.id ? { ...item, is_connected: result } : item
            )
        );

        onCancel?.();

        setResMessages(prev => ({
            ...prev,
            status: null,
            message: null,
        }));

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
                status: "err4xx",
                message: resData?.detail || resData?.message || "Unable to connect.",
            }));

            return false;
        }

        if (res?.status >= 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Server error while connecting.",
            }));

            return false;
        }

        if (res?.status === 200 || res?.status === 201) {
            return resData?.data?.success || true
        }

        return false
    }

    const { input_schema = [] } = integrationData;

    return (
        <Dialog open={true} onClose={() => null} className="relative z-20">
            <DialogBackdrop
                transition
                className="fixed z-10 inset-0 bg-dark-bg-secondary/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />


            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center p-6 text-center items-center">
                    <DialogPanel
                        transition
                        className="flex w-full relative transform transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="dark:bg-dark-card-primary bg-light-card-primary rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 md:mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold dark:text-dark-text-primary text-light-text-primary">
                                    {`Connect ${integrationData?.title || "Integration"}`}
                                </h3>
                            </div>

                            <form
                                className="space-y-4 text-left"
                                onSubmit={handleOnSubmit}
                            >

                                {input_schema?.map((item) => (
                                    <div key={item?.field}>
                                        <label className="block text-sm font-medium dark:text-dark-text-secondary text-light-text-secondary mb-2">
                                            {item?.label}
                                        </label>
                                        {item?.type === "text" && (
                                            <input
                                                pattern=".*\S.*"
                                                type={"text"}
                                                name={item?.field}
                                                placeholder={`Enter ${item?.label}`}
                                                className="dark:text-dark-text-primary text-light-text-primary w-full px-3 py-2 dark:bg-dark-bg-primary bg-light-bg-primary border dark:border-dark-border-primary border-light-border-primary rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                                required={item?.required}
                                            />
                                        )}
                                        {item?.type === "number" && (
                                            <input
                                                type={"number"}
                                                min={item?.min}
                                                max={item?.max}
                                                name={item?.field}
                                                placeholder={`Enter ${item?.label}`}
                                                className="dark:text-dark-text-primary text-light-text-primary w-full px-3 py-2 dark:bg-dark-bg-primary bg-light-bg-primary border dark:border-dark-border-primary border-light-border-primary rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                                required={item?.required}
                                            />
                                        )}
                                        {item?.type === "email" && (
                                            <input
                                                type={"email"}
                                                name={item?.field}
                                                placeholder={`Enter ${item?.label}`}
                                                className="dark:text-dark-text-primary text-light-text-primary w-full px-3 py-2 dark:bg-dark-bg-primary bg-light-bg-primary border dark:border-dark-border-primary border-light-border-primary rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                                                required={item?.required}
                                            />
                                        )}


                                    </div>
                                ))}

                                {(resMessages?.status === "err4xx" || resMessages?.status === "err5xx") && (
                                    <div className="flex items-center gap-2">

                                        {resMessages?.status === "err4xx" && (
                                            <FaCircleXmark className="text-red-400 flex-shrink-0" />
                                        )}

                                        {resMessages?.status === "err5xx" && (
                                            <FaExclamationTriangle className="text-orange-400 flex-shrink-0" />
                                        )}

                                        {resMessages?.message && (
                                            <p className={clsx("text-sm font-[500]",
                                                resMessages?.status === "err4xx" && "text-red-400",
                                                resMessages?.status === "err5xx" && "text-orange-400",
                                            )}>
                                                {resMessages?.message}
                                            </p>
                                        )}
                                    </div>
                                )}


                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={onCancel}
                                        type="button"
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resMessages?.status === "loading"}
                                        className="px-4 py-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-sm font-medium rounded-lg transition-colors disabled:from-primary/90 disabled:to-secondary/90"
                                    >
                                        {resMessages?.status === "loading" ?
                                            <Fragment>
                                                <LuLoaderCircle className="animate-spin flex-shrink-0" />
                                                {resMessages?.message}
                                            </Fragment> :
                                            "Connect"
                                        }

                                    </button>
                                </div>
                            </form>


                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
