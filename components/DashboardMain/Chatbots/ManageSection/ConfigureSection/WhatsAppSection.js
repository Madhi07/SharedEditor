import { FaTrash, FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/router";
import ChatbotIntegrationInstructions from "./ChatbotIntegrationInstructions";
import { chatbotIntegrationInstructions } from "./constants";
import { useAuthContext } from "@/context/useAuthContext";
import { Fragment } from "react";
import clsx from "clsx";

export default function WhatsAppSection({ formMessages = {}, setFormMessages }) {

    const router = useRouter();

    const { loginUser, updateLoginUser } = useAuthContext();

    const handleWhatsAppConnect = (integrationData = {}) => {

        if (!integrationData?.accessToken) {
            window.location.href = `/api/oauth/login?provider=whatsapp&state=${router?.query?.id}`;
            return;
        }
        else {
            const newChatbotsIntegrations = { ...loginUser?.chatbotsIntegrations };
            delete newChatbotsIntegrations?.[router?.query?.id]?.whatsapp;
            updateLoginUser({
                chatbotsIntegrations: newChatbotsIntegrations
            });
            return;
        }
    }

    const integrationData = loginUser?.chatbotsIntegrations?.[router?.query?.id]?.whatsapp || {}

    return (
        <div className="w-full">
            <div className="inline-flex items-center mb-4 gap-2.5">
                <FaWhatsapp className="flex-shrink-0 size-6" />
                <h3 className="text-xl font-medium">
                    WhatsApp
                </h3>
            </div>

            <div className="w-full xl:p-6 p-4 rounded-lg bg-light-card-primary shadow border border-light-border-primary">

                <div className="flex items-center mb-4 justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4" aria-hidden="true">
                            <FaWhatsapp className="text-white text-3xl" />
                        </div>
                        <div>
                            <h2 className="text-xl text-light-text-primary font-[600]">WhatsApp</h2>
                            <div className="flex items-center mt-1" role="status" aria-live="polite">
                                <div className={clsx("w-2 h-2 rounded-full mr-2",
                                    (integrationData?.accessToken) ? "bg-green-400" : "bg-gray-400"
                                )} />
                                <span className={clsx("text-sm font-medium ",
                                    (integrationData?.accessToken) ? "text-green-400" : "text-light-text-secondary"
                                )}>
                                    {(integrationData?.accessToken) ?
                                        "Connected" :
                                        "Not Connected"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => handleWhatsAppConnect(integrationData)}
                            id="facebook-connect-btn"
                            className="w-max gap-2 inline-flex items-center justify-center bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white font-semibold xl:p-4 p-3 rounded-xl transition-all duration-200 focus-visible text-base"
                        >
                            {integrationData?.accessToken ?
                                <Fragment>
                                    <FaTrash className="text-xl" />
                                    Disconnect
                                </Fragment> :
                                <Fragment>
                                    <FaWhatsapp className="text-xl" />
                                    Connect WhatsApp
                                </Fragment>
                            }
                        </button>
                    </div>
                </div>

                <p className="text-light-text-secondary text-base mb-4">
                    Connect your WhatsApp Business account to enable automated messaging. Perfect for customer support and engagement.
                </p>

                <ChatbotIntegrationInstructions
                    data={chatbotIntegrationInstructions.whatsapp}
                />

            </div>
        </div>
    )
}
