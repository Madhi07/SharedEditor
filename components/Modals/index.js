import { Dialog, DialogBackdrop } from "@headlessui/react";

export default function ModalLayout({ children, open, onClose }) {
    return (
        <Dialog open={open ? true : false} onClose={onClose} className="relative z-20">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-dark-bg-secondary/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center p-6 text-center items-center">
                    {children}
                </div>
            </div>
        </Dialog>
    )
}
