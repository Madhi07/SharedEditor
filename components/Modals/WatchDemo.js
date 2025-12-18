import { DialogPanel } from "@headlessui/react";
import ModalLayout from ".";
import { FaTimes } from "react-icons/fa";

export default function WatchDemo({ onClose, open }) {
    return (
        <ModalLayout
            onClose={onClose}
            open={open}
        >
            <DialogPanel
                transition
                className="flex w-full relative transform shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
                <div className="max-w-[768px] w-full h-[500px] mx-auto shadow-card flex flex-col">
                    <button
                        className="bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600 transition-colors w-max ml-auto mb-2 cursor-pointer"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>
                    <iframe
                        src="https://www.youtube.com/embed/r-4jIkvK4_M?si=0eTa3pVZ5jR7FFbG"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="flex w-full h-full border border-gray-700 rounded-xl"
                    />
                </div>
            </DialogPanel>
        </ModalLayout>
    )
}
