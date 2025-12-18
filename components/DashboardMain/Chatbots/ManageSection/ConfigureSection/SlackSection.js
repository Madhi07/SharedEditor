import { FaInstagram, FaSlack, FaTrash, FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/router";
import ChatbotIntegrationInstructions from "./ChatbotIntegrationInstructions";
import { chatbotIntegrationInstructions } from "./constants";
import { Fragment } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import clsx from "clsx";

export default function SlackSection() {

    const router = useRouter();

    const { loginUser, updateLoginUser } = useAuthContext();

    const handleSlackConnect = (integrationData = {}) => {

        if (!integrationData?.accessToken) {
            window.location.href = `/api/oauth/login?provider=slack&state=${router?.query?.id}`;
            return;
        }
        else {
            const newChatbotsIntegrations = { ...loginUser?.chatbotsIntegrations };
            delete newChatbotsIntegrations?.[router?.query?.id]?.slack;
            updateLoginUser({
                chatbotsIntegrations: newChatbotsIntegrations
            });
            return;
        }
    }

    const integrationData = loginUser?.chatbotsIntegrations?.[router?.query?.id]?.slack || {}

    return (
        <div className="w-full">
            <div className="inline-flex items-center mb-4 gap-2.5">
                <FaSlack className="flex-shrink-0 size-6" />
                <h3 className="text-xl font-medium">
                    Slack
                </h3>
            </div>

            <div className="w-full xl:p-6 p-4 rounded-lg bg-light-card-primary shadow border border-light-border-primary">

                <div className="flex items-center mb-4 justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-[#4A154B] rounded-xl flex items-center justify-center mr-4" aria-hidden="true">
                            <FaSlack className="text-white text-3xl" />
                        </div>
                        <div>
                            <h2 className="text-xl text-light-text-primary font-[600]">Slack</h2>
                            <div id="instagram-status" className="flex items-center mt-1">
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
                            onClick={() => handleSlackConnect(integrationData)}
                            id="facebook-connect-btn"
                            className="w-max inline-flex gap-2 items-center justify-center bg-[#4A154B] hover:bg-[#4A154B]/80 text-white font-semibold xl:p-4 p-3 rounded-xl transition-all duration-200 focus-visible text-base"
                        >
                            {integrationData?.accessToken ?
                                <Fragment>
                                    <FaTrash className="text-xl" />
                                    Disconnect
                                </Fragment> :
                                <Fragment>
                                    <FaSlack className="text-xl" />
                                    Connect Slack
                                </Fragment>
                            }
                        </button>
                    </div>
                </div>

                <p className="text-light-text-secondary text-base mb-4">
                    Connect your Slack workspace to automatically respond to channel messages, manage customer interactions, and engage with your team in real time.
                </p>

                <ChatbotIntegrationInstructions
                    data={chatbotIntegrationInstructions.slack}
                />

            </div>
        </div>
    )
}
