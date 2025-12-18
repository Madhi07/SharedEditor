import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { FaCircleXmark, FaXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function DeleteConfirmation({
    status = null,
    message = null,
    handleCancelClick,
    handleDeleteClick,
    handleRetryClick,
    
}) {
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
                        <div className="bg-light-card-primary rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 md:mx-auto relative">
                            {status !== "loading" && (
                                <button
                                    onClick={handleCancelClick}
                                    type="button"
                                    className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-toggle="deleteModal"
                                >
                                    <FaXmark className="size-5" />
                                    <span className="sr-only">Close modal</span>
                                </button>
                            )}
                            {(status === "loading" || status === "err4xx" || status === "err5xx" || status === "ok") ? (
                                <div className={clsx("flex items-center justify-center gap-4 p-4",
                                    (status === "loading") ? "flex-row" : "flex-col"
                                )}>
                                    {status === "loading" && (
                                        <LuLoaderCircle className="size-8 animate-spin text-secondary" />
                                    )}

                                    {status === "err4xx" && (
                                        <FaCircleXmark className="text-red-400 size-8" />
                                    )}

                                    {status === "err5xx" && (
                                        <FaExclamationTriangle className="text-orange-400 size-8" />
                                    )}

                                    {status === "ok" && (
                                        <FaCheckCircle className="text-green-400 size-8" />
                                    )}

                                    {message && (
                                        <p className="text-center text-light-text-primary font-[500] text-lg">
                                            {message}
                                        </p>
                                    )}

                                    {(status !== "loading" && status !== "ok") && (
                                        <button
                                            onClick={handleRetryClick}
                                            type="button"
                                            className="inline-flex items-center justify-center py-1 px-4 rounded-full border border-secondary hover:bg-secondary hover:text-white text-secondary"
                                        >
                                            Retry
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <Fragment>
                                    <FaTrash className="text-light-text-secondary w-10 h-10 mb-4 flex-shrink-0 mx-auto" />
                                    <p className="mb-4 text-light-text-secondary font-[500]">
                                        Are you sure you want to delete this item?
                                    </p>
                                    <div className="flex justify-center items-center space-x-4">
                                        <button
                                            onClick={handleCancelClick}
                                            data-modal-toggle="deleteModal"
                                            type="button"
                                            className="py-2 px-3 text-sm font-medium text-light-text-secondary bg-white rounded-lg border border-light-border-primary hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary/30 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                        >
                                            No, cancel
                                        </button>
                                        <button
                                            onClick={handleDeleteClick}
                                            type="submit"
                                            className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                                        >
                                            Yes, I'm sure
                                        </button>
                                    </div>
                                </Fragment>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
