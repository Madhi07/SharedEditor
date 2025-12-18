import { websocketNotificationApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import useSocket from "@/hooks/useSocket";
import { getRelativeTime } from "@/utils";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { FaBell, FaTrash } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export default function NotificationPopover() {

    const router = useRouter();

    const { loginUser, loading, deleteLoginUser, updateLoginUser } = useAuthContext();

    const { connect, socketData } = useSocket();

    useEffect(() => {
        if (loading) return;

        connectNotificationSocket();
    }, [loading]);


    useEffect(() => {

        saveNotifications();

    }, [socketData]);


    const connectNotificationSocket = async () => {
        if (!loginUser?.company_profile_id) return;

        const wsUrl = `${process.env.BASE_WS_DOMAIN}${websocketNotificationApiPath.replace("<company_profile_id>", loginUser?.company_profile_id)}?is_admin=true`;
        await connect(wsUrl);
    }


    const saveNotifications = () => {
        if (!socketData || Object.keys(socketData).length === 0) return;

        if (loginUser?.dashboard_notifications?.length > 0) {
            const updatedNotifications = [
                {
                    ...socketData,
                    is_read: false,
                },
                ...loginUser.dashboard_notifications,
            ];

            updateLoginUser({ dashboard_notifications: updatedNotifications });
        }
        else {
            updateLoginUser({
                dashboard_notifications: [{
                    ...socketData,
                    is_read: false,
                }]
            });
        }
    }


    const handleNotificationClick = (notification, close) => {
        // Handle notification click logic here
        if (Object.keys(notification).length === 0 || !close) return;

        const updatedNotifications = loginUser.dashboard_notifications.map((notif) => {
            if (notif.chat_session_id === notification.chat_session_id) {
                return { ...notif, is_read: true };
            }
            else {
                return notif;
            }

        });

        updateLoginUser({ dashboard_notifications: updatedNotifications });

        // Navigate to chat session or relevant page
        router.push(`/dashboard/chatbots/conversations?id=${notification.chatbot_id}&session=${notification.chat_session_id}`);
        close();
    }

    const handleMarkAllAsRead = () => {
        if (loginUser?.dashboard_notifications?.length === 0) return;

        const updatedNotifications = loginUser.dashboard_notifications.map((notif) => ({ ...notif, is_read: true }));

        updateLoginUser({ dashboard_notifications: updatedNotifications });
    }

    const handleClearAllNotifications = () => {
        deleteLoginUser(["dashboard_notifications"]);
    }


    const handleDeleteNotificationClick = (event, notification) => {
        if (Object.keys(notification).length === 0) return;
        event.stopPropagation();

        const updatedNotifications = loginUser.dashboard_notifications.filter((notif) => notif.chat_session_id !== notification.chat_session_id);

        updateLoginUser({ dashboard_notifications: updatedNotifications });
    }

    const unreadCount = loginUser?.dashboard_notifications?.filter(notification => !notification.is_read).length || 0;

    return (
        <Popover className="relative">
            <PopoverButton
                title={`Notifications`}
                className="p-2 bg-light-card-primary hover:bg-light-bg-primary rounded-full relative inline-flex items-center justify-center cursor-pointer outline-none"
            >
                <FaBell className="text-lg " />
                {unreadCount > 0 && (
                    <span class="absolute -top-3 -right-3 inline-flex items-center justify-center bg-red-500 text-white text-xs font-[500] rounded-full h-6 w-6">
                        {unreadCount > 10 ? "10+" : unreadCount}
                    </span>
                )}

            </PopoverButton>
            <PopoverPanel
                transition
                anchor={{
                    to: "bottom",
                    gap: 12,
                    padding: 30,
                }}
                className="bg-light-card-primary rounded-xl shadow-card w-full !max-w-md overflow-hidden z-10"
            >
                {({ close }) => (
                    <Fragment>
                        <div
                            id="modal-header"
                            className="flex justify-between items-center py-4 px-6 border-b border-light-border-primary bg-light-bg-primary"
                        >
                            <div className="flex items-center gap-3">
                                <FaBell className="text-lg text-light-text-primary" />
                                <h2 className="text-lg font-semibold text-light-text-primary">Notifications</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                {(unreadCount > 0) && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        id="mark-all-read"
                                        className="text-secondary text-sm font-medium hover:text-secondary/80 transition-colors outline-none"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                                <button
                                    onClick={() => close()}
                                    className="text-light-text-secondary hover:text-light-text-primary transition-colors">
                                    <FaXmark />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {(loginUser?.dashboard_notifications?.length === 0 || !loginUser?.dashboard_notifications) ? (
                                <div className="p-6 flex flex-col items-center justify-center">
                                    <FaBell className="text-4xl mb-4 text-light-text-secondary" />
                                    <p className="text-light-text-secondary">No new notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-light-border-primary">
                                    {loginUser?.dashboard_notifications?.map((notification, index) => (
                                        <div
                                            onClick={() => handleNotificationClick(notification, close)}
                                            key={index}
                                            class={clsx("flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-gray-100",
                                                notification?.is_read ? "bg-transparent" : "bg-gray-100"
                                            )}
                                        >
                                            <div class="flex-shrink-0 mt-1">
                                                <div class="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                                                    <FaBell class="text-secondary text-base" />
                                                </div>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <h3 class="text-sm font-medium text-light-text-primary mb-1">
                                                    {notification.lead_name ? `New Chat from ${notification.lead_name}` : "New Chat"}
                                                </h3>
                                                <p class="text-xs text-light-text-secondary mb-1">
                                                    {notification.city}, {notification.country_code}
                                                </p>
                                                <span class="text-xs text-gray-400">
                                                    {getRelativeTime(notification.chat_session_created_at)}
                                                </span>
                                            </div>

                                            {!notification?.is_read && (
                                                <div class="w-2 h-2 flex-shrink-0 bg-secondary rounded-full"></div>
                                            )}

                                            <button
                                                onClick={(e) => handleDeleteNotificationClick(e, notification)}
                                                type="button"
                                                className="text-light-text-secondary hover:text-red-400 "
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {(loginUser?.dashboard_notifications?.length > 0) && (
                            <div className="p-4 border-t border-light-border-primary bg-light-bg-primary flex items-center justify-center">
                                <button
                                    onClick={handleClearAllNotifications}
                                    className="text-secondary text-sm font-medium hover:text-secondary/80 transition-colors outline-none"
                                >
                                    Clear all {loginUser?.dashboard_notifications?.length} notifications
                                </button>
                            </div>
                        )}
                    </Fragment>
                )}

            </PopoverPanel>
        </Popover>
    )
}
