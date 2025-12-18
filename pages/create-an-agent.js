import CreateAnAgentCard from "@/components/CreateAnAgent";
import { agentOptions } from "@/components/CreateAnAgent/constants";
import MainLayout from "@/components/MainLayout";
import ChatInterface from "@/components/Modals/ChatInterface";
import StartWithForm from "@/components/Modals/CreateAnAgent/StartWithForm";
import { useAvatarContext } from "@/context/useAvatarContext";
import useUpdateQueryParams from "@/hooks/updateQueryParams";
import { useRouter } from "next/router";
import { useState } from "react";

export default function createAnAgentPage() {
    const router = useRouter();
    const updateQueryParam = useUpdateQueryParams();
    const { setAudio, setBlendFrames } = useAvatarContext();

    const [agentFormData, setAgentFormData] = useState({
        description: "",
        channelType: "chatbot",
    });

    const [chatboxData, setChatboxData] = useState("");

    const handleUpdateAgentFormData = (newData) => {
        setAgentFormData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    const handleAgentModals = (status = "", key, value) => {
        if (status === "open") {
            updateQueryParam({ [key]: value });
        }
        else {
            updateQueryParam({ [key]: null });
        }
    }

    const handleAgentFormSubmit = () => {
        updateQueryParam({
            type: null,
            "chat-interface": true
        });

    }

    const handleChatBoxKeyDown = async (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // optional, prevents line break in textarea or other default actions
            fetch('https://8bf6-49-206-119-155.ngrok-free.app/api/upload/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: chatboxData,
                    voice_id: "P6wmMj70MuxoYJqmlWj8"
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setChatboxData(""); // Clear chatbox after sending
                    const audio = new Audio('https://8bf6-49-206-119-155.ngrok-free.app' + data.wav_file_url)
                    setAudio(audio);
                    setBlendFrames(data.output_files.animation_frames.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    return (
        <MainLayout>
            <section id="create-agent" className="min-h-[800px] pt-32 pb-20 relative">

                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-dark-bg-primary z-0"></div>

                <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-secondary/20 filter blur-[100px] animate-pulse-slow"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Create an AI Agent</h1>
                        <p className="text-xl text-gray-300">Select a method to build your custom AI agent and start engaging with your customers</p>
                    </div>

                    <div id="agent-options" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">

                        {agentOptions.map((option) => (
                            <CreateAnAgentCard
                                key={option.id}
                                data={option}
                                btnOnClick={() => handleAgentModals('open', 'type', option.type)}
                            />
                        ))}
                    </div>

                    <div className="text-center mt-16 text-sm text-gray-400 max-w-2xl mx-auto">
                        By creating an AI Agent, you agree to our <span className="text-primary cursor-pointer hover:underline">Terms</span> and have read our <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
                    </div>
                </div>


                <StartWithForm
                    open={router?.query?.type === "form"}
                    onClose={() => handleAgentModals('close', 'type')}
                    data={agentFormData}
                    setData={handleUpdateAgentFormData}
                    submitClick={handleAgentFormSubmit}
                />

                <ChatInterface
                    open={router?.query?.["chat-interface"]}
                    onClose={() => handleAgentModals('close', "chat-interface")}
                    textBoxValue={chatboxData}
                    onTextBoxChange={setChatboxData}
                    onTextBoxKeyDown={handleChatBoxKeyDown}
                />
            </section>
        </MainLayout>
    )
}
