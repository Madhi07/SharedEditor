import { FaExclamationCircle, FaExclamationTriangle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function FieldMessage({ data = {} }) {

    const { status, message } = data;

    if (!status || !message) return;

    if (status === "required" || status === "timeout-exceeded") {
        return (
            <div id={"action-required"} className="flex items-center gap-2.5 text-red-400 font-[500] text-sm mt-4">
                <FaExclamationCircle />
                <p>{message}</p>
            </div>
        )
    }

    if (status === "loading") {
        return (
            <div id={"action-required"} className="flex items-center gap-2.5 text-secondary font-[500] text-sm mt-4">
                <LuLoaderCircle className="animate-spin size-5"/>
                <p>{message}</p>
            </div>
        )
    }

    if (status === "err4xx") {
        return (
            <div id={"action-required"} className="flex items-center gap-2.5 text-red-400 font-[500] text-sm mt-4">
                <FaCircleXmark />
                <p>{message}</p>
            </div>
        )
    }

    if (status === "err5xx") {
        return (
            <div id={"action-required"} className="flex items-center gap-2.5 text-orange-400 font-[500] text-sm mt-4">
                <FaExclamationTriangle />
                <p>{message}</p>
            </div>
        )
    }
}
