import { companyProfilesApiPath, usersApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import { createOrUpdate } from "@/utils/fetchUtils";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Country } from "country-state-city";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { FaBuilding, FaCheckCircle, FaExclamationTriangle, FaFlag } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function CompanyInfoPopup() {

    const router = useRouter();

    const [showCompanyInfoPopup, setShowCompanyInfoPopup] = useState(false);

    const { updateLoginUser, loginUser } = useAuthContext();

    const [formMessages, setFormMessages] = useState({
        status: null,
        message: null
    });

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token || token == "null" || token == "undefined") return;

        const country = localStorage.getItem("country");

        const company_profile_id = localStorage.getItem("company_profile_id");

        if (country && country != "null" && country != "undefined" &&
            company_profile_id && company_profile_id != "null" && company_profile_id != "undefined") return;


        setShowCompanyInfoPopup(true);

    }, [router.pathname]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        setFormMessages(prev => ({
            ...prev,
            status: "loading",
            message: null
        }));

        const usersPayload = {
            country: formData.get("country")
        };
        const companyProfilePayload = {
            name: formData.get("company")
        };
        const usersPatchOk = await patchUsersById(loginUser?.user_id, usersPayload);
        const companyProfilePostOk = await postCompanyProfiles(companyProfilePayload);

        if (usersPatchOk && companyProfilePostOk) {
            setFormMessages(prev => ({
                ...prev,
                status: "ok",
                message: "Thanks for providing your details. You can always update them later in settings."
            }));
        }


    }

    const onFormChange = () => {
        const hasAnyFormMessages = Object.values(formMessages).some(
            val => val
        );

        if (hasAnyFormMessages) {
            setFormMessages(prev => ({
                ...prev,
                status: null,
                message: null
            }))
        }
    }

    const patchUsersById = async (user_id = null, payload = {}) => {

        if (!user_id || Object.values(payload).length === 0) return;

        const path = usersApiPath.replace("<id>", user_id);

        const response = await createOrUpdate(payload, "PATCH", path, true);

        if (response?.status >= 400 && response?.status < 500) {
            let resData = {};
            try {
                resData = await response?.json();
            }
            catch (e) { }
            setFormMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Something went wrong with your request. Please check and try again."
            }));
            return false;
        }

        if (response?.status >= 500) {
            setFormMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: "Server error occurred. Please try again shortly."
            }));
            return false;
        }

        if (response?.status === 201 || response?.status === 200) {
            const resData = await response?.json();
            updateLoginUser({
                country: resData?.country
            });
            return true;
        }

    }

    const postCompanyProfiles = async (payload = {}) => {

        if (Object.values(payload).length === 0) return;

        const response = await createOrUpdate(payload, "POST", companyProfilesApiPath, true);

        if (response?.status >= 400 && response?.status < 500) {
            let resData = {};
            try {
                resData = await response?.json();
            }
            catch (e) { }
            setFormMessages(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Something went wrong with your request. Please check and try again."
            }));
            return false;
        }

        if (response?.status >= 500) {
            setFormMessages(prev => ({
                ...prev,
                status: "err5xx",
                message: "Server error occurred. Please try again shortly."
            }));
            return false;
        }

        if (response?.status === 201 || response?.status === 200) {
            const resData = await response?.json();
            updateLoginUser({
                company_profile_id: resData?.id
            });
            return true;
        }

    }

    const onDoneClick = () => {

        setShowCompanyInfoPopup(false);

        if (loginUser?.user_plan === "free") {
            router.push("/dashboard/settings?tab=billing");
        }
        else {
            router.push("/dashboard/agents/chats");
        }
    }

    return (
        <Dialog open={showCompanyInfoPopup} onClose={() => null} className="relative z-20">
            <DialogBackdrop
                transition
                className="fixed z-10 inset-0 bg-dark-bg-secondary/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />


            <div className="fixed inset-0 z-10 w-screen h-screen overflow-y-auto">

                <DialogPanel
                    transition
                    className="w-full h-full flex items-center relative transform transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >

                    <div className="relative bg-gradient-to-br from-secondary/10 to-primary/10 bg-dark-bg-secondary border border-white/20 rounded-3xl max-w-lg w-full mx-auto shadow-2xl animate-bounce-in">
                        <div className="px-6 py-5 flex items-center justify-center border-b border-white/20 rounded-3xl">
                            <h3 className="text-xl font-[600] text-white">Complete Your Profile</h3>
                        </div>
                        {formMessages?.status === "ok" ? (
                            <div className="p-6 w-full flex items-center justify-center flex-col">
                                <FaCheckCircle className="text-green-400 size-8 mb-4" />
                                <p className="font-[500] text-lg mb-4 text-center">
                                    {formMessages?.message}
                                </p>
                                <button
                                    onClick={onDoneClick}
                                    type="button"
                                    className="rounded-full px-4 py-1 font-[500] text-white bg-gradient-to-r from-secondary to-primary transform hover:scale-105"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                onChange={onFormChange}
                                className="p-6"
                            >
                                <div id="company-field" className="space-y-2 mb-4">
                                    <label htmlFor="company" className="text-sm font-medium text-gray-300">Company Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaBuilding className=" text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            className="w-full bg-transparent border border-white/20 rounded-xl px-4 pl-10 py-3 text-white placeholder-gray-400 focus:border-secondary focus:shadow-[0_0_10px_rgba(255,45,146,0.3)] focus:outline-none transition-all duration-300 outline-none"
                                            placeholder="Enter your company"
                                            required
                                        />
                                    </div>
                                </div>

                                <div id="country" className="space-y-2">
                                    <label htmlFor="company" className="text-sm font-medium text-gray-300">Country</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaFlag className=" text-gray-500" />
                                        </div>
                                        <select
                                            id="country"
                                            name="country"
                                            className="w-full bg-transparent border border-white/20 rounded-xl px-4 pl-10 py-3 text-white placeholder-gray-400 focus:border-secondary focus:shadow-[0_0_10px_rgba(255,45,146,0.3)] focus:outline-none transition-all duration-300 outline-none focus:bg-dark-card-primary"
                                            required
                                        >
                                            <option value="" className="text-gray-500">Choose the Country</option>
                                            {Country.getAllCountries().map((country) => (
                                                <option
                                                    key={country?.name?.toLowerCase()}
                                                    value={country?.name}
                                                    className="capitalize"
                                                >
                                                    {country?.name}
                                                </option>
                                            ))}

                                        </select>
                                    </div>
                                </div>

                                {(formMessages?.status === "err4xx" || formMessages?.status === "err5xx") && (
                                    <div className="flex items-center gap-2 w-full text-sm font-[500] my-2">
                                        {formMessages?.status === "err4xx" && (
                                            <Fragment>
                                                <FaCircleXmark className="text-red-400" />
                                                <p className="text-red-400">
                                                    {formMessages?.message}
                                                </p>
                                            </Fragment>
                                        )}

                                        {formMessages?.status === "err5xx" && (
                                            <Fragment>
                                                <FaExclamationTriangle className="text-orange-400" />
                                                <p className="text-orange-400">
                                                    {formMessages?.message}
                                                </p>
                                            </Fragment>
                                        )}

                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={formMessages?.status === "loading"}
                                    className="mt-4 mx-auto w-max flex items-center justify-center bg-gradient-to-r from-secondary to-primary hover:shadow-[0_0_20px_rgba(255,45,146,0.4)] transition-all duration-300 px-4 py-2 rounded-xl text-white font-bold transform hover:scale-105 hover:animate-pulse"
                                >
                                    {formMessages?.status === "loading" ? (
                                        <Fragment>
                                            <LuLoaderCircle className="text-white font-[500] mr-2 animate-spin" />
                                            <span className="text-white font-[500]">Submitting...</span>
                                        </Fragment>
                                    ) : (

                                        "Submit"
                                    )}

                                </button>
                            </form>
                        )}

                    </div>

                </DialogPanel>

            </div>
        </Dialog>
    )
}
