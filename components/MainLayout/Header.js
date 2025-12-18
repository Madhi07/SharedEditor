import Link from "next/link";
import { headerNavLinks } from "./constants";
import { FaBars, FaChartLine, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { Dialog, DialogPanel } from "@headlessui/react";
import { FaXmark } from "react-icons/fa6";
import { Fragment, useState } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import LoggedInPopover from "./LoggedInPopover";
import { createOrUpdate } from "@/utils/fetchUtils";
import { logoutApiPath } from "@/constants/apiPaths";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { loginUser, loading, logout } = useAuthContext();

    const onLogout = async () => {
        const payload = {
            key: loginUser?.token || localStorage.getItem("token")
        }
        await createOrUpdate(payload, "POST", logoutApiPath);
        logout();
    }

    return (
        <header id="header" className="fixed top-0 left-0 w-full z-20 transition-all duration-300 bg-dark-bg-secondary/80 backdrop-blur-md">
            <div className="container mx-auto px-4 md:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link
                            href={"/"}
                            className="flex items-center cursor-pointer"
                        >
                            <Image
                                src={'/agentzee-logo.png'}
                                alt="AgentZee AI"
                                unoptimized
                                quality={100}
                                width={1920}
                                height={1080}
                                className="sm:w-40 w-36 object-contain h-auto"
                            ></Image>
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center space-x-6">
                        {headerNavLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>



                    <div className="flex items-center space-x-4">
                        {!loading ?
                            loginUser?.token ?
                                <LoggedInPopover
                                    onLogout={onLogout}
                                /> :
                                <Fragment>
                                    <Link
                                        href="/login"
                                        className="text-gray-300 hover:text-white transition-colors hidden md:block cursor-pointer"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/sign-up"
                                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-6 py-2 rounded-full text-white font-medium cursor-pointer"
                                    >
                                        Get Started
                                    </Link>
                                    <button className="text-white md:hidden" onClick={() => setMobileMenuOpen(true)}>
                                        <FaBars className="size-5" />
                                    </button>
                                </Fragment> : ""
                        }

                    </div>

                </div>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
                    <div className="fixed inset-0 z-10" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-dark-bg-secondary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
                        <div className="flex items-center justify-between">
                            <Link
                                href={"/"}
                                className="flex items-center cursor-pointer -m-1.5 p-1.5"
                            >
                                <span className="sr-only">AgentZee AI</span>
                                <Image
                                    src={'/agentzee-logo.png'}
                                    alt="AgentZee AI"
                                    unoptimized
                                    quality={100}
                                    width={1920}
                                    height={1080}
                                    className="sm:w-40 w-36 object-contain h-auto"
                                ></Image>
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-400"
                            >
                                <span className="sr-only">Close menu</span>
                                <FaXmark aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/25">
                                <div className="space-y-2 py-6">
                                    {headerNavLinks.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-gray-800"
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                                <div className="py-6 flex flex-col">

                                    {loginUser?.token ?
                                        <Fragment>

                                            <Link
                                                href="/dashboard"
                                                className="-mx-3 inline-flex items-center rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-gray-800"
                                            >
                                                <FaChartLine className='mr-2' />
                                                Dashboard
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => { logout(); setMobileMenuOpen(false) }}
                                                className='-mx-3 inline-flex items-center rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-gray-800'
                                            >
                                                <FaSignOutAlt className='mr-2' />
                                                Logout
                                            </button>
                                        </Fragment> :
                                        <Link
                                            href="/login"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-gray-800"
                                        >
                                            Log in
                                        </Link>
                                    }

                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </div >
        </header >
    )
};
