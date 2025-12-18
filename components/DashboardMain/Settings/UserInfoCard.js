import { usersApiPath } from "@/constants/apiPaths";
import { useAuthContext } from "@/context/useAuthContext";
import { createOrUpdate } from "@/utils/fetchUtils";
import { Country } from "country-state-city";
import { Fragment, useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaUser } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

export default function UserInfoCard() {

    const { loginUser, updateLoginUser } = useAuthContext();

    const [userInfoData, setUserInfoData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        country: ""
    });

    const [formMessage, setFormMessage] = useState({
        status: null,
        message: null
    });

    useEffect(() => {
        if (!loginUser || !loginUser?.token) return;
        setUserInfoData({ ...loginUser })
    }, [loginUser]);

    const handleOnFormSubmit = async (event) => {
        event.preventDefault();

        setFormMessage(prev => ({
            ...prev,
            status: "loading",
            message: null
        }));


        const result = await patchUsersById(loginUser?.user_id, userInfoData);

        if (!result) return;

        setFormMessage(prev => ({
            ...prev,
            status: "ok",
            message: "Sucessfully updated"
        }));

        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            setFormMessage(prev => ({
                ...prev,
                status: null,
                message: null
            }));
        }, 2000);

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
            setFormMessage(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Something went wrong with your request. Please check and try again."
            }));
            return false;
        }

        if (response?.status >= 500) {
            setFormMessage(prev => ({
                ...prev,
                status: "err5xx",
                message: "Server error occurred. Please try again shortly."
            }));
            return false;
        }

        if (response?.status === 201 || response?.status === 200) {
            const resData = await response?.json();
            updateLoginUser(resData);
            return true;
        }

    }


    const onFormChange = () => {
        const hasAnyFormMessages = Object.values(formMessage).some(
            val => val
        );

        if (hasAnyFormMessages) {
            setFormMessage(prev => ({
                ...prev,
                status: null,
                message: null
            }))
        }
    }


    return (
        <div id="profile-card" className="bg-light-card-primary rounded-2xl shadow-sm border border-light-border-primary p-6">
            <h3 className="text-lg font-semibold text-light-text-primary mb-6">Profile Information</h3>

            {/* <div className="flex items-center mb-6">
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" alt="Profile" className="w-16 h-16 rounded-full mr-4" />
                <div>
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">Change Avatar</button>
                </div>
            </div> */}

            <form
                onChange={onFormChange}
                onSubmit={handleOnFormSubmit}
                className="space-y-4"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="first_name"
                            className="block text-sm font-medium text-light-text-secondary mb-2"
                        >
                            First Name
                        </label>
                        <input
                            onChange={(e) => setUserInfoData(prev => ({ ...prev, first_name: e.target.value }))}
                            required
                            id="first_name"
                            type="text"
                            value={userInfoData?.first_name}
                            className="w-full border border-light-border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="last_name"
                            className="block text-sm font-medium text-light-text-secondary mb-2"
                        >
                            Last Name
                        </label>
                        <input
                            onChange={(e) => setUserInfoData(prev => ({ ...prev, last_name: e.target.value }))}
                            required
                            id="last_name"
                            type="text"
                            value={userInfoData?.last_name}
                            className="w-full border border-light-border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-light-text-secondary mb-2"
                    >
                        Email
                    </label>
                    <input
                        onChange={(e) => setUserInfoData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        id="email"
                        type="email"
                        value={userInfoData?.email}
                        className="w-full border border-light-border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                </div>

                <div>
                    <label
                        htmlFor="country"
                        className="block text-sm font-medium text-light-text-secondary mb-2"
                    >
                        Country
                    </label>
                    <select
                        onChange={(e) => setUserInfoData(prev => ({ ...prev, country: e.target.value }))}
                        required
                        value={userInfoData?.country}
                        id="country"
                        className="w-full border border-light-border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
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

                {(formMessage?.status === "err4xx" || formMessage?.status === "err5xx") && (
                    <div className="flex items-center gap-2 w-full text-sm font-[500] my-2">
                        {formMessage?.status === "err4xx" && (
                            <Fragment>
                                <FaCircleXmark className="text-red-400" />
                                <p className="text-red-400">
                                    {formMessage?.message}
                                </p>
                            </Fragment>
                        )}

                        {formMessage?.status === "err5xx" && (
                            <Fragment>
                                <FaExclamationTriangle className="text-orange-400" />
                                <p className="text-orange-400">
                                    {formMessage?.message}
                                </p>
                            </Fragment>
                        )}

                    </div>
                )}

                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:from-primary/80 hover:to-secondary/80 transition-all duration-200"
                >
                    {formMessage?.status === "loading" ? (
                        <Fragment>
                            <LuLoaderCircle className="animate-spin flex-shrink-0" />
                            Updating...
                        </Fragment>
                    ) :
                        formMessage?.status === "ok" ? (
                            <Fragment>
                                <FaCheckCircle className="flex-shrink-0" />
                                {formMessage?.message}
                            </Fragment>
                        ) :
                            "Save Changes"
                    }
                </button>
            </form>


        </div>
    )
}
