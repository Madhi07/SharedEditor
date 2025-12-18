import { useDashboardContext } from "@/context/useDashboardContext";
import { format, parseISO } from "date-fns";
import { Tooltip } from "react-tooltip";

export default function CustomerInfoTooltip({ id = "" }) {

    const { chatConversations } = useDashboardContext();

    return (
        <Tooltip
            id={id}
            openEvents={{
                click: true,
            }}
            closeEvents={{
                click: true
            }}
            role={"dialog"}
            place="bottom-end"
            clickable
            offset={14}
            noArrow={true}
            positionStrategy="fixed"
            opacity={1}
            className="!w-64 z-10 !bg-white !shadow-card !rounded-xl border border-light-border-primary !p-0"
        >
            {chatConversations?.customer_ip_info?.length > 0 ? (
                <div className="space-y-2 p-4">

                    <div className="flex justify-between text-sm">
                        <span className="text-light-text-secondary font-[500]">City</span>
                        <span className=" text-light-text-primary">
                            {chatConversations?.customer_ip_info?.[0]?.city}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-light-text-secondary font-[500]">Region</span>
                        <span className=" text-light-text-primary">
                            {chatConversations?.customer_ip_info?.[0]?.region}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-light-text-secondary font-[500]">Country Name</span>
                        <span className=" text-light-text-primary">
                            {chatConversations?.customer_ip_info?.[0]?.country_name}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-light-text-secondary font-[500]">Postal</span>
                        <span className=" text-light-text-primary">
                            {chatConversations?.customer_ip_info?.[0]?.postal}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-light-text-secondary font-[500]">Time Zone</span>
                        <span className=" text-light-text-primary">
                            {chatConversations?.customer_ip_info?.[0]?.timezone}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-light-text-secondary font-[500]">Date</span>
                        <span className=" text-light-text-primary">
                            {format(parseISO(chatConversations?.customer_ip_info?.[0]?.created_at), "dd-MM-yyyy")}
                        </span>

                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-light-text-secondary font-[500]">Time</span>
                        <span className=" text-light-text-primary">
                            {format(parseISO(chatConversations?.customer_ip_info?.[0]?.created_at), "h:mm a")}
                        </span>
                    </div>

                </div>
            ) : (
                <span className="font-[500] text-center p-4 block text-base text-light-text-primary">
                    No info available.
                </span>
            )}

        </Tooltip>
    )
}
