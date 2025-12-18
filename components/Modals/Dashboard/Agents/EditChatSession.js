import { agentChatSessionsApiPath } from "@/constants/apiPaths";
import { useDashboardContext } from "@/context/useDashboardContext";
import { createOrUpdate } from "@/utils/fetchUtils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function EditChatSession({
    data = {},
    onCancelClick,
}) {

    const { setAgentChatSessions } = useDashboardContext();

    const [formDataChatSession, setFormDataChatSession] = useState({
        title: data?.data?.title || "",
    });

    const [resMessages, setResMessages] = useState({
        status: null,
        message: null
    });

    const updateChatSessionById = async (id = null, payload = {}) => {
        if (!id || Object.values(payload).length === 0) return;

        setResMessages(prev => ({
            ...prev,
            status: "loading",
            message: "Updating your chat..."
        }));

        const res = await createOrUpdate(payload, "PATCH", `${agentChatSessionsApiPath}${id}/`, true);
        let resData = null;

        try {
            resData = await res?.json()
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setResMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to update the chat details. Please try again."
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
                message: "Chat details updated successfully"
            }));
            return resData;
        }
    }

    const handleClickUpdate = async () => {

        if (Object.values(formDataChatSession).length === 0) return;

        const payload = {
            ...formDataChatSession,
        }
        const result = await updateChatSessionById(data?.sessionId, payload);
        if (result) {
            const timeout = setTimeout(async () => {
                clearTimeout(timeout);
                onCancelClick();
                setAgentChatSessions(prev =>
                    prev.map(session =>
                        session.id === data?.sessionId ? { ...session, ...result } : session
                    )
                );
            }, 2000)
        }
    }

    const handleChatSessionTitleChange = (event) => {
        setFormDataChatSession(prev => ({
            ...prev,
            title: event.target.value
        }))
    }


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
                        <div className="bg-light-bg-primary rounded-2xl shadow-lg p-8 w-full max-w-2xl mx-auto flex flex-col ">

                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-semibold text-light-text-primary">Edit Chat</h2>
                                {resMessages?.status !== "loading" && (
                                    <button
                                        onClick={onCancelClick}
                                        className="text-light-text-secondary hover:text-black text-xl"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar mb-4">

                                <div className="mb-6">
                                    <label
                                        for="chatbot-name"
                                        className="block font-[500] text-light-text-secondary mb-2 text-left"
                                    >
                                        Chat Title
                                    </label>
                                    <input
                                        required
                                        value={formDataChatSession?.title}
                                        onChange={handleChatSessionTitleChange}
                                        type="text"
                                        id="chat-session-name"
                                        name="chat-session-name"
                                        placeholder="Enter your session title"
                                        className="outline-none w-full px-4 py-3 rounded-xl border bg-light-card-primary border-light-border-primary focus:border-secondary text-light-text-primary"
                                    />
                                </div>
                            </div>

                            {(resMessages?.status === "loading" || resMessages?.status === "ok" || resMessages?.status === "err4xx" || resMessages?.status === "err5xx") ?
                                <div className="flex items-center gap-2.5 justify-center">
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
                                        <p className="text-center text-light-text-primary font-[500] text-lg">
                                            {resMessages?.message}
                                        </p>
                                    )}
                                </div> :
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={onCancelClick}
                                        className="px-4 py-2 rounded-lg border border-light-border-primary text-light-text-secondary hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleClickUpdate}
                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            }
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )

}
