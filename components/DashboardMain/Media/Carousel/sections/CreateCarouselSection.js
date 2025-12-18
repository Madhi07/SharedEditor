import clsx from "clsx";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Fragment, useState } from "react";
import { createOrUpdate } from "@/utils/fetchUtils";
import { chatbotsApiPath } from "@/constants/apiPaths";
import { LuLoaderCircle } from "react-icons/lu";
import { FaCircleXmark } from "react-icons/fa6";
import { useAuthContext } from "@/context/useAuthContext";
import { useRouter } from "next/router";


export default function CreateCarouselSection({ }) {



    const [slideInfo, setSlideInfo] = useState({
        question: "",
        num_slides: "",
    })

    const [resMessages, setResMessages] = useState({
        status: null,
        message: null
    });

    /* ------------------ FIELD HANDLERS ------------------ */

    const handleChange = (key, value) => {
        setSlideInfo((prev) => ({ ...prev, [key]: value }))
    };






    const handleSubmit = async () => {
        // const payload = {
        //     description: formChatbotData?.description,
        //     slides: formChatbotData?.slides,
        //     platforms: formChatbotData?.platforms,
        //     company: loginUser?.company_profile_id
        // };

        // let result = await postChatbots(payload);

        // if (result) {
        //     const timeout = setTimeout(() => {
        //         clearTimeout(timeout);

        //         setFormChatbotData({
        //             type: "Create",
        //             description: "",
        //             slides: 1,
        //             platforms: []
        //         });

        //         setResMessages({ status: null, message: null });

        //         router.push({
        //             pathname: router.pathname,
        //             query: { id: result?.id }
        //         });

        //         setShowCreateSection(false);
        //     }, 2000);
        // }
    };


    return (
        <div className="flex-1 p-4 overflow-y-auto">

            <div className="mx-auto max-w-4xl">

                {/* ------------------ CAROUSEL DESCRIPTION ------------------ */}
                <div className="lg:mb-8 mb-6">
                    <label className="block font-[500] text-light-text-secondary mb-2 text-left">
                       Carousel Description
                    </label>
                    <textarea
                        value={slideInfo?.description}
                        onChange={(event) => { handleChange('description', event.target.value) }}
                        type="text"
                        rows={4}
                        placeholder="Enter your video description..."
                        className="outline-none w-full px-4 py-3 rounded-xl border bg-light-card-primary border-light-border-primary text-light-text-primary resize-none"
                    />
                </div>

                {/* ------------------ SLIDE COUNT ------------------ */}
                <div className="lg:mb-8 mb-6">
                    <label className="block font-[500] text-light-text-secondary mb-2 text-left">
                        Number of Slides
                    </label>
                    <select
                        value={slideInfo?.slides}
                        onChange={(event) => { handleChange('slides', event.target.value) }}
                        className="outline-none w-full px-4 py-3 rounded-xl border bg-light-card-primary border-light-border-primary text-light-text-primary"
                    >
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>{num} Slides</option>
                        ))}
                    </select>
                </div>

                
                {/* ------------------ API STATUS ------------------ */}
                {(resMessages.status) && (
                    <div className="flex items-center justify-center mt-6">
                        {resMessages.status === "loading" && <LuLoaderCircle className="size-6 text-secondary animate-spin" />}
                        {resMessages.status === "ok" && <FaCheckCircle className="size-6 text-green-400" />}
                        {resMessages.status === "err4xx" && <FaCircleXmark className="size-6 text-red-400" />}
                        {resMessages.status === "err5xx" && <FaExclamationTriangle className="size-6 text-orange-400" />}

                        <p className="ml-2.5 text-light-text-primary font-[500] text-lg">
                            {resMessages.message}
                        </p>
                    </div>
                )}

                {/* ------------------ BUTTON ------------------ */}
                {(slideInfo?.description?.trim() && Object.values(slideInfo?.platforms)?.length > 0) && (
                    <div className="text-center mt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={resMessages.status === "loading"}
                            className="inline-flex items-center justify-center px-4 py-2 text-lg font-semibold text-white rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        >
                            Generate Carousel
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
