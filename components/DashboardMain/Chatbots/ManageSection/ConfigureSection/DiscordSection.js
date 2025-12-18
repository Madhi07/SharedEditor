import { FaDiscord, FaFacebook, FaTrash } from "react-icons/fa";
import ChatbotIntegrationInstructions from "./ChatbotIntegrationInstructions";
import { chatbotIntegrationInstructions } from "./constants";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/useAuthContext";
import clsx from "clsx";
import { Fragment, useMemo } from "react";

export default function DiscordSection({ formMessages = {}, setFormMessages }) {

    const router = useRouter();

    const { loginUser, updateLoginUser } = useAuthContext();

    console.log(loginUser)

    const handleDiscordConnect = (integrationData = {}) => {

        if (!integrationData?.accessToken) {
            window.location.href = `/api/oauth/login?provider=discord&state=${router?.query?.id}`;
            return;
        }
        else {
            const newChatbotsIntegrations = { ...loginUser?.chatbotsIntegrations };
            delete newChatbotsIntegrations?.[router?.query?.id]?.discord;
            updateLoginUser({
                chatbotsIntegrations: newChatbotsIntegrations
            });
            return;
        }
    }


    const integrationData = loginUser?.chatbotsIntegrations?.[router?.query?.id]?.discord || {}

    return (
        <div className="w-full">
            <div className="inline-flex items-center mb-4 gap-2.5">
                <FaDiscord className="flex-shrink-0 size-6" />
                <h3 className="text-xl font-medium">
                    Discord
                </h3>
            </div>

            <div className="w-full xl:p-6 p-4 rounded-lg bg-light-card-primary shadow border border-light-border-primary">

                <div className="flex items-center mb-4 justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mr-4">
                            <FaDiscord className="text-white text-3xl" />
                        </div>
                        <div>
                            <h2 className="text-xl text-light-text-primary font-[600]">Discord</h2>
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
                            onClick={() => handleDiscordConnect(integrationData)}
                            className="w-max inline-flex gap-2 items-center justify-center bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white font-semibold xl:p-4 p-3 rounded-xl transition-all duration-200 focus-visible text-base"
                        >
                            {integrationData?.accessToken ?
                                <Fragment>
                                    <FaTrash className="text-xl" />
                                    Disconnect
                                </Fragment> :
                                <Fragment>
                                    <FaDiscord className="text-xl" />
                                    Connect Discord
                                </Fragment>
                            }

                        </button>
                    </div>

                </div>

                <p className="text-light-text-secondary text-base mb-4">
                    Connect your Discord server to enable automated responses through your bot.
                    This allows your chatbot to engage with users, manage messages, and support your community directly.
                </p>

                <ChatbotIntegrationInstructions
                    data={chatbotIntegrationInstructions.discord}
                />
            </div>
        </div>
    )
}

