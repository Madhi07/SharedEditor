import { BlogCard } from "@/components/LandingPage/BlogsSection/BlogCard";
import MainLayout from "@/components/MainLayout";
import { blogsApiPath } from "@/constants/apiPaths";
import { seoData } from "@/constants/seoData";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import clsx from "clsx";
import { NextSeo } from "next-seo";
import { Fragment, useMemo, useRef, useState } from "react";
import { FaExclamationCircle, FaExclamationTriangle, FaImage } from "react-icons/fa";
import { FaMagnifyingGlass, FaNewspaper } from "react-icons/fa6";
import { MdOutlineSearchOff } from "react-icons/md";
import ReactPaginate from "react-paginate";

export default function BlogsPage({ blogsData = {} }) {

    const [searchQuery, setSearchQuery] = useState("");

    const blogSectionRef = useRef(null);

    const [blogs, setBlogs] = useState(blogsData?.data || {});

    const [fetching, setFetching] = useState({
        status: blogsData?.status || null,
        message: blogsData?.message || null
    });


    const getBlogs = async (page = 1, page_size = 12) => {

        setFetching(prev => ({
            ...prev,
            status: "loading",
            message: null
        }));

        const res = await retrieveOrRemove("GET", `${blogsApiPath}?page=${page}&page_size=${page_size}`);
        let resData = null;
        try {
            resData = await res?.json()
        }
        catch (e) { }

        if (res?.status >= 400 && res?.status < 500) {
            setFetching(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.message || "Unable to fetch blogs."
            }));
            return false;
        }

        if (res?.status >= 500) {
            setFetching(prev => ({
                ...prev,
                status: "err5xx",
                message: res?.message || resData?.message || "Server error while fetching blogs."
            }));
            return false;
        }

        if (res?.status === 200) {
            if (resData?.data?.length > 0) {
                setBlogs(resData);
                setFetching(prev => ({
                    ...prev,
                    status: "ok",
                    message: null
                }));
            }
            else {
                setFetching(prev => ({
                    ...prev,
                    status: "ok",
                    message: "No blogs available yet."
                }));
            }

            return true;
        }
    }


    const handleOnPageChange = async (page) => {
        if (((page?.selected + 1) === blogs?.pagination?.current_page) || fetching?.status === "loading") return;

        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            blogSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);


        await getBlogs(page?.selected + 1);
    }

    const sortedBlogs = useMemo(() => {
        return blogs?.data?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
    }, [blogs]);

    const filteredBlogsData = useMemo(() => {
        return sortedBlogs?.filter(blog => blog?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    }, [searchQuery]);


    return (
        <Fragment>
            <NextSeo {...seoData.blogsPage} />
            <MainLayout>
                <section className="md:py-40 py-24 md:pb-16 pb-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-bg-secondary to-dark-bg-primary z-0"></div>

                    <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-secondary/20 filter blur-[100px] animate-pulse-slow"></div>

                    <div className="container mx-auto px-4 md:px-8 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                                <p className="text-sm font-medium flex items-center justify-center">
                                    <FaNewspaper className="mr-2 text-secondary" />
                                    AI Insights &amp; Updates
                                </p>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Latest <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Insights</span> &amp; Updates
                            </h1>

                            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                                Stay ahead of the curve with expert insights on 3D AI agents, customer experience innovation, and the future of digital interactions.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="search-section" className="md:pb-16 pb-8 relative">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={`Search blogs...`}
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    className="w-full bg-dark-bg-primary backdrop-blur-sm border border-secondary/30 rounded-2xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:border-secondary/50 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300 text-lg"
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity">
                                    <FaMagnifyingGlass className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    ref={blogSectionRef}
                    id="blog-grid"
                    className="pb-16 relative scroll-mt-24"
                >
                    <div className="container mx-auto px-4 md:px-8">

                        {(fetching?.status === "err4xx" || fetching?.status === "err5xx" || (fetching?.status === "ok" && blogs?.length === 0)) ? (
                            <div className="max-w-2xl bg-dark-card-primary p-6 mx-auto rounded-2xl flex flex-col items-center justify-center">
                                {fetching?.status === "err4xx" && (
                                    <Fragment>
                                        <FaExclamationCircle className="text-red-400 size-8 mb-4" />
                                        <p className="text-[500] text-lg mb-4">
                                            {fetching?.message}
                                        </p>
                                        <button
                                            onClick={async () => await getBlogs()}
                                            type="button"
                                            className="px-4 py-1 border border-secondary text-secondary font-[500] rounded-full hover:bg-secondary hover:text-white"
                                        >
                                            Reload
                                        </button>
                                    </Fragment>
                                )}

                                {fetching?.status === "err5xx" && (
                                    <Fragment>
                                        <FaExclamationTriangle className="text-orange-400 size-8 mb-4" />
                                        <p className="text-[500] text-lg mb-4">
                                            {fetching?.message}
                                        </p>
                                        <button
                                            onClick={async () => await getBlogs()}
                                            type="button"
                                            className="px-4 py-1 border border-secondary text-secondary font-[500] rounded-full hover:bg-secondary hover:text-white"
                                        >
                                            Reload
                                        </button>
                                    </Fragment>
                                )}

                                {(fetching?.status === "ok" && blogs?.length === 0) && (
                                    <Fragment>
                                        <MdOutlineSearchOff className="text-secondary size-8 mb-4" />
                                        <p className="text-[500] text-lg mb-4">
                                            {fetching?.message}
                                        </p>
                                        <button
                                            onClick={async () => await getBlogs()}
                                            type="button"
                                            className="px-4 py-1 border border-secondary text-secondary font-[500] rounded-full hover:bg-secondary hover:text-white"
                                        >
                                            Reload
                                        </button>
                                    </Fragment>
                                )}
                            </div>
                        ) : (
                            <Fragment>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {fetching?.status === "loading" ? (
                                        <BlogCardSkeleton />
                                    ) :
                                        <Fragment>
                                            {filteredBlogsData?.length > 0 ? (
                                                <Fragment>
                                                    {filteredBlogsData?.map((blog, index) => (
                                                        <BlogCard
                                                            key={index}
                                                            data={blog}
                                                        />
                                                    ))}
                                                </Fragment>
                                            ) : (
                                                <div className="col-span-3 bg-dark-card-primary p-6 rounded-2xl flex flex-col items-center justify-center">
                                                    <MdOutlineSearchOff className="text-secondary size-8 mb-4" />
                                                    <p className="text-[500] text-lg mb-4">
                                                        No blogs found for “{searchQuery}”.
                                                    </p>
                                                </div>
                                            )}

                                        </Fragment>
                                    }
                                </div>
                                {blogs?.pagination?.total_pages > 1 && (
                                    <ReactPaginate
                                        onPageChange={handleOnPageChange}
                                        className={clsx("w-max mx-auto flex mt-6 gap-4 items-center p-0",
                                            fetching?.status === "loading" && "pointer-events-none opacity-90"
                                        )}
                                        breakLabel="..."
                                        activeLinkClassName="bg-gradient-to-r from-primary to-secondary font-[500]"
                                        pageLinkClassName="inline-flex items-center justify-center rounded-full w-12 h-12 border border-dark-border-primary bg-dark-card-primary cursor-pointer text-dark-text-primary"
                                        pageRangeDisplayed={3}
                                        pageCount={blogs?.pagination?.total_pages}
                                        nextLabel
                                        previousLabel

                                    />
                                )}
                            </Fragment>
                        )}

                    </div>
                </section>
            </MainLayout>
        </Fragment>
    )
}

function BlogCardSkeleton({ count = 6 }) {
    return (
        <Fragment>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    role="status"
                    className="animate-pulse bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                >
                    <div className="relative h-48 overflow-hidden dark:bg-gray-700 bg-gray-300 flex items-center justify-center">
                        <FaImage className="w-10 h-10 text-gray-200 dark:text-gray-600" />
                    </div>
                    <div className="p-6">
                        <div className="mb-3 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2"></div>
                        <div className="mb-4 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-10/12"></div>

                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-1/4 mb-4">
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-2/5 mb-4">
                        </div>
                    </div>
                </div>
            ))}
        </Fragment>
    )
}

export async function getServerSideProps() {

    let blogsData = {
        data: {},
        status: null,
        message: null
    }

    const res = await retrieveOrRemove("GET", `${blogsApiPath}?page=1&page_size=12`);
    let resData = null;
    try {
        resData = await res?.json()
    }
    catch (e) { }
    if (res?.status === 200) {
        blogsData.data = resData;
        blogsData.status = "ok";
        if (resData?.length === 0) {
            blogsData.message = "No blogs available yet.";
        }

    }

    if (res?.status >= 400 && res?.status < 500) {
        blogsData.status = "err4xx";
        blogsData.message = resData?.mesage || "Unable to fetch blogs."
    }

    if (res?.status >= 500) {
        blogsData.status = "err5xx";
        blogsData.message = res?.message || resData?.message || "Server error while fetching blogs."
    }

    return {
        props: {
            blogsData: blogsData
        },
    };
}
