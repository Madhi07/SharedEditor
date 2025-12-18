import Image from "next/image"
import { FaClock } from "react-icons/fa"
import { format } from "date-fns";
import Link from "next/link";

export function BlogCard({ data = {} }) {


    const blog_content = Array.isArray(data?.blog_content) ? data?.blog_content?.[0] : data?.blog_content;

    return (
        <Link
            href={`/blogs/${data?.slug}`}
            className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 group cursor-pointer"
        >
            <div className="relative h-48 overflow-hidden">
                {blog_content?.thumbnail_image ?
                    <Image
                        loading="lazy"
                        quality={100}
                        width={1024}
                        height={1024}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={blog_content?.thumbnail_image}
                        alt={data?.title}
                    /> :
                    <div className="w-full h-full flex items-center justify-center bg-dark-card-primary">
                        <Image
                            loading="lazy"
                            quality={100}
                            width={1024}
                            height={1024}
                            className="w-28 h-20 object-contain group-hover:scale-105 transition-transform duration-300"
                            src={"/agentzee-logo.png"}
                            alt={data?.title}
                        />
                    </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-secondary via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {data?.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {blog_content?.description}
                </p>
                <div className="inline-flex gap-2 items-center mb-4 text-gray-400 text-sm">
                    <FaClock className="text-secondary" />
                    {format(blog_content?.created_at, "MMM dd, yyyy")}
                </div>
                <button
                    type="button"
                    className="w-full block bg-gradient-to-r text-center from-primary to-secondary hover:opacity-90 transition-opacity px-4 py-2 rounded-xl text-white font-medium text-sm"
                >
                    Read More
                </button>
            </div>
        </Link>
    )
}
