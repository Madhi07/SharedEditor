import Image from "next/image";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft, FaClock, FaExclamationCircle, FaExclamationTriangle, FaListUl, FaMoon, FaSun } from "react-icons/fa";
import { format } from "date-fns";
import Link from "next/link";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import { slugify } from "@/utils";
import { FaCircleDot } from "react-icons/fa6";
import clsx from "clsx";
import { useRouter } from "next/router";
import { blogNameApiPath } from "@/constants/apiPaths";
import { retrieveOrRemove } from "@/utils/fetchUtils";
import MainLayout from "@/components/MainLayout";
import { NextSeo } from "next-seo";
import { seoData } from "@/constants/seoData";
import { LuLoaderCircle } from "react-icons/lu";
import { MdOutlineSearchOff } from "react-icons/md";


export default function BlogViewPage({ result = {} }) {

    const router = useRouter();
    const [blogData, setBlogData] = useState(result?.data || {});

    const [fetching, setFetching] = useState({
        status: result?.fetching?.status || null,
        message: result?.fetching?.message || null
    });

    const [isDarkMode, setIsDarkMode] = useState(false);
    const blogContainerRef = useRef(null);
    const [toc, setToc] = useState([]);

    useEffect(() => {

        if (!blogContainerRef.current || Object.values(blogData).length === 0) return;

        const div = document.createElement("div");
        div.className = "bn-default-styles";
        div.innerHTML = blog_content?.content || "";

        const headingElements = Array.from(div.querySelectorAll("h1, h2, h3"));

        let mappedArray = [];

        headingElements.forEach((el) => {
            el.setAttribute("id", slugify(el.innerText));
            el.classList.add("scroll-m-[72px]");
            mappedArray.push({
                id: el.id,
                text: el.innerText,
                level: Number(el.tagName.replace("H", "")),
                active: false
            });
        });

        setToc(mappedArray);

        blogContainerRef.current.innerHTML = "";
        blogContainerRef.current.appendChild(div);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setToc((prev) =>
                        prev.map((item) =>
                            item.id === entry.target.id
                                ? { ...item, active: true }
                                : { ...item, active: false }
                        )
                    );
                }
            });
        },
            {
                rootMargin: "-74px 0px -100% 0px",
                threshold: 0
            }
        );

        headingElements.forEach((el) => observer.observe(el));

        return () => {
            observer.disconnect();
        };


    }, [blogData]);


    const handleClickToc = (id = "") => {
        router.push(`#${id}` || "#");

        setToc((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, active: true }
                    : { ...item, active: false }
            )
        );
    }

    const toggleTheme = () => {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }
        else {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        }
    }


    const getBlogBySlug = async (slug = null) => {

        if (!slug) return;

        setFetching(prev => ({
            ...prev,
            status: "loading",
            message: "Loading blog content..."
        }));

        const res = await retrieveOrRemove("GET", `${blogNameApiPath}${slug}`);

        if (res?.status >= 400 && res?.status < 500) {
            const resData = await res?.json();

            setFetching(prev => ({
                ...prev,
                status: "err4xx",
                message: resData?.detail || "Unable to fetch blog."
            }));

            return false;

        }

        if (res?.status >= 500) {

            setFetching(prev => ({
                ...prev,
                status: "err5xx",
                message: "Server error while fetching blog"
            }));

            return false;

        }

        if (res?.status === 200) {
            const resData = await res?.json();
            setBlogData(resData);

            const blog_content = Array.isArray(resData?.blog_content) ? resData?.blog_content?.[0] : resData?.blog_content;
            if (!blog_content?.content) {
                setFetching(prev => ({
                    ...prev,
                    status: "This blog has no content yet",
                    message: null
                }));
            }
            else {
                setFetching(prev => ({
                    ...prev,
                    status: "ok",
                    message: null
                }));
            }

            return true;
        }

    }



    const blog_content = useMemo(() => {
        return Array.isArray(blogData?.blog_content) ? blogData?.blog_content?.[0] : blogData?.blog_content;
    }, [blogData]);


    return (
        <Fragment>
            <NextSeo
                title={blogData?.title || seoData?.blogsPage?.title}
                description={blog_content?.description || seoData?.blogsPage?.description}
                canonical={`https://agentzee.ai/blogs/${blogData?.slug}`}
                additionalMetaTags={[
                    {
                        name: "keywords",
                        content: blogData?.keyword?.length > 0 ? blogData?.keyword?.join(", ") : seoData?.blogsPage?.additionalMetaTags[0]?.content
                    }
                ]}
                languageAlternates={[
                    {
                        href: `https://agentzee.ai/blogs/${blogData?.slug}`,
                        hrefLang: "en-US"
                    }
                ]}
                openGraph={{
                    title: blogData?.title || seoData?.blogsPage?.openGraph?.title,
                    description: blog_content?.description || seoData?.blogsPage?.openGraph?.description,
                    url: `https://agentzee.ai/blogs/${blogData?.slug}`,
                    type: "website",
                    images: [
                        {
                            url: blog_content?.thumbnail_image || "https://agentzee.ai/seo/blog-view-page-default.png",
                            width: 1200,
                            height: 630,
                            alt: blogData?.title || seoData?.blogsPage?.openGraph?.images[0]?.alt,
                            type: "image/png"
                        }
                    ],
                    locale: "en-US",
                    siteName: "Agentzee AI"
                }}
            />
            <MainLayout>
                <div className="w-full dark:bg-dark-bg-primary bg-light-bg-primary">

                    <div id="blog-hero" className="relative h-[500px] overflow-hidden">
                        <div className="absolute inset-0">
                            {blog_content?.thumbnail_image ?
                                <Image
                                    quality={100}
                                    width={1024}
                                    height={1024}
                                    className="w-full h-full object-cover"
                                    src={blog_content?.thumbnail_image}
                                    alt={blogData?.title}
                                /> :
                                <div className="w-full h-full flex items-center justify-center">
                                    <Image
                                        quality={100}
                                        width={1024}
                                        height={1024}
                                        className="w-1/2"
                                        src={isDarkMode ? "/agentzee-logo.png" : "/agentzee-logo-black.png"}
                                        alt={"Agentzee AI Logo"}
                                    />
                                </div>
                            }
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-secondary via-dark-bg-primary/60 to-transparent"></div>


                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 p-4 md:p-16 ">
                            <div className="container mx-auto">
                                <div className="w-full animate-fadeInUp">
                                    <div className="w-full flex justify-between">
                                        <Link
                                            href={"/blogs"}
                                            className="bg-dark-bg-secondary/80 px-4 py-2 rounded-xl inline-flex items-center text-sm mb-6 gap-2 font-[600] hover:bg-dark-bg-secondary"
                                        >
                                            <FaArrowLeft className="text-secondary" />
                                            Back to Blogs
                                        </Link>

                                        <button
                                            onClick={toggleTheme}
                                            title="Toggle theme"
                                            className="inline-flex items-center justify-center p-2 h-max rounded bg-dark-card-primary/70"
                                        >
                                            {isDarkMode ?
                                                <FaMoon /> :
                                                <FaSun />
                                            }
                                        </button>
                                    </div>

                                    <h1 className="max-w-6xl text-4xl md:text-6xl font-bold mb-6 leading-tight line-clamp-3">
                                        {blogData?.title}
                                    </h1>

                                    {blog_content?.created_at && (
                                        <div className="flex items-center space-x-2 bg-dark-bg-secondary/60 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 w-fit text-sm">
                                            <FaClock className="text-secondary" />

                                            <span className="text-gray-300">
                                                {`Published on ${format(blog_content?.created_at || null, "MMMM dd, yyyy")}`}
                                            </span>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="blog-content" className="md:py-12 py-8 relative">
                        <div className="absolute top-0 left-0 sm:w-80 sm:h-80 h-40 w-40 rounded-full bg-primary/10 filter blur-[120px] animate-pulse-slow"></div>
                        <div className="absolute bottom-0 right-0 sm:w-80 sm:h-80 h-40 w-40 rounded-full bg-secondary/10 filter blur-[120px] animate-pulse-slow"></div>

                        <div className="container mx-auto px-4 md:px-8 relative">

                            {(fetching?.status === "err4xx" || fetching?.status === "err5xx" || fetching?.status === "loading" || (fetching?.status === "ok" && !blog_content)) ? (
                                <div className="w-full flex items-center justify-center flex-col max-w-2xl bg-dark-card-primary p-6 mx-auto rounded-2xl">
                                    {fetching?.status === "err4xx" && (
                                        <Fragment>
                                            <FaExclamationCircle className="text-red-400 size-8 mb-4" />
                                            <p className="text-[500] text-lg mb-4">
                                                {fetching?.message}
                                            </p>
                                            <button
                                                onClick={async () => await getBlogBySlug(router.query?.blogview)}
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
                                                onClick={async () => await getBlogBySlug(router.query?.blogview)}
                                                type="button"
                                                className="px-4 py-1 border border-secondary text-secondary font-[500] rounded-full hover:bg-secondary hover:text-white"
                                            >
                                                Reload
                                            </button>
                                        </Fragment>
                                    )}

                                    {(fetching?.status === "ok" && !blog_content) && (
                                        <Fragment>
                                            <MdOutlineSearchOff className="text-primary size-8 mb-4" />
                                            <p className="text-[500] text-lg mb-4">
                                                {fetching?.message}
                                            </p>
                                            <button
                                                onClick={async () => await getBlogBySlug(router.query?.blogview)}
                                                type="button"
                                                className="px-4 py-1 border border-secondary text-secondary font-[500] rounded-full hover:bg-secondary hover:text-white"
                                            >
                                                Reload
                                            </button>
                                        </Fragment>
                                    )}

                                    {fetching?.status === "loading" && (
                                        <div className="flex items-center">
                                            <LuLoaderCircle className="text-primary size-8 mr-2.5 animate-spin" />
                                            <p className="text-[500] text-lg">
                                                {fetching?.message}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Fragment>
                                    <div className="max-w-4xl mx-auto animate-fadeInUp">
                                        <div
                                            ref={blogContainerRef}
                                            className="bn-container dark:text-dark-text-primary text-light-text-primary"
                                        />
                                    </div>

                                    {toc.length > 0 && (
                                        <div className="absolute left-0 top-0 h-full hidden 2xl:block">
                                            <div className="dark:bg-dark-bg-primary bg-light-card-primary w-72 sticky top-20 rounded-xl shadow-xl overflow-hidden border dark:border-dark-border-primary border-light-border-primary max-h-[400px] h-full">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl"></div>
                                                <div className="relative z-10 flex flex-col h-full w-full">
                                                    <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center p-4 border-b dark:border-dark-border-primary border-light-border-primary">
                                                        <FaListUl className="mr-3 text-primary" />
                                                        Table of Contents
                                                    </h3>

                                                    <div key={toc.length} className="space-y-2 flex-1 overflow-y-auto px-4 py-2">
                                                        {toc.map((item, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() => handleClickToc(item.id)}
                                                                className={clsx("flex w-full items-center text-left space-x-3 p-2 rounded-xl transition-all duration-300 group border border-transparent cursor-pointer",
                                                                    (item?.active) ? "bg-primary/10 border-primary/20" : "hover:bg-primary/10 hover:border-primary/20"
                                                                )}
                                                            >
                                                                <FaCircleDot className={clsx("text-xs flex-shrink-0 transition-colors",
                                                                    item?.active ? "text-primary" : "group-hover:text-primary dark:text-dark-text-primary text-light-text-primary"
                                                                )} />
                                                                <span className={clsx("text-sm transition-all duration-300 font-[500] line-clamp-2",
                                                                    item?.active ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" : "dark:text-dark-text-primary text-light-text-primary group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary"
                                                                )}>
                                                                    {item?.text}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Fragment>
                            )}

                        </div>


                    </div>

                </div>
            </MainLayout>
        </Fragment>
    )
}

export async function getServerSideProps(context) {

    const { query } = context;

    let result = {
        data: {},
        fetching: {
            status: null,
            message: null
        }
    };

    const res = await retrieveOrRemove("GET", `${blogNameApiPath}${query?.blogview}`);

    if (res?.status >= 400 && res?.status < 500) {
        const resData = await res?.json();
        result.data = {};
        result.fetching.status = "err4xx";
        result.fetching.message = resData?.detail || "Unable to fetch blog.";

    }

    if (res?.status >= 500) {
        result.data = {};
        result.fetching.status = "err5xx";
        result.fetching.message = "Server error while fetching blog.";

    }

    if (res?.status === 200) {
        const resData = await res?.json();
        result.data = resData;
        result.fetching.status = "ok";
        const blog_content = Array.isArray(resData?.blog_content) ? resData?.blog_content?.[0] : resData?.blog_content;
        if (!blog_content?.content) {
            result.fetching.message = "This blog has no content yet";
        }
        else {
            result.fetching.message = null;
        }
    }

    return {
        props: {
            result
        },
    };
}
