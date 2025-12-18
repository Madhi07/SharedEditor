import { DialogPanel } from "@headlessui/react";
import ModalLayout from "../..";
import { FaCloudUploadAlt, FaInfoCircle, FaTimes } from "react-icons/fa";
import { useRef } from "react";

export default function UploadPortraitImage({ open, onClose = () => null }) {
    const fileRef = useRef();
    return (
        <ModalLayout
            open={open}
            onClose={onClose}
        >

            <DialogPanel
                transition
                className="border-gray-700 relative text-left transform transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Upload Portrait Image</h3>
                        <button
                            id="closeModal"
                            className="dark:text-dark-text-secondary text-light-text-secondary hover:text-white"
                            onClick={onClose}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full from-primary to-secondary bg-gradient-to-r flex items-center justify-center mb-4">
                            <FaCloudUploadAlt className="text-3xl text-white" />
                        </div>
                        <p className="dark:text-dark-text-secondary text-light-text-secondary mb-6 text-center">Drag and drop your image here, or click to browse</p>
                        <input ref={fileRef} type="file" id="fileInput" className="hidden" accept="image/*" />
                        <button
                            id="browseBtn"
                            onClick={() => fileRef?.current?.click()}
                            className="px-6 py-3 rounded-lg from-primary to-secondary bg-gradient-to-r text-white hover:opacity-90 hover-elevate"
                        >
                            Browse Files
                        </button>
                    </div>
                    <div className="mt-6">
                        <div className="flex items-center mb-2">
                            <FaInfoCircle className="text-secondary mr-2" />
                            <span className="text-sm font-medium">Supported formats</span>
                        </div>
                        <p className="dark:text-dark-text-secondary text-light-text-secondary text-sm">JPG, PNG, or HEIC. Maximum file size: 10MB</p>
                    </div>
                </div>
            </DialogPanel>

        </ModalLayout>
    )
}
