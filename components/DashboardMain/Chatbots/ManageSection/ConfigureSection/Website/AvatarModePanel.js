import AvatarViewer from "@/components/Avatar/AvatarViewer";
import { useDashboardContext } from "@/context/useDashboardContext";
import { useMemo } from "react";
import { FaMicrophone } from "react-icons/fa";

export default function AvatarModePanel({
    handleClickPreviewPanel = () => null,
}) {

    const { chatbotConfigurations, chatbotAvatars, chatbotSitemapProcessingStatus } = useDashboardContext();

    const selectedAvatarStyle = useMemo(() => {
        return chatbotAvatars.find(style => style?.id === chatbotConfigurations?.configure?.website?.avatar);
    }, [chatbotConfigurations?.configure?.website?.avatar, chatbotAvatars]);

    return (
        <div
            onClick={handleClickPreviewPanel}
            id="chatPreview"
            className="relative flex w-[350px] h-[450px] mx-auto overflow-hidden p-4 transition-all duration-300 cursor-pointer"
        >

            {(selectedAvatarStyle?.three_d_file_url && chatbotSitemapProcessingStatus?.is_ready) && (
                <AvatarViewer
                    avatarId={selectedAvatarStyle?.id}
                    avatarPath={selectedAvatarStyle?.three_d_file_url}
                    avatarThumbnail={selectedAvatarStyle?.avatar_preview_image_url}
                    animationName={'relaxing'}
                />
            )}

            {chatbotConfigurations?.configure?.website?.mic_button_icon &&
                <button className="absolute bottom-10 right-4 flex-shrink-0 w-10 h-10 rounded-full from-primary to-secondary bg-gradient-to-r flex items-center justify-center">
                    <FaMicrophone className="text-white size-5" />
                </button>
            }

        </div>
    )
}
