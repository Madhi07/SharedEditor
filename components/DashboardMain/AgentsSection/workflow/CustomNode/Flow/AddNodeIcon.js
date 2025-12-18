import { FaPlus } from "react-icons/fa";

export default function AddNodeIcon({ onClick = () => { } }) {
    return (
        <div className="h-full flex items-center justify-center  w-[60px] z-[-1] absolute top-0 left-[100%] gap-[0.1px] cursor-pointer">
            <div className="border border-gray-400 h-[1px] w-full ">
            </div>
            <button className="flex border p-[1px] cursor-pointer" onClick={onClick}>
                <FaPlus className="w-[11px] h-[11px] text-gray-400" />
            </button>
        </div>
    )
}